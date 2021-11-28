import { CreateProjectInput } from "@dewo/api/modules/project/dto/CreateProjectInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class ProjectRequests {
  public static create(
    input: CreateProjectInput
  ): GraphQLTestClientRequestBody<{ input: CreateProjectInput }> {
    return {
      query: `
        mutation CreateProject($input: CreateProjectInput!) {
          project: createProject(input: $input) {
            id
            name
            organization {
              id
            }
          }
        }
      `,
      variables: { input },
    };
  }
}
