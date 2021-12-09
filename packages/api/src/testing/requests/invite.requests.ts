import { CreateInviteInput } from "@dewo/api/modules/invite/dto/CreateInviteInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class InviteRequests {
  public static create(
    input: CreateInviteInput
  ): GraphQLTestClientRequestBody<{ input: CreateInviteInput }> {
    return {
      query: `
        mutation CreateInvite($input: CreateInviteInput!) {
          invite: createInvite(input: $input) {
            id
            inviterId
            organizationId
          }
        }
      `,
      variables: { input },
    };
  }

  public static accept(
    inviteId: string
  ): GraphQLTestClientRequestBody<{ inviteId: string }> {
    return {
      query: `
        mutation AcceptInvite($inviteId: UUID!) {
          invite: acceptInvite(id: $inviteId) {
            id
            organization {
              id
              members {
                id
                role
                userId
              }
            }
          }
        }
      `,
      variables: { inviteId },
    };
  }
}
