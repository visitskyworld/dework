import { CreateProjectsFromGithubInput } from "@dewo/api/modules/integrations/github/dto/CreateProjectsFromGithubInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class GithubRequests {
  private static taskFragment = `
    fragment Task on Task {
      id
      name
      status
      description
      creatorId
      tags {
        id
        label
        color
      }
      githubIssue {
        number
      }
    }
  `;

  public static getRepos(
    organizationId: string
  ): GraphQLTestClientRequestBody<{ organizationId: string }> {
    return {
      query: `
        query GetGithubRepos($organizationId: UUID!) {
          repos: getGithubRepos(organizationId: $organizationId) {
            id
            name
            organization
            integrationId
          }
        }
      `,
      variables: { organizationId },
    };
  }

  public static createTasksFromGithubIssues(
    projectId: string
  ): GraphQLTestClientRequestBody<{ projectId: string }> {
    return {
      query: `
        mutation CreateTasksFromGithubIssue($projectId: UUID!) {
          project: createTasksFromGithubIssues(projectId: $projectId) {
            id
            tasks {
              ...Task
            }
          }
        }

        ${this.taskFragment}
      `,
      variables: { projectId },
    };
  }

  public static createProjectsFromGithub(
    input: CreateProjectsFromGithubInput
  ): GraphQLTestClientRequestBody<{ input: CreateProjectsFromGithubInput }> {
    return {
      query: `
        mutation CreateProjectsFromGithub($input: CreateProjectsFromGithubInput!) {
          organization: createProjectsFromGithub(input: $input) {
            id
            projects {
              id
              name
              description
              visibility
              tasks {
                ...Task
              }
            }
          }
        }

        ${this.taskFragment}
      `,
      variables: { input },
    };
  }
}
