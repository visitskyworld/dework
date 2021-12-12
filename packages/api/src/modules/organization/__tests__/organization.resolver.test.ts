import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { OrganizationRequests } from "@dewo/api/testing/requests/organization.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";
import _ from "lodash";
import Bluebird from "bluebird";
import faker from "faker";
import { OrganizationRole } from "@dewo/api/models/OrganizationMember";

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
        expect(organization.members).toHaveLength(1);
        expect(organization.members).toContainEqual(
          expect.objectContaining({
            userId: user.id,
            role: OrganizationRole.OWNER,
          })
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
    });

    describe("updateOrganizationMember", () => {
      it("should succeed if is organization admin", async () => {
        const adminUser = await fixtures.createUser();
        const otherUser = await fixtures.createUser();
        const organization = await fixtures.createOrganization({}, adminUser, [
          otherUser.id,
        ]);

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(adminUser),
          body: OrganizationRequests.updateMember({
            organizationId: organization.id,
            userId: otherUser.id,
            role: OrganizationRole.ADMIN,
          }),
        });
        expect(response.status).toEqual(HttpStatus.OK);
        const updated = response.body.data?.member;
        expect(updated.role).toEqual(OrganizationRole.ADMIN);
        expect(updated.userId).toEqual(otherUser.id);
      });

      it("should fail to update own role", async () => {
        const { user, organization } = await fixtures.createUserOrgProject();
        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: OrganizationRequests.updateMember({
            organizationId: organization.id,
            userId: user.id,
            role: OrganizationRole.ADMIN,
          }),
        });
        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });

      it("should fail if is organization member", async () => {
        const adminUser = await fixtures.createUser();
        const memberUser = await fixtures.createUser();
        const otherUser = await fixtures.createUser();
        const organization = await fixtures.createOrganization({}, adminUser, [
          otherUser.id,
        ]);

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(memberUser),
          body: OrganizationRequests.updateMember({
            organizationId: organization.id,
            userId: otherUser.id,
            role: OrganizationRole.ADMIN,
          }),
        });
        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });
    });

    describe("removeOrganizationMember", () => {
      it("should succeed if is organization admin", async () => {
        const adminUser = await fixtures.createUser();
        const otherUser = await fixtures.createUser();
        const organization = await fixtures.createOrganization({}, adminUser, [
          otherUser.id,
        ]);

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(adminUser),
          body: OrganizationRequests.removeMember({
            organizationId: organization.id,
            userId: otherUser.id,
          }),
        });
        expect(response.status).toEqual(HttpStatus.OK);
        const updated = response.body.data?.organization;
        expect(updated.members).not.toContainEqual(
          expect.objectContaining({ userId: otherUser.id })
        );
      });

      it("should fail if is organization member", async () => {
        const adminUser = await fixtures.createUser();
        const memberUser = await fixtures.createUser();
        const otherUser = await fixtures.createUser();
        const organization = await fixtures.createOrganization({}, adminUser, [
          otherUser.id,
        ]);

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(memberUser),
          body: OrganizationRequests.updateMember({
            organizationId: organization.id,
            userId: otherUser.id,
            role: OrganizationRole.ADMIN,
          }),
        });
        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });
    });
  });

  describe("Queries", () => {
    describe("getOrganization", () => {
      it("should return tasks from all sub projects", async () => {
        const organization = await fixtures.createOrganization();
        const projects = await Bluebird.map(_.range(5), () =>
          fixtures.createProject({ organizationId: organization.id })
        );
        const tasks = await Bluebird.map(projects, (project) =>
          fixtures.createTask({ projectId: project.id })
        );

        const response = await client.request({
          app,
          body: OrganizationRequests.get(organization.id),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const fetched = response.body.data.organization;
        tasks.forEach((task) => {
          expect(fetched.tasks).toContainEqual(
            expect.objectContaining({ id: task.id, projectId: task.projectId })
          );
        });
      });
    });
  });
});
