import { INestApplication } from "@nestjs/common";

import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import * as Github from "@octokit/webhooks-types";
import faker from "faker";
import { DeepPartial } from "typeorm";
import { GithubSyncIncomingService } from "../github.sync.incoming";
import { Project } from "@dewo/api/models/Project";
import { Task, TaskStatus } from "@dewo/api/models/Task";
import { ThreepidSource } from "@dewo/api/models/Threepid";
import { User } from "@dewo/api/models/User";
import { GithubService } from "../../github.service";
import { GithubProjectIntegrationFeature } from "@dewo/api/models/ProjectIntegration";

const installationId = 21818562;

const githubUser: DeepPartial<Github.User> = {
  login: "davidfant",
  id: 17096641,
  type: "User",
};

const githubOrganization: DeepPartial<Github.Organization> = {
  login: "deworkxyz-testing",
  id: faker.datatype.number(),
};

const githubIssue: DeepPartial<Github.Issue> = {
  id: faker.datatype.number(),
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraph(),
  user: githubUser,
  number: faker.datatype.number(),
  state: "open",
  assignees: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const githubPullRequest: DeepPartial<Github.PullRequest> = {
  id: faker.datatype.number(),
  number: 135,
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraph(),
  user: githubUser,
  state: "open",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const githubRepository: DeepPartial<Github.Repository> = {
  id: faker.datatype.number(),
  name: "issues",
  private: false,
  owner: githubOrganization,
};

describe("GithubSyncIncomingService", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let service: GithubSyncIncomingService;

  let project: Project;
  let task: Task;
  let user: User;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    service = app.get(GithubSyncIncomingService);

    ({ project } = await fixtures.createProjectWithGithubIntegration(
      {},
      [
        GithubProjectIntegrationFeature.SHOW_BRANCHES,
        GithubProjectIntegrationFeature.SHOW_PULL_REQUESTS,
      ],
      {
        installationId,
        organization: githubOrganization.login!,
        repo: githubRepository.name!,
      }
    ));

    user = await fixtures.createUser({
      source: ThreepidSource.github,
      threepid: String(githubUser.id!),
      config: { profile: { username: githubUser.login! } },
    });
    task = await fixtures.createTask({ projectId: project.id });
    await fixtures.createGithubIssue({
      taskId: task.id,
      externalId: githubIssue.id,
      number: githubIssue.number,
    });
    await fixtures.createGithubPullRequest({
      externalId: githubPullRequest.id,
      taskId: task.id,
    });
  });

  afterAll(() => app.close());

  describe("webhook", () => {
    describe("IssuesAssignedEvent", () => {
      it("issue assigned", async () => {
        const event: DeepPartial<Github.IssuesAssignedEvent> = {
          action: "assigned",
          issue: githubIssue,
          assignee: githubUser,
          repository: githubRepository,
          sender: githubUser,
          installation: { id: installationId },
          organization: githubOrganization,
        };
        await service.handleWebhook(event as any);

        const updatedTask = await fixtures.getTask(task.id);
        expect(updatedTask!.assignees).toContainEqual(
          expect.objectContaining({ id: user.id })
        );
      });
    });

    describe("IssuesUnassignedEvent", () => {
      it("issue unassigned", async () => {
        await fixtures.updateTask({ id: task.id, assignees: [user] });

        const event: DeepPartial<Github.IssuesUnassignedEvent> = {
          action: "unassigned",
          issue: githubIssue,
          assignee: githubUser,
          repository: githubRepository,
          sender: githubUser,
          installation: { id: installationId },
          organization: githubOrganization,
        };
        await service.handleWebhook(event as any);

        const updatedTask = await fixtures.getTask(task.id);
        expect(updatedTask!.assignees).not.toContainEqual(
          expect.objectContaining({ id: user.id })
        );
      });
    });

    describe("PullRequestReviewRequestedEvent", () => {
      it("PR review requested", async () => {
        const event: DeepPartial<Github.PullRequestReviewRequestedEvent> = {
          action: "review_requested",
          pull_request: githubPullRequest,
          requested_reviewer: githubUser,
          repository: githubRepository,
          sender: githubUser,
          installation: { id: installationId },
          organization: githubOrganization,
        };
        await service.handleWebhook(event as any);

        const updatedTask = await fixtures.getTask(task.id);
        expect(updatedTask!.owners).toContainEqual(
          expect.objectContaining({ id: user.id })
        );
      });
    });

    describe("PullRequestOpenedEvent", () => {
      it("should assign task owners as PR reviewers", async () => {
        await fixtures.updateTask({ id: task.id, owners: [user] });

        const event: DeepPartial<Github.PullRequestOpenedEvent> = {
          action: "opened",
          pull_request: githubPullRequest as any,
          repository: githubRepository,
          sender: githubUser,
          installation: { id: installationId },
          organization: githubOrganization,
        };
        await service.handleWebhook(event as any);

        const { data: pr } = await app
          .get(GithubService)
          .createClient(installationId)
          .pulls.get({
            pull_number: githubPullRequest.number!,
            repo: githubRepository.name!,
            owner: githubOrganization.login!,
          });
        expect(pr.requested_reviewers).toContainEqual(
          expect.objectContaining({ id: githubUser.id! })
        );
      });

      it("should link PR to task when referencing in body", async () => {
        const task = await fixtures.createTask({
          name: "task title",
          projectId: project.id,
        });
        const issue = await fixtures.createGithubIssue({
          taskId: task.id,
        });

        const createPrEvent: DeepPartial<Github.PullRequestEvent> = {
          action: "opened",
          number: 3,
          pull_request: {
            id: 924652457,
            node_id: "PR_kwDOHO7Xq843HROp",
            number: 3,
            state: "open",
            title: "pr title",
            body: `hello!\r\ncloses #${issue.externalId}\r\nthird row`,
            head: {
              ref: "ea/rm",
            },
            base: {
              ref: "main",
            },
          },
          repository: githubRepository,
        };
        await service.handleWebhook(createPrEvent as any);

        const pr = await fixtures.getGithubPullRequestByTaskId(task.id);
        expect(pr).toBeDefined();
      });
    });

    describe("CreateEvent", () => {
      it("should create a branch in the DB", async () => {
        const branchName = `username/dw-${task.number}/feature`;
        const event: DeepPartial<Github.CreateEvent> = {
          ref: `refs/head/${branchName}`,
          ref_type: "branch",
          master_branch: "master",
          installation: { id: installationId },
          repository: githubRepository,
        };
        await service.handleWebhook(event as any);

        const branch = await fixtures.getGithubBranchbyName(branchName);
        expect(branch?.name).toEqual(branchName);
      });

      it("should update a task's status to IN_PROGRESS when its branch is created", async () => {
        const branchName = `username/dw-${task.number}/feature`;
        const event: DeepPartial<Github.CreateEvent> = {
          ref: `refs/head/${branchName}`,
          ref_type: "branch",
          master_branch: "master",
          installation: { id: installationId },
          repository: githubRepository,
        };
        await service.handleWebhook(event as any);

        const updatedTask = await fixtures.getTask(task.id);
        expect(updatedTask!.status).toEqual(TaskStatus.IN_PROGRESS);
      });
    });

    describe("DeleteEvent", () => {
      it("should mark branch as deleted when deleting github ref", async () => {
        const branchName = `username/dw-${task.number}/feature`;
        const event: DeepPartial<Github.DeleteEvent> = {
          ref: `refs/head/${branchName}`,
          ref_type: "branch",
          installation: { id: installationId },
          repository: githubRepository,
        };
        await service.handleWebhook(event as any);

        const branch = await fixtures.getGithubBranchbyName(branchName);
        expect(branch?.deletedAt).toBeDefined();
      });
    });
  });
});
