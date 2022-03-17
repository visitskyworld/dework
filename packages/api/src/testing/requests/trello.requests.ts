import { CreateProjectsFromTrelloInput } from "@dewo/api/modules/integrations/trello/dto/CreateProjectsFromTrelloInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class TrelloRequests {
  public static getBoards(
    threepidId: string
  ): GraphQLTestClientRequestBody<{ threepidId: string }> {
    return {
      query: `
        query GetTrelloBoards($threepidId: UUID!) {
          boards: getTrelloBoards(threepidId: $threepidId) {
            id
            name
          }
        }
      `,
      variables: { threepidId },
    };
  }

  public static createProjectsFromTrello(
    input: CreateProjectsFromTrelloInput
  ): GraphQLTestClientRequestBody<{ input: CreateProjectsFromTrelloInput }> {
    return {
      query: `
        mutation CreateProjectsFromTrello($input: CreateProjectsFromTrelloInput!) {
          organization: createProjectsFromTrello(input: $input) {
            id
            projects {
              id
              name
              description
              tasks {
                id
                name
                status
                dueDate
                description
                tags {
                  id
                  label
                  color
                }
                subtasks {
                  id
                  name
                  status
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
