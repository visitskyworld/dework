import { CreateProjectIntegrationInput } from "@dewo/api/modules/integrations/dto/CreateProjectIntegrationInput";
import { UpdateProjectIntegrationInput } from "@dewo/api/modules/integrations/dto/UpdateProjectIntegrationInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class IntegrationRequests {
  public static createProjectIntegration(
    input: CreateProjectIntegrationInput
  ): GraphQLTestClientRequestBody<{ input: CreateProjectIntegrationInput }> {
    return {
      query: `
        mutation CreateProjectIntegration($input: CreateProjectIntegrationInput!) {
          integration: createProjectIntegration(input: $input) {
            id
            type
            deletedAt
            project {
              id
              integrations {
                id
              }
            }
          }
        }
      `,
      variables: { input },
    };
  }

  public static updateProjectIntegration(
    input: UpdateProjectIntegrationInput
  ): GraphQLTestClientRequestBody<{ input: UpdateProjectIntegrationInput }> {
    return {
      query: `
        mutation UpdateProjectIntegration($input: UpdateProjectIntegrationInput!) {
          integration: updateProjectIntegration(input: $input) {
            id
            type
            deletedAt
            project {
              id
              integrations {
                id
              }
            }
          }
        }
      `,
      variables: { input },
    };
  }
}
