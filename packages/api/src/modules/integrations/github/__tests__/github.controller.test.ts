import { HttpStatus, INestApplication } from "@nestjs/common";
import faker from "faker";

import { ProjectIntegrationType } from "@dewo/api/models/ProjectIntegration";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { WebhookTestClient } from "@dewo/api/testing/WebhookTestClient";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { TaskStatusEnum } from "@dewo/api/models/Task";
import { GithubPullRequestActions } from "../github.controller";
import { GithubPullRequestStatusEnum } from "@dewo/api/models/GithubPullRequest";

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

  async function createProjectWithGithubIntegration(installationId: string) {
    const project = await fixtures.createProject();
    await fixtures.createProjectIntegration({
      projectId: project.id,
      type: ProjectIntegrationType.GITHUB,
      config: {
        installationId,
        features: [],
      },
    });
    return project;
  }

  describe("webhook", () => {
    const installationId = faker.datatype.string();

    it("should create a branch in the DB", async () => {
      const project = await createProjectWithGithubIntegration(installationId);
      const task = await fixtures.createTask({
        projectId: project.id,
        status: TaskStatusEnum.IN_PROGRESS,
      });
      const branchName = `username/dw-${task.number}/feature`;

      const response = await client.request({
        app,
        body: {
          ref: branchName,
          pull_request: {
            title: "test",
            state: "open",
            html_url: faker.internet.url(),
            number: faker.datatype.number(),
            draft: false,
          },
          installation: {
            id: installationId,
          },
          repository: {
            full_name: "username/my-repo",
          },
        } as any,
      });

      expect(response.status).toEqual(HttpStatus.CREATED);
      const branchFromDb = await fixtures.getGithubBranchbyName(branchName);
      expect(branchFromDb?.name).toEqual(branchName);
    });

    it("should update a task's status to done when a PR is merged", async () => {
      const project = await createProjectWithGithubIntegration(installationId);
      const task = await fixtures.createTask({
        projectId: project.id,
        status: TaskStatusEnum.IN_REVIEW,
      });
      const branch = await fixtures.createGithubBranch({
        name: `refs/heads/username/dw-${task.number}/feature`,
        taskId: task.id,
        repository: "username/my-repo",
      });
      const pullRequest = await fixtures.createGithubPullRequest({
        title: faker.datatype.string(),
        taskId: task.id,
        branchName: branch.name,
      });

      const prOpenedResponse = await client.request({
        app,
        body: {
          ref: branch.name,
          action: GithubPullRequestActions.OPENED,
          pull_request: {
            title: pullRequest.title,
            state: "open",
            html_url: faker.internet.url(),
            number: faker.datatype.number(),
            draft: false,
            merged: false,
          },
          installation: {
            id: installationId,
          },
          repository: {
            full_name: branch.repository,
          },
        } as any,
      });

      const prFromDb = await fixtures.getGithubPullRequestByTaskId(task.id);
      const taskFromDb = await fixtures.getTask(task.id);
      expect(prOpenedResponse.status).toEqual(HttpStatus.CREATED);
      expect(prFromDb?.taskId).toEqual(task.id);
      expect(prFromDb?.status).toEqual(GithubPullRequestStatusEnum.OPEN);
      expect(taskFromDb?.status).toEqual(TaskStatusEnum.IN_REVIEW);

      const prClosedResponse = await client.request({
        app,
        body: {
          ref: branch.name,
          action: GithubPullRequestActions.CLOSED,
          pull_request: {
            title: pullRequest.title,
            state: "open",
            html_url: faker.internet.url(),
            number: faker.datatype.number(),
            draft: false,
            merged: true,
          },
          installation: {
            id: installationId,
          },
          repository: {
            full_name: branch.repository,
          },
        } as any,
      });

      const mergedPrFromDb = await fixtures.getGithubPullRequestByTaskId(
        task.id
      );
      const doneTaskFromDb = await fixtures.getTask(task.id);
      expect(prClosedResponse.status).toEqual(HttpStatus.CREATED);
      expect(mergedPrFromDb?.taskId).toEqual(task.id);
      expect(mergedPrFromDb?.status).toEqual(
        GithubPullRequestStatusEnum.MERGED
      );
      expect(doneTaskFromDb?.status).toEqual(TaskStatusEnum.DONE);
    });
  });
});
