import { HttpStatus, INestApplication } from "@nestjs/common";
import faker from "faker";

import { Fixtures } from "../../../../testing/Fixtures";
import { WebhookTestClient } from "../../../../testing/WebhookTestClient";
import { getTestApp } from "../../../../testing/getTestApp";
import { TaskStatusEnum } from "../../../../models/Task";
import {
  ProjectIntegrationSource,
  GithubProjectIntegrationFeature,
  GithubProjectIntegrationConfig,
} from "../../../../models/ProjectIntegration";

describe("GithubController", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let client: WebhookTestClient;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    client = app.get(WebhookTestClient);
  });

  afterAll(() => app.close());

  describe("webhook", () => {
    it("should create a branch in db", async () => {
      const project = await fixtures.createProject();
      const task = await fixtures.createTask({
        projectId: project.id,
        status: TaskStatusEnum.IN_PROGRESS,
      });
      const githubIntegration = await fixtures.createProjectIntegation({
        projectId: project.id,
        source: ProjectIntegrationSource.github,
        config: {
          installationId: faker.datatype.string(),
          features: [GithubProjectIntegrationFeature.ADD_PR_TO_TASK],
        },
      });

      const response = await client.request({
        app,
        body: {
          ref: `refs/heads/username/dw-${task.number}/feature`,
          pull_request: {
            title: "test",
            state: "open",
            html_url: faker.internet.url(),
            number: faker.datatype.number(),
            draft: false,
          },
          installation: {
            id: (githubIntegration.config as GithubProjectIntegrationConfig)
              .installationId,
          },
          repository: {
            full_name: "username/my-repo",
          },
        } as any,
      });

      expect(response.status).toEqual(HttpStatus.CREATED);
    });
  });

  xit("should update a task's status to done when a PR is merged", async () => {
    const project = await fixtures.createProject();
    const task = fixtures.createTask({
      projectId: project.id,
      status: TaskStatusEnum.IN_REVIEW,
    });
    const { id: taskId, number: taskNumber } = await task.then();
    const branch = await fixtures.createGithubBranch({
      name: `refs/heads/username/dw-${taskNumber}/feature`,
      task,
      taskId,
      repository: "username/my-repo",
    });
    const pullRequest = await fixtures.createGithubPullRequest({
      title: faker.datatype.string(),
      task,
      taskId,
      branchName: branch.name,
    });
    const githubIntegration = await fixtures.createProjectIntegation({
      projectId: project.id,
      source: ProjectIntegrationSource.github,
      config: {
        installationId: faker.datatype.string(),
        features: [GithubProjectIntegrationFeature.ADD_PR_TO_TASK],
      },
    });

    const response = await client.request({
      app,
      body: {
        ref: branch.name,
        action: "closed",
        pull_request: {
          title: pullRequest.title,
          state: "open",
          html_url: faker.internet.url(),
          number: faker.datatype.number(),
          draft: false,
          merged: true,
        },
        installation: {
          id: (githubIntegration.config as GithubProjectIntegrationConfig)
            .installationId,
        },
        repository: {
          full_name: branch.repository,
        },
      } as any,
    });

    const updatedTask = await fixtures.getTask(taskId);
    console.log(updatedTask);
    console.log(pullRequest);

    expect(response.status).toEqual(HttpStatus.CREATED);
    expect(updatedTask?.status).toEqual(TaskStatusEnum.DONE);
  });
});
