import { Project } from "@dewo/api/models/Project";
import { GithubProjectIntegrationFeature } from "@dewo/api/models/ProjectIntegration";
import { Task, TaskStatus } from "@dewo/api/models/Task";
import { ThreepidSource } from "@dewo/api/models/Threepid";
import { User } from "@dewo/api/models/User";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { INestApplication } from "@nestjs/common";
import { GithubIntegrationService } from "../../github.integration.service";
import { GithubService } from "../../github.service";
import { GithubSyncOutgoingService } from "../github.sync.outgoing";

// https://github.com/organizations/deworkxyz-testing/settings/installations/21818562
const githubRepo = "issues";
const githubOrganization = "deworkxyz-testing";
const installationId = 21818562;
const githubUserId = 17096641;
const githubUsername = "davidfant";
const githubPullRequestNumber = 135;

describe("GithubSyncOutgoingService", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let service: GithubSyncOutgoingService;

  let project: Project;
  let task: Task;
  let user: User;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    service = app.get(GithubSyncOutgoingService);

    ({ project } = await fixtures.createProjectWithGithubIntegration(
      {},
      [
        GithubProjectIntegrationFeature.CREATE_TASKS_FROM_ISSUES,
        GithubProjectIntegrationFeature.CREATE_ISSUES_FROM_TASKS,
      ],
      { installationId, organization: githubOrganization, repo: githubRepo }
    ));

    user = await fixtures.createUser({
      source: ThreepidSource.github,
      threepid: String(githubUserId),
      config: { profile: { username: githubUsername } },
    });
  });

  beforeEach(async () => {
    task = await fixtures.createTask({ projectId: project.id });
    await app.get(GithubIntegrationService).createIssueFromTask(task);
    await fixtures.createGithubPullRequest({
      taskId: task.id,
      number: githubPullRequestNumber,
    });
  });

  afterAll(() => app.close());

  async function req(current: Partial<Task>, prev: Partial<Task>) {
    const taskBefore = await fixtures.updateTask({ id: task.id, ...prev });
    const taskAfter = await fixtures.updateTask({ id: task.id, ...current });
    await service.handle(taskAfter!, taskBefore);
  }

  async function getIssue() {
    const updatedTask = await fixtures.getTask(task.id);
    const issue = await updatedTask!.githubIssue;
    const res = await app
      .get(GithubService)
      .createClient(installationId)
      .issues.get({
        issue_number: issue!.number,
        repo: githubRepo,
        owner: githubOrganization,
      });
    return res.data;
  }

  async function getPullRequest() {
    const updatedTask = await fixtures.getTask(task.id);
    const prs = await updatedTask!.githubPullRequests;
    const res = await app
      .get(GithubService)
      .createClient(installationId)
      .pulls.get({
        pull_number: prs[0].number,
        repo: githubRepo,
        owner: githubOrganization,
      });
    return res.data;
  }

  describe("statusChanged", () => {
    it("should open and close issue", async () => {
      expect((await getIssue()).state).toEqual("open");

      await req({ status: TaskStatus.DONE }, { status: TaskStatus.TODO });
      expect((await getIssue()).state).toBe("closed");

      await req({ status: TaskStatus.TODO }, { status: TaskStatus.DONE });
      expect((await getIssue()).state).toBe("open");
    });
  });

  describe("assigneesChanged", () => {
    it("should add and remove Github issue assignees", async () => {
      await req({ assignees: [user] }, { assignees: [] });
      expect((await getIssue()).assignee?.id).toEqual(githubUserId);

      await req({ assignees: [] }, { assignees: [user] });
      expect((await getIssue()).assignee).toBe(null);
    });
  });

  describe("ownersChanged", () => {
    it("should add and remove Github pull request reviewers", async () => {
      await req({ owners: [user] }, { owners: [] });
      expect((await getPullRequest()).requested_reviewers).toContainEqual(
        expect.objectContaining({ id: githubUserId })
      );

      await req({ owners: [] }, { owners: [user] });
      expect((await getPullRequest()).requested_reviewers).not.toContainEqual(
        expect.objectContaining({ id: githubUserId })
      );
    });
  });
});
