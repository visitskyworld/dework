import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { OrganizationRequests } from "@dewo/api/testing/requests/organization.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";
import _ from "lodash";
import Bluebird from "bluebird";
import faker from "faker";
import {
  OrganizationMember,
  OrganizationRole,
} from "@dewo/api/models/OrganizationMember";
import { ProjectVisibility } from "@dewo/api/models/Project";
import { ProjectRole } from "@dewo/api/models/enums/ProjectRole";
import { User } from "@dewo/api/models/User";
import { RulePermission } from "@dewo/api/models/rbac/Rule";

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

      describe("deletedAt", () => {
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

        it("should fail to set deletedAt if is admin", async () => {
          const admin = await fixtures.createUser();
          const organization = await fixtures.createOrganization(
            {},
            undefined,
            [{ userId: admin.id, role: OrganizationRole.ADMIN }]
          );

          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(admin),
            body: OrganizationRequests.update({
              id: organization.id,
              deletedAt: new Date(),
            }),
          });
          client.expectGqlError(response, HttpStatus.UNAUTHORIZED);
        });
      });
    });

    xdescribe("updateOrganizationMember", () => {
      async function fn(
        requesterRole: OrganizationRole | undefined,
        targetRole: OrganizationRole,
        isSameUser: boolean = false
      ) {
        const creator = await fixtures.createUser();
        const requester = await fixtures.createUser();
        const target = isSameUser ? requester : await fixtures.createUser();

        const members: Pick<OrganizationMember, "userId" | "role">[] = [];
        if (!isSameUser) {
          members.push({ role: targetRole, userId: target.id });
        }
        if (!!requesterRole) {
          members.push({ role: requesterRole, userId: requester.id });
        }

        const organization = await fixtures.createOrganization(
          {},
          creator,
          members
        );

        return client.request({
          app,
          auth: fixtures.createAuthToken(requester),
          body: OrganizationRequests.updateMember({
            organizationId: organization.id,
            userId: target.id,
            role: targetRole,
          }),
        });
      }

      it("non-member can add oneself as FOLLOWER", async () => {
        const response = await fn(undefined, OrganizationRole.FOLLOWER, true);
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body.data?.member.role).toEqual(
          OrganizationRole.FOLLOWER
        );
      });

      it("non-member cannot add oneself as ADMIN", async () => {
        const response = await fn(undefined, OrganizationRole.ADMIN, true);
        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });

      it("non-member cannot add oneself as OWNER", async () => {
        const response = await fn(undefined, OrganizationRole.OWNER, true);
        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });

      it("non-member cannot add someone else to org", async () => {
        const response = await fn(undefined, OrganizationRole.FOLLOWER);
        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });

      it("ADMIN can add someone else as FOLLOWER", async () => {
        const response = await fn(
          OrganizationRole.ADMIN,
          OrganizationRole.FOLLOWER
        );
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body.data?.member.role).toEqual(
          OrganizationRole.FOLLOWER
        );
      });

      it("ADMIN can add someone else as ADMIN", async () => {
        const response = await fn(
          OrganizationRole.ADMIN,
          OrganizationRole.ADMIN
        );
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body.data?.member.role).toEqual(OrganizationRole.ADMIN);
      });

      it("ADMIN cannot add someone else as OWNER", async () => {
        const response = await fn(
          OrganizationRole.ADMIN,
          OrganizationRole.OWNER
        );
        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });

      it("OWNER can add someone else as OWNER", async () => {
        const response = await fn(
          OrganizationRole.OWNER,
          OrganizationRole.OWNER
        );
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body.data?.member.role).toEqual(OrganizationRole.OWNER);
      });

      it("ADMIN cannot update own role", async () => {
        const response = await fn(
          OrganizationRole.ADMIN,
          OrganizationRole.ADMIN,
          true
        );
        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });

      it("OWNER cannot update own role", async () => {
        const response = await fn(
          OrganizationRole.OWNER,
          OrganizationRole.ADMIN,
          true
        );
        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });

      it("should allow anyone to update own sortKey", async () => {
        const owner = await fixtures.createUser();
        const admin = await fixtures.createUser();
        const follower = await fixtures.createUser();

        const organization = await fixtures.createOrganization({}, undefined, [
          { userId: owner.id, role: OrganizationRole.OWNER },
          { userId: admin.id, role: OrganizationRole.ADMIN },
          { userId: follower.id, role: OrganizationRole.FOLLOWER },
        ]);

        const sortKey = Date.now().toString();

        const req = (user: User) =>
          client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: OrganizationRequests.updateMember({
              organizationId: organization.id,
              userId: user.id,
              sortKey,
            }),
          });

        const ownerResponse = await req(owner);
        const adminResponse = await req(admin);
        const followerResponse = await req(follower);

        expect(ownerResponse.body.data?.member.sortKey).toEqual(sortKey);
        expect(adminResponse.body.data?.member.sortKey).toEqual(sortKey);
        expect(followerResponse.body.data?.member.sortKey).toEqual(sortKey);
      });
    });

    describe("removeOrganizationMember", () => {
      it("should succeed if is organization admin", async () => {
        const adminUser = await fixtures.createUser();
        const otherUser = await fixtures.createUser();
        const organization = await fixtures.createOrganization({}, adminUser, [
          { userId: otherUser.id, role: OrganizationRole.FOLLOWER },
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
          { userId: otherUser.id, role: OrganizationRole.FOLLOWER },
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

        const privateProject = await fixtures.createProject({
          organizationId: organization.id,
          visibility: ProjectVisibility.PRIVATE,
        });
        const taskInPrivateProject = await fixtures.createTask({
          projectId: privateProject.id,
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
        expect(fetched.tasks).not.toContainEqual(
          expect.objectContaining({ id: taskInPrivateProject.id })
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
            visibility: ProjectVisibility.PRIVATE,
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

        it("should show private projects to org admins", async () => {
          const orgAdmin = await fixtures.createUser();
          const organization = await fixtures.createOrganization(
            {},
            undefined,
            [{ userId: orgAdmin.id, role: OrganizationRole.ADMIN }]
          );
          const project = await fixtures.createProject({
            organizationId: organization.id,
            visibility: ProjectVisibility.PRIVATE,
          });

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

        it("should show private projects to proj admins and contributors", async () => {
          const user = await fixtures.createUser();
          const organization = await fixtures.createOrganization();
          const adminProject = await fixtures.createProject(
            {
              organizationId: organization.id,
              visibility: ProjectVisibility.PRIVATE,
            },
            undefined,
            [{ userId: user.id, role: ProjectRole.ADMIN }]
          );
          const contributorProject = await fixtures.createProject(
            {
              organizationId: organization.id,
              visibility: ProjectVisibility.PRIVATE,
            },
            undefined,
            [{ userId: user.id, role: ProjectRole.CONTRIBUTOR }]
          );

          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: OrganizationRequests.get(organization.id),
          });

          expect(response.status).toEqual(HttpStatus.OK);
          const fetched = response.body.data.organization;
          expect(fetched.projects).toContainEqual(
            expect.objectContaining({ id: adminProject.id })
          );
          expect(fetched.projects).toContainEqual(
            expect.objectContaining({ id: contributorProject.id })
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
            { name: "role in organization" }
          );
          await fixtures.grantPermissions(
            user.id,
            otherOrganization.id,
            [{ permission: RulePermission.VIEW_PROJECTS }],
            { name: "role in other organization" }
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
