import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class UserRequests {
  public static authWithThreepid(
    threepidId: string
  ): GraphQLTestClientRequestBody<{ threepidId: string }> {
    return {
      query: `
        mutation AuthWithThreepid($threepidId: UUID!) {
          authWithThreepid(threepidId: $threepidId) {
            authToken
            user {
              id
              imageUrl
              threepids {
                id
              }
            }
          }
        }
      `,
      variables: { threepidId },
    };
  }
}
