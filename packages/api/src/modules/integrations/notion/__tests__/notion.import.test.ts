import { TaskStatus } from "@dewo/api/models/Task";
import { ThreepidSource } from "@dewo/api/models/Threepid";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { NotionRequests } from "@dewo/api/testing/requests/notion.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";

//  https://www.notion.so/dafant/e25d7a9ff7134f47886ea7c39850ca3c?v=64f8d828b3154b2ea637fb5a2ee706a9
const notionAccessToken = "secret_GH9C7HzSOtYEePBnmxxUNSdVGbeO9BGuKkhyHupyu26";

describe("NotionImportService", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let client: GraphQLTestClient;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    client = app.get(GraphQLTestClient);
  });

  afterAll(() => app.close());

  describe("createTasksFromNotionPage", () => {
    it("testing", async () => {
      const user = await fixtures.createUser();
      const organization = await fixtures.createOrganization({}, user);
      const threepid = await fixtures.createThreepid({
        source: ThreepidSource.notion,
        config: { accessToken: notionAccessToken, profile: undefined as any },
      });

      const response = await client.request({
        app,
        auth: fixtures.createAuthToken(user),
        body: NotionRequests.createProjectsFromNotion({
          threepidId: threepid.id,
          organizationId: organization.id,
        }),
      });

      expect(response.statusCode).toEqual(HttpStatus.OK);

      const projects = response.body.data?.organization.projects;
      expect(projects.length).toEqual(2);
      expect(projects).toContainEqual(
        expect.objectContaining({
          name: "Dework 1",
          tasks: expect.arrayContaining([
            expect.objectContaining({
              name: "Card 1",
              status: TaskStatus.DONE,
              tags: expect.arrayContaining([
                expect.objectContaining({ label: "Oransche", color: "orange" }),
                expect.objectContaining({ label: "MS1", color: "gold" }),
                expect.objectContaining({ label: "MS2", color: "purple" }),
                expect.objectContaining({ label: "SS", color: "red" }),
              ]),
              description: expect.stringContaining(
                `
# Heading 1 with _italic_ and <u>underlined</u> content

## Heading 2 with ~~[strikethrough link](https://dework.xyz)~~

### Heading 3 with \`inline code\`

---

Regular text, **bold**, _italic_, etc

[Link](https://dework.xyz)

- [ ] To Do unchecked

- [X] To Do checked

- Bullet 1

- Bullet 2

1. Item 1

1. Item 2

> Beautiful Quote

\`\`\`javascript
function helloWorld() {
\tconsole.log('hello world');
}
\`\`\`

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/f5f16c32-0549-4f41-aeff-f7ee58bfd60d/square-logo.dev.png
                            `.trim()
              ),
            }),
            expect.objectContaining({
              name: "Card 2",
              status: TaskStatus.IN_PROGRESS,
              tags: [],
              description: expect.stringContaining(
                "Originally created from Notion task: https://www.notion.so/Card-2-c5c27d253e334bc1818fedbd32fceb2f"
              ),
            }),
            expect.objectContaining({
              name: "Card 3",
              status: TaskStatus.TODO,
              tags: [],
              description: expect.stringContaining(
                "Originally created from Notion task: https://www.notion.so/Card-3-45d0d3713e994e2b89fef1e51cb836a5"
              ),
            }),
            expect.objectContaining({
              name: "Card 4",
              status: TaskStatus.TODO,
              tags: [],
              description: expect.stringContaining(
                "Originally created from Notion task: https://www.notion.so/Card-4-3657a35a859a4d43aa5ec90bf3d86a89"
              ),
            }),
          ]),
        })
      );

      expect(projects).toContainEqual(
        expect.objectContaining({
          name: "Dework 2",
          tasks: expect.arrayContaining([
            expect.objectContaining({
              name: "Row 1",
              status: TaskStatus.TODO,
              tags: expect.arrayContaining([
                expect.objectContaining({ label: "Tag 1", color: "grey" }),
                expect.objectContaining({ label: "Tag 2", color: "magenta" }),
                expect.objectContaining({ label: "Tag 3", color: "blue" }),
              ]),
            }),
            expect.objectContaining({
              name: "Row 2",
              status: TaskStatus.IN_PROGRESS,
            }),
            expect.objectContaining({
              name: "Row 3",
              status: TaskStatus.DONE,
            }),
          ]),
        })
      );
    });
  });
});
