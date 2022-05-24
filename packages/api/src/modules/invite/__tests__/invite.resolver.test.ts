import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { InviteRequests } from "@dewo/api/testing/requests/invite.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { TaskReaction } from "@dewo/api/models/TaskReaction";
import { Project } from "@dewo/api/models/Project";
import { RulePermission } from "@dewo/api/models/enums/RulePermission";

describe("InviteResolver", () => {
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
    describe("createInvite", () => {
      describe("organization", () => {
        it("should succeed for owner", async () => {
          const user = await fixtures.createUser();
          const organization = await fixtures.createOrganization({}, user);
          const res = await client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: InviteRequests.createInvite({
              organizationId: organization.id,
              permission: RulePermission.MANAGE_ORGANIZATION,
            }),
          });

          expect(res.body.data?.invite).toBeDefined();
          expect(res.body.data?.invite.organizationId).toEqual(organization.id);
        });

        it("should fail for random user", async () => {
          const user = await fixtures.createUser();
          const organization = await fixtures.createOrganization();
          const res = await client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: InviteRequests.createInvite({
              organizationId: organization.id,
              permission: RulePermission.MANAGE_ORGANIZATION,
            }),
          });

          client.expectGqlError(res, HttpStatus.FORBIDDEN);
        });
      });

      describe("project", () => {
        it("owner can invite VIEW_PROJECTS", async () => {
          const { user, project } = await fixtures.createUserOrgProject();
          const res = await client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: InviteRequests.createInvite({
              projectId: project.id,
              permission: RulePermission.VIEW_PROJECTS,
            }),
          });

          expect(res.body.data.invite).toEqual(
            expect.objectContaining({
              permission: RulePermission.VIEW_PROJECTS,
            })
          );
        });

        it("owner can invite MANAGE_PROJECTS", async () => {
          const { user, project } = await fixtures.createUserOrgProject();
          const res = await client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: InviteRequests.createInvite({
              projectId: project.id,
              permission: RulePermission.MANAGE_PROJECTS,
            }),
          });

          expect(res.body.data.invite).toEqual(
            expect.objectContaining({
              permission: RulePermission.MANAGE_PROJECTS,
            })
          );
        });

        it("org member cannot invite VIEW_PROJECTS", async () => {
          const user = await fixtures.createUser();
          const project = await fixtures.createProject();
          const res = await client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: InviteRequests.createInvite({
              projectId: project.id,
              permission: RulePermission.VIEW_PROJECTS,
            }),
          });
          client.expectGqlError(res, HttpStatus.FORBIDDEN);
        });
      });
    });

    describe("acceptInvite", () => {
      describe("organization", () => {
        it("should give user ability to manage organization", async () => {
          const inviter = await fixtures.createUser();
          const invited = await fixtures.createUser();
          const organization = await fixtures.createOrganization({}, inviter);
          const invite = await fixtures.createInvite(
            {
              organizationId: organization.id,
              permission: RulePermission.MANAGE_ORGANIZATION,
            },
            inviter
          );

          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(invited),
            body: InviteRequests.accept(invite.id),
          });

          expect(response.status).toEqual(HttpStatus.OK);
          const fetchedInvite = response.body.data?.invite;
          expect(fetchedInvite.organization.users).toContainEqual(
            expect.objectContaining({ id: invited.id })
          );

          const ability = await fixtures.grantPermissions(
            invited.id,
            organization.id,
            []
          );
          expect(ability.can("update", organization)).toBe(true);
        });
      });

      describe("project", () => {
        it("should give CONTRIBUTORs the right access", async () => {
          const {
            user: inviter,
            project,
            organization,
          } = await fixtures.createUserOrgProject();
          const invited = await fixtures.createUser();

          const invite = await fixtures.createInvite(
            {
              projectId: project.id,
              permission: RulePermission.VIEW_PROJECTS,
            },
            inviter
          );

          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(invited),
            body: InviteRequests.accept(invite.id),
          });

          expect(response.status).toEqual(HttpStatus.OK);
          const fetchedInvite = response.body.data?.invite;
          expect(fetchedInvite.project.organization.users).toContainEqual(
            expect.objectContaining({ id: invited.id })
          );

          const ability = await fixtures.grantPermissions(
            invited.id,
            organization.id,
            []
          );
          expect(ability.can("update", Project)).toBe(false);
          expect(ability.can("create", TaskReaction)).toBe(true);
        });

        it("should give ADMINs the right access", async () => {
          const {
            user: inviter,
            project,
            organization,
          } = await fixtures.createUserOrgProject();
          const invited = await fixtures.createUser();

          const invite = await fixtures.createInvite(
            {
              projectId: project.id,
              permission: RulePermission.MANAGE_PROJECTS,
            },
            inviter
          );

          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(invited),
            body: InviteRequests.accept(invite.id),
          });

          expect(response.status).toEqual(HttpStatus.OK);
          const fetchedInvite = response.body.data?.invite;
          expect(fetchedInvite.project.organization.users).toContainEqual(
            expect.objectContaining({ id: invited.id })
          );

          const ability = await fixtures.grantPermissions(
            invited.id,
            organization.id,
            []
          );
          expect(ability.can("update", Project)).toBe(true);
          expect(ability.can("create", TaskReaction)).toBe(true);
        });
      });

      describe("task", () => {
        it("should assign user to task when accepting invite", async () => {
          const { user: inviter, project } =
            await fixtures.createUserOrgProject();
          const invited = await fixtures.createUser();
          const task = await fixtures.createTask({ projectId: project.id });

          const invite = await fixtures.createInvite(
            { taskId: task.id, permission: RulePermission.VIEW_PROJECTS },
            inviter
          );

          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(invited),
            body: InviteRequests.accept(invite.id),
          });

          expect(response.status).toEqual(HttpStatus.OK);
          const fetchedInvite = response.body.data?.invite;
          expect(fetchedInvite.task.project.organization.users).toContainEqual(
            expect.objectContaining({ id: invited.id })
          );

          const updatedTask = await fixtures.getTask(task.id);
          expect(updatedTask?.assignees).toContainEqual(
            expect.objectContaining({ id: invited.id })
          );
        });
      });
    });
  });
});
