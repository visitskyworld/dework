import { UpdateUserInput } from "@dewo/api/modules/user/dto/UpdateUserInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class UserRequests {
  private static userFragment = `
    fragment User on User {
      id
      username
      imageUrl
      threepids {
        id
      }
      paymentMethod {
        id
      }
    }
  `;

  public static authWithThreepid(
    threepidId: string
  ): GraphQLTestClientRequestBody<{ threepidId: string }> {
    return {
      query: `
        mutation AuthWithThreepid($threepidId: UUID!) {
          authWithThreepid(threepidId: $threepidId) {
            authToken
            user {
              ...User
            }
          }
        }

        ${this.userFragment}
      `,
      variables: { threepidId },
    };
  }

  public static update(
    input: UpdateUserInput
  ): GraphQLTestClientRequestBody<{ input: UpdateUserInput }> {
    return {
      query: `
        mutation UpdateUser($input: UpdateUserInput!) {
          user: updateUser(input: $input) {
            ...User
          }
        }

        ${this.userFragment}
      `,
      variables: { input },
    };
  }

  public static me(): GraphQLTestClientRequestBody {
    return {
      query: `
        query Me {
          me {
            id
            tasks {
              id
              assignees {
                id
              }
            }
          }
        }
      `,
    };
  }
}
