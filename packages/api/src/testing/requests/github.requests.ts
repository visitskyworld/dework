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
}
