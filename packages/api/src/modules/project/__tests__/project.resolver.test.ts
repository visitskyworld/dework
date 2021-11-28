import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { ProjectRequests } from "@dewo/api/testing/requests/project.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";
import faker from "faker";

describe("ProjectResolver", () => {
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
    describe("createProject", () => {
      it("should fail if user is not in org", async () => {
        const user = await fixtures.createUser();
        const organization = await fixtures.createOrganization();

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: ProjectRequests.create({
            name: faker.company.companyName(),
            organizationId: organization.id,
          }),
        });

        client.expectGqlError(response, HttpStatus.UNAUTHORIZED);
      });

      it("should succeed if user is in org", async () => {
        const name = faker.company.companyName();
        const user = await fixtures.createUser();
        const organization = await fixtures.createOrganization({
          users: [user],
        });

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: ProjectRequests.create({
            name,
            organizationId: organization.id,
          }),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const project = response.body.data?.project;
        expect(project).toBeDefined();
        expect(project.name).toEqual(name);
        expect(project.organization.id).toEqual(organization.id);
      });
    });
  });
});
