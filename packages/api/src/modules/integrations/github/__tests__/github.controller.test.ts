import { HttpStatus, INestApplication } from "@nestjs/common";
import _ from "lodash";
import faker from "faker";
import { DeepPartial } from "typeorm";

import { Fixtures } from "@dewo/api/testing/Fixtures";
import { WebhookTestClient } from "@dewo/api/testing/WebhookTestClient";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { TaskStatus } from "@dewo/api/models/Task";
import { GithubPullRequestStatus } from "@dewo/api/models/GithubPullRequest";
import * as Github from "@octokit/webhooks-types";
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

      const response = await client.request<DeepPartial<Github.PushEvent>>({
        app,
        body: {
          ref: branchName,
          commits: [],
          installation: { id: github.installationId },
          repository: {
            name: github.repo,
            owner: { login: github.organization },
          },
        },
      });

      expect(response.status).toEqual(HttpStatus.CREATED);
      const branchFromDb = await fixtures.getGithubBranchbyName(branchName);
      expect(branchFromDb?.name).toEqual(branchName);
    });

    it("should update a task's status to IN_PROGRESS when its branch is created", async () => {
      const { project, github } =
        await fixtures.createProjectWithGithubIntegration();
      const task = await fixtures.createTask({
        projectId: project.id,
        status: TaskStatus.TODO,
      });
      const branchName = `username/dw-${task.number}/feature`;

      await client.request<DeepPartial<Github.PushEvent>>({
        app,
        body: {
          ref: branchName,
          commits: [],
          installation: { id: github.installationId },
          repository: {
            name: github.repo,
            owner: { login: github.organization },
          },
        },
      });
      const branchFromDb = await fixtures.getGithubBranchbyName(branchName);
      const taskFromDb = await fixtures.getTask(task.id);

      expect(branchFromDb?.name).toEqual(branchName);
      expect(taskFromDb?.status).toEqual(TaskStatus.IN_PROGRESS);
    });

    it("should update a task's status to DONE when its PR is merged", async () => {
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

      const prOpenedResponse = await client.request<
        DeepPartial<Github.PullRequestOpenedEvent>
      >({
        app,
        body: {
          action: "opened",
          pull_request: {
            title: pullRequest.title,
            state: "open",
            html_url: faker.internet.url(),
            number: faker.datatype.number(),
            draft: false,
            merged: false,
            head: { ref: branch.name },
          },
          installation: { id: github.installationId },
          repository: {
            name: github.repo,
            owner: { login: github.organization },
          },
        },
      });

      const prFromDb = await fixtures.getGithubPullRequestByTaskId(task.id);
      const taskFromDb = await fixtures.getTask(task.id);
      expect(prOpenedResponse.status).toEqual(HttpStatus.CREATED);
      expect(prFromDb?.taskId).toEqual(task.id);
      expect(prFromDb?.status).toEqual(GithubPullRequestStatus.OPEN);
      expect(taskFromDb?.status).toEqual(TaskStatus.IN_REVIEW);

      const prClosedResponse = await client.request<
        DeepPartial<Github.PullRequestClosedEvent>
      >({
        app,
        body: {
          action: "closed",
          pull_request: {
            title: pullRequest.title,
            state: "closed",
            html_url: faker.internet.url(),
            number: faker.datatype.number(),
            draft: false,
            merged: true,
            head: { ref: branch.name },
          },
          installation: { id: github.installationId },
          repository: {
            name: github.repo,
            owner: { login: github.organization },
          },
        },
      });

      const mergedPrFromDb = await fixtures.getGithubPullRequestByTaskId(
        task.id
      );
      const doneTaskFromDb = await fixtures.getTask(task.id);
      expect(prClosedResponse.status).toEqual(HttpStatus.CREATED);
      expect(mergedPrFromDb?.taskId).toEqual(task.id);
      expect(mergedPrFromDb?.status).toEqual(GithubPullRequestStatus.MERGED);
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
        const issueNumber = faker.datatype.number(100);

        await client.request<DeepPartial<Github.IssuesOpenedEvent>>({
          app,
          body: {
            action: "opened",
            issue: {
              id: issueId,
              number: issueNumber,
              state: "open",
              html_url: url,
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
        expect(task!.tags).toHaveLength(2);
        expect(task!.tags).toContainEqual(
          expect.objectContaining({
            label: "github issue",
            color: "green",
            source: TaskTagSource.GITHUB,
            externalId: String(0),
          })
        );
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
        expect(githubIssue!.number).toEqual(issueNumber);
      });

      it("should not create multiple tasks if called in parallel", async () => {
        const { project, github } =
          await fixtures.createProjectWithGithubIntegration();

        const body: DeepPartial<Github.IssuesOpenedEvent> = {
          action: "opened",
          issue: {
            id: faker.datatype.number(100),
            number: faker.datatype.number(100),
            state: "open",
            html_url: faker.internet.url(),
            title: faker.lorem.sentence(),
            body: faker.lorem.sentence(),
            labels: [limeGithubLabel],
          },
          installation: { id: github.installationId },
          repository: {
            name: github.repo,
            owner: { login: github.organization },
          },
        };

        await Promise.all(_.range(10).map(() => client.request({ app, body })));

        const tasks = await project.tasks;
        expect(tasks).toHaveLength(1);
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
              html_url: url,
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
        expect(updatedTask!.tags).toContainEqual(
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
