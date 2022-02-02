import { ProjectVisibility } from "@dewo/api/models/Project";
import { TaskStatus } from "@dewo/api/models/Task";
import { Threepid, ThreepidSource } from "@dewo/api/models/Threepid";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { TrelloRequests } from "@dewo/api/testing/requests/trello.requests";
import { INestApplication } from "@nestjs/common";

//  https://trello.com/dework3
const trelloToken =
  "9998cd0c54c6636eae56b88d9e0b643402d3f1896c2b3b2563e1b297afc45143"; // dework3

describe("TrelloImportService", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let client: GraphQLTestClient;
  let threepid: Threepid;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    client = app.get(GraphQLTestClient);

    threepid = await fixtures.createThreepid({
      source: ThreepidSource.notion,
      config: { token: trelloToken },
    });
  });

  afterAll(() => app.close());

  describe("getTrelloBoards", () => {
    it("should return correct boards", async () => {
      const response = await client.request({
        app,
        body: TrelloRequests.getBoards(threepid.id),
      });

      expect(response.body.data.boards).toHaveLength(2);
      expect(response.body.data.boards).toContainEqual(
        expect.objectContaining({
          id: "61fa8b95c52ddf85f705035d",
          name: "Unit Test Private",
        })
      );
      expect(response.body.data.boards).toContainEqual(
        expect.objectContaining({
          id: "61fa8b70a2c2bf8fbaa66416",
          name: "Unit Test Public",
        })
      );
    });
  });

  describe("createProjectsFromTrello", () => {
    it("should import correctly", async () => {
      const user = await fixtures.createUser();
      const organization = await fixtures.createOrganization({}, user);

      const boardIds = await client
        .request({ app, body: TrelloRequests.getBoards(threepid.id) })
        .then((res) => res.body.data.boards.map((b: any) => b.id));
      const response = await client.request({
        app,
        auth: fixtures.createAuthToken(user),
        body: TrelloRequests.createProjectsFromTrello({
          boardIds,
          threepidId: threepid.id,
          organizationId: organization.id,
        }),
      });

      const projects = response.body.data.organization.projects;
      expect(projects).toHaveLength(2);

      expect(projects).toContainEqual(
        expect.objectContaining({
          name: "Unit Test Private",
          visibility: ProjectVisibility.PRIVATE,
          tasks: expect.arrayContaining([
            expect.objectContaining({
              name: "Task that needs to be done",
              status: TaskStatus.TODO,
              dueDate: "2022-02-24T00:00:00.000Z",
              description: expect.stringContaining(
                `
# h1's are supported

This is a description. It supports **markdown** and _italic_ text
              `.trim()
              ),
              tags: expect.arrayContaining([
                expect.objectContaining({ label: "Green", color: "green" }),
                expect.objectContaining({ label: "Purple", color: "purple" }),
                expect.objectContaining({ label: "Orange", color: "orange" }),
              ]),
              subtasks: expect.arrayContaining([
                expect.objectContaining({
                  name: "Unchecked",
                  status: TaskStatus.TODO,
                }),
                expect.objectContaining({
                  name: "Checked",
                  status: TaskStatus.DONE,
                }),
              ]),
            }),
          ]),
        })
      );

      expect(projects).toContainEqual(
        expect.objectContaining({
          name: "Unit Test Public",
          visibility: ProjectVisibility.PUBLIC,
          tasks: expect.arrayContaining([
            expect.objectContaining({
              name: "Task in public board",
              status: TaskStatus.IN_PROGRESS,
              tags: [],
            }),
          ]),
        })
      );
    });
  });
});
