import { CreateProjectInput } from "@dewo/api/modules/project/dto/CreateProjectInput";
import { CreateProjectIntegrationInput } from "@dewo/api/modules/project/dto/CreateProjectIntegrationInput";
import { UpdateProjectInput } from "@dewo/api/modules/project/dto/UpdateProjectInput";
import { UpdateProjectIntegrationInput } from "@dewo/api/modules/project/dto/UpdateProjectIntegrationInput";
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
      integrations {
        id
        type
      }
      taskCount
      doneTaskCount: taskCount(status: DONE)
      todoWithRewardTaskCount: taskCount(status: TODO, rewardNotNull: true)
      paymentMethods {
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

  public static update(
    input: UpdateProjectInput
  ): GraphQLTestClientRequestBody<{ input: UpdateProjectInput }> {
    return {
      query: `
        mutation UpdateProject($input: UpdateProjectInput!) {
          project: updateProject(input: $input) {
            ...Project
          }
        }

        ${this.projectFragment}
      `,
      variables: { input },
    };
  }

  public static createIntegration(
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
              ...Project
            }
          }
        }

        ${this.projectFragment}
      `,
      variables: { input },
    };
  }

  public static updateIntegration(
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
              ...Project
            }
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
