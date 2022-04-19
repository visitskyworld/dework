import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { OrganizationRequests } from "@dewo/api/testing/requests/organization.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";
import _ from "lodash";
import Bluebird from "bluebird";
import faker from "faker";
import { RulePermission } from "@dewo/api/models/enums/RulePermission";

describe("OrganizationResolver", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let client: GraphQLTestClient;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    client = app.get(GraphQLTestClient);
  });

  afterAll(() => app.close());

  describe("Mutations", () => {
    describe("createOrganization", () => {
      it("should fail if not authed", async () => {
        const response = await client.request({
          app,
          body: OrganizationRequests.create({ name: "", imageUrl: "" }),
        });

        client.expectGqlError(response, HttpStatus.UNAUTHORIZED);
      });

      it("should succeed if authed", async () => {
        const user = await fixtures.createUser();
        const name = faker.company.companyName();
        const imageUrl = faker.image.imageUrl();

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: OrganizationRequests.create({ name, imageUrl }),
        });
        expect(response.status).toEqual(HttpStatus.OK);
        const organization = response.body.data?.organization;
        expect(organization).toBeDefined();
        expect(organization.name).toEqual(name);
        expect(organization.imageUrl).toEqual(imageUrl);
        expect(organization.users).toHaveLength(1);
        expect(organization.users).toContainEqual(
          expect.objectContaining({ id: user.id })
        );
      });
    });

    describe("updateOrganization", () => {
      it("should fail if has no access", async () => {
        const user = await fixtures.createUser();
        const organization = await fixtures.createOrganization();

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: OrganizationRequests.update({
            id: organization.id,
            name: "Not part of the org",
          }),
        });
        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });

      it("should succeed if has access", async () => {
        const { user, organization } = await fixtures.createUserOrgProject();
        const expectedName = faker.company.companyName();

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: OrganizationRequests.update({
            id: organization.id,
            name: expectedName,
          }),
        });
        expect(response.status).toEqual(HttpStatus.OK);
        const updated = response.body.data?.organization;
        expect(updated.name).toEqual(expectedName);
      });

      it("should set deletedAt if is owner", async () => {
        const { user: owner, organization } =
          await fixtures.createUserOrgProject();
        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(owner),
          body: OrganizationRequests.update({
            id: organization.id,
            deletedAt: new Date(),
          }),
        });
        expect(response.status).toEqual(HttpStatus.OK);
        const updated = response.body.data?.organization;
        expect(updated.deletedAt).not.toBe(null);
      });
    });
  });

  describe("Queries", () => {
    describe("getOrganization", () => {
      it("should return tasks from all non-deleted projects", async () => {
        const organization = await fixtures.createOrganization();
        const projects = await Bluebird.map(_.range(5), () =>
          fixtures.createProject({ organizationId: organization.id })
        );
        const tasks = await Bluebird.map(projects, (project) =>
          fixtures.createTask({ projectId: project.id })
        );

        const deletedProject = await fixtures.createProject({
          organizationId: organization.id,
        });
        const taskInDeletedProject = await fixtures.createTask({
          projectId: deletedProject!.id,
        });
        await fixtures.updateProject({
          id: deletedProject.id,
          deletedAt: new Date(),
        });

        const response = await client.request({
          app,
          body: OrganizationRequests.get(organization.id),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const fetched = response.body.data.organization;
        tasks.forEach((task) => {
          expect(fetched.tasks).toContainEqual(
            expect.objectContaining({ id: task.id })
          );
        });

        expect(fetched.tasks).not.toContainEqual(
          expect.objectContaining({ id: taskInDeletedProject.id })
        );
      });

      describe("projects", () => {
        it("should return non-deleted, public projects", async () => {
          const organization = await fixtures.createOrganization();
          const project = await fixtures.createProject({
            organizationId: organization.id,
          });
          const deletedProject = await fixtures
            .createProject({ organizationId: organization.id })
            .then((p) =>
              fixtures.updateProject({ id: p.id, deletedAt: new Date() })
            );
          const privateProject = await fixtures.createProject({
            organizationId: organization.id,
          });
          const everyoneRole = await organization.roles.then((r) =>
            r.find((r) => r.fallback)
          );
          await fixtures.createRule({
            roleId: everyoneRole!.id,
            projectId: privateProject.id,
            permission: RulePermission.VIEW_PROJECTS,
            inverted: true,
          });

          const response = await client.request({
            app,
            body: OrganizationRequests.get(organization.id),
          });

          expect(response.status).toEqual(HttpStatus.OK);
          const fetched = response.body.data.organization;
          expect(fetched.projects).toHaveLength(1);
          expect(fetched.projects).toContainEqual(
            expect.objectContaining({ id: project.id })
          );
          expect(fetched.projects).not.toContainEqual(
            expect.objectContaining({ id: deletedProject!.id })
          );
          expect(fetched.projects).not.toContainEqual(
            expect.objectContaining({ id: privateProject.id })
          );
        });

        xit("should show private projects to org admins", async () => {
          const orgAdmin = await fixtures.createUser();
          const organization = await fixtures.createOrganization({}, orgAdmin);
          const project = await fixtures.createProject({
            organizationId: organization.id,
          });
          await fixtures.grantPermissions(orgAdmin.id, organization.id, [
            { permission: RulePermission.VIEW_PROJECTS, inverted: true },
          ]);

          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(orgAdmin),
            body: OrganizationRequests.get(organization.id),
          });

          expect(response.status).toEqual(HttpStatus.OK);
          const fetched = response.body.data.organization;
          expect(fetched.projects).toContainEqual(
            expect.objectContaining({ id: project.id })
          );
        });

        it("should show private projects to people with VIEW_PROJECT permission", async () => {
          const user = await fixtures.createUser();
          const organization = await fixtures.createOrganization();
          const project = await fixtures.createProject({
            organizationId: organization.id,
          });

          await fixtures.grantPermissions(user.id, organization.id, [
            { permission: RulePermission.VIEW_PROJECTS, inverted: true },
            { permission: RulePermission.VIEW_PROJECTS, projectId: project.id },
          ]);

          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: OrganizationRequests.get(organization.id),
          });

          expect(response.status).toEqual(HttpStatus.OK);
          const fetched = response.body.data.organization;
          expect(fetched.projects).toContainEqual(
            expect.objectContaining({ id: project.id })
          );
        });
      });

      describe("users", () => {
        it("should return users with role in org", async () => {
          const organization = await fixtures.createOrganization();
          const otherOrganization = await fixtures.createOrganization();
          const user = await fixtures.createUser();

          await fixtures.grantPermissions(
            user.id,
            organization.id,
            [{ permission: RulePermission.VIEW_PROJECTS }],
            { name: "role in organization", fallback: true }
          );
          await fixtures.grantPermissions(
            user.id,
            otherOrganization.id,
            [{ permission: RulePermission.VIEW_PROJECTS }],
            { name: "role in other organization", fallback: true }
          );

          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: OrganizationRequests.get(organization.id),
          });
          const fetched = response.body.data.organization;
          const fetchedUser = fetched.users.find((u: any) => u.id === user.id);
          expect(fetchedUser).toBeDefined();
          expect(fetchedUser.roles).toContainEqual(
            expect.objectContaining({ name: "role in organization" })
          );
          expect(fetchedUser.roles).toContainEqual(
            expect.objectContaining({ name: "role in other organization" })
          );
        });
      });
    });
  });
});
