import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class GithubRequests {
  public static getRepos(
    organizationId: string
  ): GraphQLTestClientRequestBody<{ organizationId: string }> {
    return {
      query: `
        query GetGithubRepos($organizationId: UUID!) {
          repos: getGithubRepos(organizationId: $organizationId) {
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
          }
        }
      `,
      variables: { projectId },
    };
  }
}
