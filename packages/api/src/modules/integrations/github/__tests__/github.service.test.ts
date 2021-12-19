import { ProjectIntegrationSource } from "@dewo/api/models/ProjectIntegration";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { INestApplication } from "@nestjs/common";
import { GithubService } from "../github.service";
import faker from "faker";

describe("GithubService", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let github: GithubService;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    github = app.get(GithubService);
  });

  afterAll(() => app.close());

  describe("parseTaskNumberFromBranchName", () => {
    it("should correctly parse task number", () => {
      const fn = github.parseTaskNumberFromBranchName;
      expect(fn("feat/dw-123/feature-name")).toBe(123);
      expect(fn("feat/dw-123")).toBe(undefined);
      expect(fn("dw-123/feature-name")).toBe(undefined);
      expect(fn("feat/dw-123-456/feature-name")).toBe(undefined);
      expect(fn("feat/dw-12e/feature-name")).toBe(undefined);
    });
  });

  describe("findTask", () => {
    it("should return task if has matching project integration", async () => {
      const installationId = faker.datatype.uuid();
      const project = await fixtures.createProject();
      await fixtures.createProjectIntegation({
        projectId: project.id,
        source: ProjectIntegrationSource.github,
        config: { installationId, features: [] },
      });

      const task = await fixtures.createTask({ projectId: project.id });
      const found = await github.findTask(task.number, installationId);
      expect(found).toBeDefined();
      expect(found?.id).toEqual(task.id);
    });

    it("should not return task if integration exists, but with other project", async () => {
      const installationId = faker.datatype.uuid();
      const project = await fixtures.createProject();
      await fixtures.createProjectIntegation({
        projectId: project.id,
        source: ProjectIntegrationSource.github,
        config: { installationId, features: [] },
      });

      const otherProject = await fixtures.createProject();
      const task = await fixtures.createTask({ projectId: otherProject.id });
      const found = await github.findTask(task.number, installationId);
      expect(found).not.toBeDefined();
    });

    it("should not return task if number does not match", async () => {
      const installationId = faker.datatype.uuid();
      const project = await fixtures.createProject();
      await fixtures.createProjectIntegation({
        projectId: project.id,
        source: ProjectIntegrationSource.github,
        config: { installationId, features: [] },
      });

      const found = await github.findTask(-1, installationId);
      expect(found).not.toBeDefined();
    });
  });
});