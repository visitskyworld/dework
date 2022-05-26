import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { WorkspaceRequests } from "@dewo/api/testing/requests/workspace.requests";
import { INestApplication } from "@nestjs/common";
import _ from "lodash";

describe("WorkspaceSkillResolver", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let client: GraphQLTestClient;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    client = app.get(GraphQLTestClient);
  });

  afterAll(() => app.close());

  describe("Workspace.skills", () => {
    it("should resolve skill stats for workspaces", async () => {
      const workspace = await fixtures.createWorkspace();
      const project = await fixtures.createProject({
        workspaceId: workspace.id,
      });

      const skillWith2Tasks = await fixtures.createSkill();
      const skillWith3Tasks = await fixtures.createSkill();

      await Promise.all([
        ..._.range(2).map(() =>
          fixtures.createTask({
            projectId: project.id,
            skills: [skillWith2Tasks],
          })
        ),
        ..._.range(3).map(() =>
          fixtures.createTask({
            projectId: project.id,
            skills: [skillWith3Tasks],
          })
        ),
      ]);

      const response = await client.request({
        app,
        body: WorkspaceRequests.get(workspace.slug),
      });

      const fetched = response.body.data.workspace;
      expect(fetched.id).toEqual(workspace.id);
      expect(fetched.skills).toHaveLength(2);
      expect(fetched.skills[0].count).toEqual(3);
      expect(fetched.skills[0].skill.id).toEqual(skillWith3Tasks.id);
      expect(fetched.skills[1].count).toEqual(2);
      expect(fetched.skills[1].skill.id).toEqual(skillWith2Tasks.id);
    });
  });
});
