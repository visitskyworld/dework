import { HttpStatus, INestApplication } from "@nestjs/common";

import { Fixtures } from "../../../../testing/Fixtures";
import { WebhookTestClient } from "../../../../testing/WebhookTestClient";
import { getTestApp } from "../../../../testing/getTestApp";
import { TaskStatusEnum } from "../../../../models/Task";
import {
  ProjectIntegrationSource,
  GithubProjectIntegrationFeature,
  GithubProjectIntegrationConfig,
} from "../../../../models/ProjectIntegration";

describe("GithubController", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let client: WebhookTestClient;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    client = app.get(WebhookTestClient);
  });

  afterAll(() => app.close());

  describe("webhook", () => {
    it("should create a branch in db", async () => {
      const project = await fixtures.createProject();
      const task = await fixtures.createTask({
        projectId: project.id,
        status: TaskStatusEnum.IN_PROGRESS,
      });
      const ghIntegration = await fixtures.createProjectIntegation({
        projectId: project.id,
        source: ProjectIntegrationSource.github,
        config: {
          installationId: "123",
          features: [GithubProjectIntegrationFeature.ADD_PR_TO_TASK],
        },
      });

      const response = await client.request({
        app,
        body: {
          ref: `refs/heads/username/dw-${task.number}/feature`,
          pull_request: {
            title: "test",
            state: "open",
            html_url: "link",
            number: 1,
            draft: false,
          },
          installation: {
            id: (ghIntegration.config as GithubProjectIntegrationConfig)
              .installationId,
          },
          repository: {
            full_name: "My repo",
          },
        } as any,
      });

      expect(response.status).toEqual(HttpStatus.CREATED);
    });
  });
});
