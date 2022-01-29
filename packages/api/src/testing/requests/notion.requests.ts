import { CreateProjectsFromNotionInput } from "@dewo/api/modules/integrations/notion/dto/CreateProjectsFromNotionInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class NotionRequests {
  public static createProjectsFromNotion(
    input: CreateProjectsFromNotionInput
  ): GraphQLTestClientRequestBody<{ input: CreateProjectsFromNotionInput }> {
    return {
      query: `
        mutation CreateProjectsFromNotion($input: CreateProjectsFromNotionInput!) {
          organization: createProjectsFromNotion(input: $input) {
            id
            projects {
              id
              name
              tasks {
                id
                name
                status
                description
                tags {
                  id
                  label
                  color
                }
              }
            }
          }
        }
      `,
      variables: { input },
    };
  }
}
