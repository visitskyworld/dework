import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class UserRequests {
  public static create(
    threepidId: string
  ): GraphQLTestClientRequestBody<{ threepidId: string }> {
    return {
      query: `
        mutation CreateUser($threepidId: UUID!) {
          user: createUser(threepidId: $threepidId) {
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
