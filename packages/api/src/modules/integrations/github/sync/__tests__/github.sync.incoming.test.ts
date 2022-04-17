import { INestApplication } from "@nestjs/common";

import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import * as Github from "@octokit/webhooks-types";
import faker from "faker";
import { DeepPartial } from "typeorm";
import { GithubSyncIncomingService } from "../github.sync.incoming";
import { Project } from "@dewo/api/models/Project";
import { Task } from "@dewo/api/models/Task";
import { ThreepidSource } from "@dewo/api/models/Threepid";
import { User } from "@dewo/api/models/User";

const githubUser: DeepPartial<Github.User> = {
  login: faker.internet.userName(),
  id: faker.datatype.number(),
  type: "User",
};

const githubOrganization: DeepPartial<Github.Organization> = {
  login: faker.internet.userName(),
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
  number: faker.datatype.number(),
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraph(),
  user: githubUser,
  state: "open",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const githubRepository: DeepPartial<Github.Repository> = {
  id: faker.datatype.number(),
  name: faker.internet.userName(),
  private: false,
  owner: githubOrganization,
};

describe("GithubSyncIncomingService", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let service: GithubSyncIncomingService;

  let project: Project;
  let installationId: number;
  let task: Task;
  let user: User;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    service = app.get(GithubSyncIncomingService);

    installationId = faker.datatype.number();
    ({ project } = await fixtures.createProjectWithGithubIntegration(
      {},
      {},
      {
        installationId,
        organization: githubOrganization.login!,
        repo: githubRepository.name!,
      }
    ));

    user = await fixtures.createUser({
      source: ThreepidSource.github,
      threepid: String(githubUser.id!),
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
});