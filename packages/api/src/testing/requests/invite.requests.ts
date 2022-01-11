import { OrganizationInviteInput } from "@dewo/api/modules/invite/dto/OrganizationInviteInput";
import { ProjectInviteInput } from "@dewo/api/modules/invite/dto/ProjectInviteInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class InviteRequests {
  public static createOrganizationInvite(
    input: OrganizationInviteInput
  ): GraphQLTestClientRequestBody<{ input: OrganizationInviteInput }> {
    return {
      query: `
        mutation CreateOrganizationInvite($input: OrganizationInviteInput!) {
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
    input: ProjectInviteInput
  ): GraphQLTestClientRequestBody<{ input: ProjectInviteInput }> {
    return {
      query: `
        mutation CreateProjectInvite($input: ProjectInviteInput!) {
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
                user {
                  id
                  organizations {
                    id
                  }
                }
              }
            }
          }
        }
      `,
      variables: { inviteId },
    };
  }
}
