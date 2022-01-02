import { CreateOrganizationInviteInput } from "@dewo/api/modules/invite/dto/CreateOrganizationInviteInput";
import { CreateProjectInviteInput } from "@dewo/api/modules/invite/dto/CreateProjectInviteInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class InviteRequests {
  public static createOrganizationInvite(
    input: CreateOrganizationInviteInput
  ): GraphQLTestClientRequestBody<{ input: CreateOrganizationInviteInput }> {
    return {
      query: `
        mutation CreateOrganizationInvite($input: CreateOrganizationInviteInput!) {
          invite: createOrganizationInvite(input: $input) {
            id
            inviterId
            organizationId
            organizationRole
          }
        }
      `,
      variables: { input },
    };
  }

  public static createProjectInvite(
    input: CreateProjectInviteInput
  ): GraphQLTestClientRequestBody<{ input: CreateProjectInviteInput }> {
    return {
      query: `
        mutation CreateProjectInvite($input: CreateProjectInviteInput!) {
          invite: createProjectInvite(input: $input) {
            id
            inviterId
            projectId
            projectRole
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
            project {
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
