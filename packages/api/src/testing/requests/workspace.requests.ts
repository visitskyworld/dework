import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class WorkspaceRequests {
  public static get(
    slug: string
  ): GraphQLTestClientRequestBody<{ slug: string }> {
    return {
      query: `
        query GetWorkspace($slug: String!) {
          workspace: getWorkspaceBySlug(slug: $slug) {
            id
            skills {
              count
              skill {
                id
              }
            }
          }
        }
      `,
      variables: { slug },
    };
  }
}
