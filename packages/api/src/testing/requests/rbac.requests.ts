import { CreateRoleInput } from "@dewo/api/modules/rbac/dto/CreateRoleInput";
import { CreateRuleInput } from "@dewo/api/modules/rbac/dto/CreateRuleInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class RbacRequests {
  public static createRole(
    input: CreateRoleInput
  ): GraphQLTestClientRequestBody<{ input: CreateRoleInput }> {
    return {
      query: `
        mutation CreateRole($input: CreateRoleInput!) {
          role: createRole(input: $input) {
            id
            name
            color
            organizationId
          }
        }
      `,
      variables: { input },
    };
  }

  public static createRule(
    input: CreateRuleInput
  ): GraphQLTestClientRequestBody<{ input: CreateRuleInput }> {
    return {
      query: `
        mutation CreateRule($input: CreateRuleInput!) {
          rule: createRule(input: $input) {
            id
            permission
            inverted
            roleId
            taskId
            projectId
          }
        }
      `,
      variables: { input },
    };
  }
}