import { CreateUserDetailInput } from "@dewo/api/modules/user/dto/CreateUserDetail";
import { GetUserPermissionsInput } from "@dewo/api/modules/user/dto/GetUserPermissionsInput";
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

  public static createUserDetail(
    input: CreateUserDetailInput
  ): GraphQLTestClientRequestBody<{ input: CreateUserDetailInput }> {
    return {
      query: `
        mutation CreateUserDetail($input: CreateUserDetailInput!) {
          createUserDetail(input: $input) {
            type
            value
            user {
              ...User
            }
          }
        }

        ${this.userFragment}
      `,
      variables: { input },
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

  public static me(
    input?: GetUserPermissionsInput
  ): GraphQLTestClientRequestBody<{ input?: GetUserPermissionsInput }> {
    return {
      query: `
        query Me($input: GetUserPermissionsInput) {
          me {
            id
            permissions(input: $input)
            tasks {
              id
              assignees {
                id
              }
            }
          }
        }
      `,
      variables: { input },
    };
  }
}
