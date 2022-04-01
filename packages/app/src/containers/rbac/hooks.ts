import {
  InternalRefetchQueriesInclude,
  useMutation,
  useQuery,
} from "@apollo/client";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useDefaultAbility } from "@dewo/app/contexts/PermissionsContext";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  AddRoleMutation,
  AddRoleMutationVariables,
  CreateRoleInput,
  CreateRoleMutation,
  CreateRoleMutationVariables,
  CreateRuleInput,
  CreateRuleMutation,
  CreateRuleMutationVariables,
  DeleteRuleMutation,
  DeleteRuleMutationVariables,
  GetOrganizationRolesQuery,
  GetOrganizationRolesQueryVariables,
  Project,
  RemoveRoleMutation,
  RemoveRoleMutationVariables,
  Role,
  RoleWithRules,
  Rule,
  UserWithRoles,
} from "@dewo/app/graphql/types";
import { useCallback, useMemo } from "react";
import { useOrganizationUsers } from "../organization/hooks";

export function useOrganizationRoles(
  organizationId: string | undefined
): RoleWithRules[] | undefined {
  const { data } = useQuery<
    GetOrganizationRolesQuery,
    GetOrganizationRolesQueryVariables
  >(Queries.organizationRoles, {
    variables: { organizationId: organizationId! },
    skip: !organizationId,
  });
  return data?.organization?.roles;
}

export function useIsProjectPrivate(
  project: Project | undefined,
  organizationId: string | undefined
): boolean {
  const { ability } = useDefaultAbility(organizationId);
  return useMemo(
    () => !!project && !!ability && !ability.can("read", project),
    [ability, project]
  );
}

export function useAddRole(): (
  role: Role,
  userId: string
) => Promise<UserWithRoles> {
  const { user } = useAuthContext();
  const [mutation] = useMutation<AddRoleMutation, AddRoleMutationVariables>(
    Mutations.addRole
  );
  return useCallback(
    async (role, userId) => {
      const refetchQueries: InternalRefetchQueriesInclude = [];
      if (user?.id === userId) {
        refetchQueries.push({ query: Queries.me });
        refetchQueries.push({
          query: Queries.permissions,
          variables: { organizationId: role.organizationId },
        });
      }
      const res = await mutation({
        variables: { roleId: role.id, userId },
        refetchQueries,
      });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.addRole;
    },
    [mutation, user?.id]
  );
}

export function useRemoveRole(): (
  role: Role,
  userId: string
) => Promise<UserWithRoles> {
  const { user } = useAuthContext();
  const [mutation] = useMutation<
    RemoveRoleMutation,
    RemoveRoleMutationVariables
  >(Mutations.removeRole);
  return useCallback(
    async (role, userId) => {
      const refetchQueries: InternalRefetchQueriesInclude = [];
      if (user?.id === userId) {
        refetchQueries.push({ query: Queries.me });
        refetchQueries.push({
          query: Queries.permissions,
          variables: { organizationId: role.organizationId },
        });
      }
      const res = await mutation({
        variables: { roleId: role.id, userId },
        refetchQueries,
      });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.removeRole;
    },
    [mutation, user?.id]
  );
}

export function useCreateRole(): (
  input: CreateRoleInput
) => Promise<RoleWithRules> {
  const [mutation] = useMutation<
    CreateRoleMutation,
    CreateRoleMutationVariables
  >(Mutations.createRole);
  return useCallback(
    async (input) => {
      const res = await mutation({
        variables: { input },
        refetchQueries: [
          {
            query: Queries.organizationRoles,
            variables: { organizationId: input.organizationId },
          },
        ],
      });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.role;
    },
    [mutation]
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

export function useFollowOrganization(
  organizationId: string | undefined
): () => Promise<void> {
  const { user } = useAuthContext();
  const addRole = useAddRole();

  const roles = useOrganizationRoles(organizationId);
  const fallbackRole = useMemo(() => roles?.find((r) => r.fallback), [roles]);

  const { refetch: refetchOrganizationUsers } =
    useOrganizationUsers(organizationId);
  return useCallback(async () => {
    if (!fallbackRole || !user) return;
    await addRole(fallbackRole, user.id);
    await refetchOrganizationUsers();
  }, [addRole, refetchOrganizationUsers, user, fallbackRole]);
}

export function useUnfollowOrganization(
  organizationId: string | undefined
): () => Promise<void> {
  const { user } = useAuthContext();
  const removeRole = useRemoveRole();

  const roles = useOrganizationRoles(organizationId);
  const fallbackRole = useMemo(() => roles?.find((r) => r.fallback), [roles]);

  const { refetch: refetchOrganizationUsers } =
    useOrganizationUsers(organizationId);
  return useCallback(async () => {
    if (!fallbackRole || !user) return;
    await removeRole(fallbackRole, user.id);
    await refetchOrganizationUsers();
  }, [removeRole, refetchOrganizationUsers, user, fallbackRole]);
}

export function useRolesWithAccess(
  organizationId: string | undefined,
  projectId?: string
): RoleWithRules[] | undefined {
  const roles = useOrganizationRoles(organizationId);
  return useMemo(
    () =>
      roles?.filter((r) =>
        r.rules.some(
          (rule) =>
            !rule.inverted && (!projectId || rule.projectId === projectId)
        )
      ),
    [roles, projectId]
  );
}
