import { useMutation, useQuery } from "@apollo/client";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useDefaultAbility } from "@dewo/app/contexts/PermissionsContext";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  AddRoleMutation,
  AddRoleMutationVariables,
  CreateRuleInput,
  CreateRuleMutation,
  CreateRuleMutationVariables,
  DeleteRuleMutation,
  DeleteRuleMutationVariables,
  GetOrganizationRolesQuery,
  GetOrganizationRolesQueryVariables,
  Project,
  RoleWithRules,
  Rule,
  UserWithRoles,
} from "@dewo/app/graphql/types";
import { useCallback, useMemo } from "react";

export function useOrganizationRoles(
  organizationId: string
): RoleWithRules[] | undefined {
  const { data } = useQuery<
    GetOrganizationRolesQuery,
    GetOrganizationRolesQueryVariables
  >(Queries.organizationRoles, {
    variables: { organizationId },
    skip: !organizationId,
  });
  return data?.organization?.roles;
}

export function useIsProjectPrivate(project: Project | undefined): boolean {
  const { ability } = useDefaultAbility(project?.organizationId);
  return useMemo(
    () => !!project && !!ability && !ability.can("read", project),
    [ability, project]
  );
}

export function useAddRole(): (
  roleId: string,
  userId: string
) => Promise<UserWithRoles> {
  const { user } = useAuthContext();
  const [mutation] = useMutation<AddRoleMutation, AddRoleMutationVariables>(
    Mutations.addRole
  );
  return useCallback(
    async (roleId, userId) => {
      const res = await mutation({
        variables: { roleId, userId },
        refetchQueries:
          user?.id === userId ? [{ query: Queries.me }] : undefined,
      });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.addRole;
    },
    [mutation, user?.id]
  );
}

export function useCreateRule(): (input: CreateRuleInput) => Promise<Rule> {
  const [mutation] = useMutation<
    CreateRuleMutation,
    CreateRuleMutationVariables
  >(Mutations.createRule);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.rule;
    },
    [mutation]
  );
}

export function useDeleteRule(): (id: string) => Promise<void> {
  const [mutation] = useMutation<
    DeleteRuleMutation,
    DeleteRuleMutationVariables
  >(Mutations.deleteRule);
  return useCallback(
    async (id) => {
      const res = await mutation({ variables: { id } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}
