import { CreateProjectInput } from "@dewo/api/modules/project/dto/CreateProjectInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class ProjectRequests {
  private static projectFragment = `
    fragment Project on Project {
      id
      name
      organization {
        id
      }
      tasks {
        id
      }
    }
  `;

  public static create(
    input: CreateProjectInput
  ): GraphQLTestClientRequestBody<{ input: CreateProjectInput }> {
    return {
      query: `
        mutation CreateProject($input: CreateProjectInput!) {
          project: createProject(input: $input) {
            ...Project
          }
        }

        ${this.projectFragment}
      `,
      variables: { input },
    };
  }

  public static get(
    projectId: string
  ): GraphQLTestClientRequestBody<{ projectId: string }> {
    return {
      query: `
        query GetProject($projectId: UUID!) {
          project: getProject(id: $projectId) {
            ...Project
          }
        }

        ${this.projectFragment}
      `,
      variables: { projectId },
    };
  }
}
