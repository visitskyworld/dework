import { Organization } from "@dewo/api/models/Organization";
import { RulePermission } from "@dewo/api/models/rbac/Rule";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { INestApplication } from "@nestjs/common";
import { RbacService } from "../rbac.service";

describe("RbacService", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let service: RbacService;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    service = app.get(RbacService);
  });

  afterAll(() => app.close());

  describe("abilityForUser", () => {
    let organization: Organization;

    beforeEach(async () => {
      organization = await fixtures.createOrganization();
    });

    it("MANAGE_ORGANIZATION", async () => {
      const project = await fixtures.createProject({
        organizationId: organization.id,
      });
      const user = await fixtures.createUser();
      const ability = await fixtures.grantPermissions(
        user.id,
        organization.id,
        [{ permission: RulePermission.MANAGE_ORGANIZATION }]
      );

      const otherOrganization = await fixtures.createOrganization();
      const otherProject = await fixtures.createProject({
        organizationId: otherOrganization.id,
      });

      expect(ability.can("update", organization)).toBe(true);
      expect(ability.can("delete", organization)).toBe(true);
      expect(ability.can("create", project)).toBe(true);

      expect(ability.can("update", otherOrganization)).toBe(false);
      expect(ability.can("delete", otherOrganization)).toBe(false);
      expect(ability.can("create", otherProject)).toBe(false);
    });

    it("MANAGE_PROJECTS", async () => {
      const project1 = await fixtures.createProject({
        organizationId: organization.id,
      });
      const project2 = await fixtures.createProject({
        organizationId: organization.id,
      });

      const accessNoProjects = await fixtures.grantPermissions(
        await fixtures.createUser().then((u) => u.id),
        organization.id,
        []
      );
      expect(accessNoProjects.can("read", project1)).toBe(false);
      expect(accessNoProjects.can("read", project2)).toBe(false);
      expect(accessNoProjects.can("update", project1)).toBe(false);
      expect(accessNoProjects.can("update", project2)).toBe(false);

      const accessAllProjects = await fixtures.grantPermissions(
        await fixtures.createUser().then((u) => u.id),
        organization.id,
        [{ permission: RulePermission.MANAGE_PROJECTS }]
      );
      expect(accessAllProjects.can("read", project1)).toBe(true);
      expect(accessAllProjects.can("read", project2)).toBe(true);
      expect(accessAllProjects.can("update", project1)).toBe(true);
      expect(accessAllProjects.can("update", project2)).toBe(true);

      const accessSpecificProject = await fixtures.grantPermissions(
        await fixtures.createUser().then((u) => u.id),
        organization.id,
        [
          { permission: RulePermission.VIEW_PROJECTS, inverted: true },
          {
            permission: RulePermission.MANAGE_PROJECTS,
            projectId: project2.id,
          },
        ]
      );
      expect(accessSpecificProject.can("read", project1)).toBe(false);
      expect(accessSpecificProject.can("read", project2)).toBe(true);
      // expect(accessSpecificProject.can("update", project1)).toBe(false);
      expect(accessSpecificProject.can("update", project2)).toBe(true);
    });
  });
});
