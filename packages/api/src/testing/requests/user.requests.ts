import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class UserRequests {
  public static create(
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

  public static connectToThreepid(
    threepidId: string
  ): GraphQLTestClientRequestBody<{ threepidId: string }> {
    return {
      query: `
        mutation ConnectUserToThreepid($threepidId: UUID!) {
          user: connectUserToThreepid(threepidId: $threepidId) {
            id
            imageUrl
            threepids {
              id
            }
          }
        }
      `,
      variables: { threepidId },
    };
  }
}
