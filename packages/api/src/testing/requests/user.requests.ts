import { SetUserDetailInput } from "@dewo/api/modules/user/dto/SetUserDetailInput";
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
      paymentMethods {
        id
        type
        address
        networks {
          id
        }
      }
      details {
        value
        type
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

  public static setUserDetail(
    input: SetUserDetailInput
  ): GraphQLTestClientRequestBody<{ input: SetUserDetailInput }> {
    return {
      query: `
        mutation SetUserDetail($input: SetUserDetailInput!) {
          setUserDetail(input: $input) { 
            id           
            details {
              value
              type
            }
          }
        }

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

  public static me(): GraphQLTestClientRequestBody {
    return {
      query: `
        query Me {
          me {
            id
            organizations {
              id
            }
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

  public static permissions(
    input: GetUserPermissionsInput
  ): GraphQLTestClientRequestBody<{ input: GetUserPermissionsInput }> {
    return {
      query: `
        query Permissions($input: GetUserPermissionsInput!) {
          permissions: getPermissions(input: $input)
        }
      `,
      variables: { input },
    };
  }
}
