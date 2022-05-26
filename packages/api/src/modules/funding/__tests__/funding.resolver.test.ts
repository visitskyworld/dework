import { RulePermission } from "@dewo/api/models/enums/RulePermission";
import { TaskStatus } from "@dewo/api/models/Task";
import { User } from "@dewo/api/models/User";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { FundingRequests } from "@dewo/api/testing/requests/funding.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";
import faker from "faker";
import { TaskSearchService } from "../../task/search/task.search.service";
import { CreateFundingSessionInput } from "../dto/CreateFundingSessionInput";

describe("FundingResolver", () => {
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
    describe("createFundingSession", () => {
      it("should succeed to create for user w MANAGE_FUNDING", async () => {
        const token = await fixtures.createPaymentToken();
        const { user, project, organization } =
          await fixtures.createUserOrgProject();
        await fixtures.grantPermissions(user.id, organization.id, [
          { permission: RulePermission.MANAGE_FUNDING },
        ]);
        const input: CreateFundingSessionInput = {
          organizationId: organization.id,
          projectIds: [project.id],
          startDate: faker.date.soon(2),
          endDate: faker.date.soon(7),
          tokenId: token.id,
          amount: faker.datatype.number().toString(),
        };

        const res = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: FundingRequests.createSession(input),
        });

        const session = res.body.data.session;
        expect(session.amount).toEqual(input.amount);
        expect(session.startDate).toEqual(input.startDate.toISOString());
        expect(session.endDate).toEqual(input.endDate.toISOString());
        expect(session.tokenId).toEqual(input.tokenId);
        expect(session.projects).toContainEqual(
          expect.objectContaining({ id: project.id })
        );
        expect(session.organization.fundingSessions).toHaveLength(1);
      });

      it("should fail for non-admin", async () => {
        const user = await fixtures.createUser();
        const organization = await fixtures.createOrganization();
        const project = await fixtures.createProject({
          organizationId: organization.id,
        });

        const res = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: FundingRequests.createSession({
            organizationId: organization.id,
            projectIds: [project.id],
            startDate: faker.date.soon(2),
            endDate: faker.date.soon(7),
            tokenId: (await fixtures.createPaymentToken()).id,
            amount: faker.datatype.number().toString(),
          }),
        });

        client.expectGqlError(res, HttpStatus.FORBIDDEN);
      });
    });

    describe("setFundingVote", () => {
      it("should allow anyone to cast vote", async () => {
        const user = await fixtures.createUser();
        const session = await fixtures.createFundingSession();
        const project = (await session.projects)[0];
        const task = await fixtures.createTask({
          status: TaskStatus.DONE,
          projectId: project.id,
        });
        await app.get(TaskSearchService).index([task], true);

        const weight = faker.datatype.number();
        const res = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: FundingRequests.vote({
            sessionId: session.id,
            taskId: task.id,
            weight,
          }),
        });

        const vote = res.body.data.vote;
        expect(vote.weight).toEqual(weight);
        expect(vote.taskId).toEqual(task.id);
        expect(vote.userId).toEqual(user.id);
        expect(vote.session.id).toEqual(session.id);
        expect(vote.session.votes).toHaveLength(1);
        expect(vote.session.votes[0].id).toEqual(vote.id);
        expect(vote.session.voters).toHaveLength(1);
        expect(vote.session.voters[0].id).toEqual(user.id);
      });

      it("should not allow voting on completed funding session", async () => {
        const user = await fixtures.createUser();
        const session = await fixtures.createFundingSession({
          closedAt: new Date(),
        });
        const project = (await session.projects)[0];
        const task = await fixtures.createTask({ projectId: project.id });
        await app.get(TaskSearchService).index([task], true);

        const res = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: FundingRequests.vote({
            sessionId: session.id,
            taskId: task.id,
            weight: faker.datatype.number(),
          }),
        });
        client.expectGqlError(res, HttpStatus.FORBIDDEN);
        client.expectGqlErrorMessage(res, "Funding session is closed");
      });

      it("should not allow voting on task not part of the session", async () => {
        const user = await fixtures.createUser();
        const session = await fixtures.createFundingSession();
        const task = await fixtures.createTask();
        await app.get(TaskSearchService).index([task], true);

        const res = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: FundingRequests.vote({
            sessionId: session.id,
            taskId: task.id,
            weight: faker.datatype.number(),
          }),
        });
        client.expectGqlError(res, HttpStatus.BAD_REQUEST);
      });
    });

    describe("closeFundingSession", () => {
      it("should create the correct task rewards", async () => {
        const amount = 1_000_000;

        const { user, organization } = await fixtures.createUserOrgProject();
        await fixtures.grantPermissions(user.id, organization.id, [
          { permission: RulePermission.MANAGE_FUNDING },
        ]);
        const userWith1Review = await fixtures.createUser();
        const userWith2Reviews = await fixtures.createUser();
        const userWith3Reviews = await fixtures.createUser();
        const task1Assignee = await fixtures.createUser();
        const task2Assignee = await fixtures.createUser();
        const totalVotes = 1 + 2 + 3;

        const session = await fixtures.createFundingSession({
          organizationId: organization.id,
          amount: amount.toString(),
          startDate: new Date(),
        });
        const project = (await session.projects)[0];

        const vote = (user: User, taskId: string, weight: number) =>
          client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: FundingRequests.vote({
              taskId,
              weight,
              sessionId: session.id,
            }),
          });

        const task1 = await fixtures.createTask({
          status: TaskStatus.DONE,
          projectId: project.id,
          assignees: [task1Assignee],
          owners: [userWith1Review, userWith2Reviews, userWith3Reviews],
        });
        const task2 = await fixtures.createTask({
          status: TaskStatus.DONE,
          projectId: project.id,
          assignees: [task2Assignee],
          owners: [userWith2Reviews, userWith3Reviews],
        });
        const task3 = await fixtures.createTask({
          status: TaskStatus.DONE,
          projectId: project.id,
          owners: [userWith3Reviews],
        });
        await app.get(TaskSearchService).index([task1, task2, task3], true);

        await Promise.all([
          vote(userWith1Review, task1.id, 1),
          vote(userWith2Reviews, task1.id, 3),
          vote(userWith2Reviews, task2.id, 1),
        ]);

        const res = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: FundingRequests.close(session.id),
        });

        const task1Amount = Math.round(
          amount * ((1 / 1) * (1 / totalVotes) + (3 / 4) * (2 / totalVotes))
        );
        const task2Amount = Math.round(
          amount * ((0 / 1) * (1 / totalVotes) + (1 / 4) * (2 / totalVotes))
        );

        expect(res.body.data.session.closedAt).not.toBe(null);
        expect(res.body.data.session.rewards).toHaveLength(2);
        expect(res.body.data.session.rewards).toContainEqual(
          expect.objectContaining({
            amount: task1Amount.toString(),
            tokenId: session.tokenId,
            task: expect.objectContaining({
              assignees: expect.arrayContaining([
                expect.objectContaining({ id: task1Assignee.id }),
              ]),
              parentTask: expect.objectContaining({ id: task1.id }),
            }),
          })
        );
        expect(res.body.data.session.rewards).toContainEqual(
          expect.objectContaining({
            amount: task2Amount.toString(),
            tokenId: session.tokenId,
            task: expect.objectContaining({
              assignees: expect.arrayContaining([
                expect.objectContaining({ id: task2Assignee.id }),
              ]),
              parentTask: expect.objectContaining({ id: task2.id }),
            }),
          })
        );
        expect(res.body.data.session.rewards).not.toContainEqual(
          expect.objectContaining({
            parentTask: expect.objectContaining({ id: task3.id }),
          })
        );
      });
    });
  });
});
