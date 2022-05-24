import { CreateInviteInput } from "@dewo/api/modules/invite/dto/CreateInviteInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class InviteRequests {
  public static createInvite(
    input: CreateInviteInput
  ): GraphQLTestClientRequestBody<{ input: CreateInviteInput }> {
    return {
      query: `
        mutation CreateInvite($input: CreateInviteInput!) {
          invite: createInvite(input: $input) {
            id
            inviterId
            projectId
            organizationId
            permission
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
              ...Organization
            }
            project {
              ...Project
            }
            task {
              id
              project {
                ...Project
              }
            }
          }
        }

        fragment Organization on Organization {
          id
          users {
            id
          }
        }

        fragment Project on Project {
          id
          organization {
            ...Organization
          }
        }
      `,
      variables: { inviteId },
    };
  }
}
