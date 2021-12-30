import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { INestApplication } from "@nestjs/common";
import { GithubService } from "../github.service";

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
      const { project, installationId } =
        await fixtures.createProjectWithGithubIntegration();

      const task = await fixtures.createTask({ projectId: project.id });
      const found = await github.findTask(task.number, installationId);
      expect(found).toBeDefined();
      expect(found?.id).toEqual(task.id);
    });

    it("should not return task if integration exists with another project within the same org", async () => {
      const organization = await fixtures.createOrganization();
      const { installationId } =
        await fixtures.createProjectWithGithubIntegration({
          organizationId: organization.id,
        });

      const otherProject = await fixtures.createProject({
        organizationId: organization.id,
      });
      const task = await fixtures.createTask({ projectId: otherProject.id });
      const found = await github.findTask(task.number, installationId);
      expect(found).not.toBeDefined();
    });

    it("should not return task if number does not match", async () => {
      const { installationId } =
        await fixtures.createProjectWithGithubIntegration();

      const found = await github.findTask(-1, installationId);
      expect(found).not.toBeDefined();
    });
  });
});
