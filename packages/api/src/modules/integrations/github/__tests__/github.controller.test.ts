import { HttpStatus, INestApplication } from "@nestjs/common";
import faker from "faker";

import { Fixtures } from "@dewo/api/testing/Fixtures";
import { WebhookTestClient } from "@dewo/api/testing/WebhookTestClient";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { TaskStatus } from "@dewo/api/models/Task";
import { GithubPullRequestActions } from "../github.controller";
import { GithubPullRequestStatusEnum } from "@dewo/api/models/GithubPullRequest";
import { IssuesOpenedEvent } from "@octokit/webhooks-types";
import { DeepPartial } from "typeorm";

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
    it("should create a branch in the DB", async () => {
      const { project, github } =
        await fixtures.createProjectWithGithubIntegration();
      const task = await fixtures.createTask({
        projectId: project.id,
        status: TaskStatus.IN_PROGRESS,
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
          installation: { id: github.installationId },
          repository: {
            name: github.repo,
            owner: { login: github.organization },
          },
        } as any,
      });

      expect(response.status).toEqual(HttpStatus.CREATED);
      const branchFromDb = await fixtures.getGithubBranchbyName(branchName);
      expect(branchFromDb?.name).toEqual(branchName);
    });

    it("should update a task's status to done when a PR is merged", async () => {
      const { project, github } =
        await fixtures.createProjectWithGithubIntegration();
      const task = await fixtures.createTask({
        projectId: project.id,
        status: TaskStatus.IN_REVIEW,
      });
      const branch = await fixtures.createGithubBranch({
        name: `refs/heads/username/dw-${task.number}/feature`,
        taskId: task.id,
        organization: github.organization,
        repo: github.repo,
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
          installation: { id: github.installationId },
          repository: {
            name: github.repo,
            owner: { login: github.organization },
          },
        } as any,
      });

      const prFromDb = await fixtures.getGithubPullRequestByTaskId(task.id);
      const taskFromDb = await fixtures.getTask(task.id);
      expect(prOpenedResponse.status).toEqual(HttpStatus.CREATED);
      expect(prFromDb?.taskId).toEqual(task.id);
      expect(prFromDb?.status).toEqual(GithubPullRequestStatusEnum.OPEN);
      expect(taskFromDb?.status).toEqual(TaskStatus.IN_REVIEW);

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
          installation: { id: github.installationId },
          repository: {
            name: github.repo,
            owner: { login: github.organization },
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
      expect(doneTaskFromDb?.status).toEqual(TaskStatus.DONE);
    });

    describe("issue created", () => {
      it("should save task with reference to Github issue", async () => {
        const { project, github } =
          await fixtures.createProjectWithGithubIntegration();

        const url = faker.internet.url();
        const name = faker.lorem.sentence();
        const description = faker.lorem.sentence();

        await client.request<DeepPartial<IssuesOpenedEvent>>({
          app,
          body: {
            action: "opened",
            issue: {
              state: "open",
              url,
              title: name,
              body: description,
            },
            installation: { id: github.installationId },
            repository: {
              name: github.repo,
              owner: { login: github.organization },
            },
          },
        });

        const tasks = await project.tasks;
        const task = tasks[0];
        expect(task).toBeDefined();
        expect(task!.name).toEqual(name);
        expect(task!.status).toEqual(TaskStatus.TODO);
        expect(task.description).toContain(description);
        expect(task.description).toContain(url);
      });
    });
  });
});
