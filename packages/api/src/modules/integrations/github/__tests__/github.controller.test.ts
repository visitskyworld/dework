import { HttpStatus, INestApplication } from "@nestjs/common";
import faker from "faker";

import { Fixtures } from "@dewo/api/testing/Fixtures";
import { WebhookTestClient } from "@dewo/api/testing/WebhookTestClient";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { TaskStatus } from "@dewo/api/models/Task";
import { GithubPullRequestActions } from "../github.controller";
import { GithubPullRequestStatusEnum } from "@dewo/api/models/GithubPullRequest";
import * as Github from "@octokit/webhooks-types";
import { DeepPartial } from "typeorm";
import { TaskTagSource } from "@dewo/api/models/TaskTag";

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

  const limeGithubLabel = {
    id: faker.datatype.number(1000),
    name: faker.lorem.word(),
    color: "bada55",
  };

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
        const issueId = faker.datatype.number(100);

        await client.request<DeepPartial<Github.IssuesOpenedEvent>>({
          app,
          body: {
            action: "opened",
            issue: {
              id: issueId,
              state: "open",
              url,
              title: name,
              body: description,
              labels: [limeGithubLabel],
            },
            installation: { id: github.installationId },
            repository: {
              name: github.repo,
              owner: { login: github.organization },
            },
          },
        });

        const tasks = await project.tasks;
        const task = await fixtures.getTask(tasks[0].id);
        expect(task).toBeDefined();
        expect(task!.name).toEqual(name);
        expect(task!.status).toEqual(TaskStatus.TODO);
        expect(task!.description).toContain(description);
        expect(task!.description).toContain(url);
        expect(task!.tags).toHaveLength(1);
        expect(task!.tags).toContainEqual(
          expect.objectContaining({
            label: limeGithubLabel.name,
            color: "lime",
            source: TaskTagSource.GITHUB,
            externalId: String(limeGithubLabel.id),
          })
        );

        const githubIssue = await task?.githubIssue;
        expect(githubIssue).toBeTruthy();
        expect(githubIssue!.externalId).toEqual(issueId);
      });
    });

    describe("issue updated", () => {
      it("should update task with reference to Github issue", async () => {
        const { project, github } =
          await fixtures.createProjectWithGithubIntegration();

        const originalTag = await fixtures.createTaskTag({
          projectId: project.id,
        });
        const task = await fixtures.createTask({
          projectId: project.id,
          tags: [originalTag],
        });
        const issue = await fixtures.createGithubIssue({ taskId: task.id });

        const url = faker.internet.url();
        const name = faker.lorem.sentence();
        const description = faker.lorem.sentence();

        await client.request<DeepPartial<Github.IssuesEditedEvent>>({
          app,
          body: {
            action: "edited",
            issue: {
              id: issue.externalId,
              state: "closed",
              url,
              title: name,
              body: description,
              labels: [limeGithubLabel],
            },
            installation: { id: github.installationId },
            repository: {
              name: github.repo,
              owner: { login: github.organization },
            },
          },
        });

        const updatedTask = await fixtures.getTask(task.id);
        expect(updatedTask).toBeDefined();
        expect(updatedTask!.name).toEqual(name);
        expect(updatedTask!.status).toEqual(TaskStatus.DONE);
        expect(updatedTask!.description).toContain(description);
        expect(updatedTask!.description).toContain(url);
        expect(updatedTask!.tags).toHaveLength(1);
        expect(updatedTask!.tags).not.toContainEqual(
          expect.objectContaining({ id: originalTag.id })
        );
        expect(updatedTask!.tags).toContainEqual(
          expect.objectContaining({
            label: limeGithubLabel.name,
            color: "lime",
            source: TaskTagSource.GITHUB,
            externalId: String(limeGithubLabel.id),
          })
        );

        const githubIssue = await task?.githubIssue;
        expect(githubIssue).toBeTruthy();
        expect(githubIssue!.id).toEqual(issue.id);
      });
    });
  });
});
