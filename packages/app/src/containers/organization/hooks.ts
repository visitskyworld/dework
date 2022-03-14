import { useMutation, useQuery, WatchQueryFetchPolicy } from "@apollo/client";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useDefaultAbility } from "@dewo/app/contexts/PermissionsContext";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  AddRoleMutation,
  AddRoleMutationVariables,
  CreateOrganizationInput,
  CreateOrganizationMutation,
  CreateOrganizationMutationVariables,
  CreateOrganizationTagInput,
  CreateOrganizationTagMutation,
  CreateOrganizationTagMutationVariables,
  CreateProjectSectionInput,
  CreateProjectSectionMutation,
  CreateProjectSectionMutationVariables,
  DiscordIntegrationChannel,
  GetOrganizationDiscordChannelsQuery,
  GetOrganizationDiscordChannelsQueryVariables,
  GetOrganizationGithubReposQuery,
  GetOrganizationGithubReposQueryVariables,
  GetOrganizationQuery,
  GetOrganizationQueryVariables,
  GetOrganizationTagsQuery,
  GetOrganizationTagsQueryVariables,
  GetOrganizationTasksQuery,
  GetOrganizationTasksQueryVariables,
  GetOrganizationTaskTagsQuery,
  GetOrganizationTaskTagsQueryVariables,
  GetOrganizationUsersQuery,
  GetOrganizationUsersQueryVariables,
  GithubRepo,
  Organization,
  OrganizationDetails,
  OrganizationMember,
  OrganizationRole,
  OrganizationTag,
  Project,
  ProjectSection,
  RemoveOrganizationMemberInput,
  RemoveOrganizationMemberMutation,
  RemoveOrganizationMemberMutationVariables,
  SetOrganizationDetailInput,
  SetOrganizationDetailMutation,
  SetOrganizationDetailMutationVariables,
  SetOrganizationDetailMutation_organization,
  TaskTag,
  UpdateOrganizationInput,
  UpdateOrganizationMemberInput,
  UpdateOrganizationMemberMutation,
  UpdateOrganizationMemberMutationVariables,
  UpdateOrganizationMutation,
  UpdateOrganizationMutationVariables,
  UpdateProjectSectionInput,
  UpdateProjectSectionMutation,
  UpdateProjectSectionMutationVariables,
  User,
  UserWithRoles,
} from "@dewo/app/graphql/types";
import _ from "lodash";
import { useCallback, useEffect, useMemo } from "react";
import { useListenToTasks } from "../task/hooks";

export function useCreateOrganization(): (
  input: CreateOrganizationInput
) => Promise<Organization> {
  const [mutation] = useMutation<
    CreateOrganizationMutation,
    CreateOrganizationMutationVariables
  >(Mutations.createOrganization);
  return useCallback(
    async (input) => {
      const res = await mutation({
        variables: { input },
        refetchQueries: [{ query: Queries.me }],
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.organization;
    },
    [mutation]
  );
}

export function useUpdateOrganization(): (
  input: UpdateOrganizationInput
) => Promise<Organization> {
  const [mutation] = useMutation<
    UpdateOrganizationMutation,
    UpdateOrganizationMutationVariables
  >(Mutations.updateOrganization);
  return useCallback(
    async (input) => {
      const res = await mutation({
        variables: { input },
        refetchQueries: [{ query: Queries.me }],
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.organization;
    },
    [mutation]
  );
}

export function useUpdateOrganizationDetail(): (
  input: SetOrganizationDetailInput
) => Promise<SetOrganizationDetailMutation_organization> {
  const [mutation] = useMutation<
    SetOrganizationDetailMutation,
    SetOrganizationDetailMutationVariables
  >(Mutations.setOrganizationDetail);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data.organization;
    },
    [mutation]
  );
}

export function useCreateOrganizationTag(): (
  input: CreateOrganizationTagInput
) => Promise<OrganizationTag> {
  const [createOrganizationTag] = useMutation<
    CreateOrganizationTagMutation,
    CreateOrganizationTagMutationVariables
  >(Mutations.createOrganizationTag);
  return useCallback(
    async (input) => {
      const res = await createOrganizationTag({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data.organizationTag;
    },
    [createOrganizationTag]
  );
}

export function useCreateProjectSection(): (
  input: CreateProjectSectionInput
) => Promise<ProjectSection> {
  const [mutation] = useMutation<
    CreateProjectSectionMutation,
    CreateProjectSectionMutationVariables
  >(Mutations.createProjectSection);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data.section;
    },
    [mutation]
  );
}

export function useUpdateProjectSection(): (
  input: UpdateProjectSectionInput
) => Promise<ProjectSection> {
  const [mutation] = useMutation<
    UpdateProjectSectionMutation,
    UpdateProjectSectionMutationVariables
  >(Mutations.updateProjectSection);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data.section;
    },
    [mutation]
  );
}

export function useUpdateOrganizationMember(): (
  input: UpdateOrganizationMemberInput,
  member?: OrganizationMember
) => Promise<OrganizationMember> {
  const [mutation] = useMutation<
    UpdateOrganizationMemberMutation,
    UpdateOrganizationMemberMutationVariables
  >(Mutations.updateOrganizationMember);
  const { user } = useAuthContext();
  return useCallback(
    async (input, member) => {
      const res = await mutation({
        variables: { input },
        refetchQueries: [
          ...(input.userId === user?.id ? [{ query: Queries.me }] : []),
          {
            query: Queries.organization,
            variables: { organizationId: input.organizationId },
          },
        ],
        optimisticResponse: !!member
          ? { member: { ...member, ...(input as any) } }
          : undefined,
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.member;
    },
    [mutation, user?.id]
  );
}

export function useRemoveOrganizationMember(): (
  input: RemoveOrganizationMemberInput
) => Promise<void> {
  const [mutation] = useMutation<
    RemoveOrganizationMemberMutation,
    RemoveOrganizationMemberMutationVariables
  >(Mutations.removeOrganizationMember);
  return useCallback(
    async (input) => {
      const res = await mutation({
        variables: { input },
        refetchQueries: [{ query: Queries.me }],
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}

export function useOrganization(organizationId: string | undefined): {
  organization: OrganizationDetails | undefined;
  refetch(): Promise<unknown>;
} {
  const { data, refetch } = useQuery<
    GetOrganizationQuery,
    GetOrganizationQueryVariables
  >(Queries.organization, {
    variables: { organizationId: organizationId! },
    skip: !organizationId,
  });
  return { organization: data?.organization ?? undefined, refetch };
}

export function useOrganizationUsers(
  organizationId: string
): UserWithRoles[] | undefined {
  const { data } = useQuery<
    GetOrganizationUsersQuery,
    GetOrganizationUsersQueryVariables
  >(Queries.organizationUsers, {
    variables: { organizationId },
    skip: !organizationId,
  });
  return data?.organization?.users;
}

export function useAllOrganizationTags(
  organizationId: string
): OrganizationTag[] {
  const { data } = useQuery<
    GetOrganizationTagsQuery,
    GetOrganizationTagsQueryVariables
  >(Queries.organizationTags, { variables: { organizationId } });
  return useMemo(
    () => data?.organization.allTags ?? [],
    [data?.organization.allTags]
  );
}

export function useOrganizationTasks(
  organizationId: string,
  fetchPolicy: WatchQueryFetchPolicy
): GetOrganizationTasksQuery["organization"] | undefined {
  const { data, refetch } = useQuery<
    GetOrganizationTasksQuery,
    GetOrganizationTasksQueryVariables
  >(Queries.organizationTasks, { variables: { organizationId } });
  useEffect(() => {
    if (fetchPolicy === "cache-and-network" && !!data) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useListenToTasks();
  return data?.organization ?? undefined;
}

export function useOrganizationTaskTags(
  organizationId: string | undefined
): TaskTag[] {
  const { data } = useQuery<
    GetOrganizationTaskTagsQuery,
    GetOrganizationTaskTagsQueryVariables
  >(Queries.organizationTaskTags, {
    variables: { organizationId: organizationId! },
    skip: !organizationId,
  });
  return useMemo(
    () => data?.organization.projects.map((p) => p.taskTags).flat() ?? [],
    [data?.organization]
  );
}

export function useOrganizationGithubRepos(
  organizationId: string | undefined,
  skip: boolean = false
): GithubRepo[] | undefined {
  const { data } = useQuery<
    GetOrganizationGithubReposQuery,
    GetOrganizationGithubReposQueryVariables
  >(Queries.organizationGithubRepos, {
    variables: { organizationId: organizationId! },
    skip: skip && !!organizationId,
  });
  return data?.repos ?? undefined;
}

export function useOrganizationDiscordChannels(
  variables: GetOrganizationDiscordChannelsQueryVariables,
  skip: boolean = false
): {
  value: DiscordIntegrationChannel[] | undefined;
  refetch: () => Promise<void>;
} {
  const { data, refetch } = useQuery<
    GetOrganizationDiscordChannelsQuery,
    GetOrganizationDiscordChannelsQueryVariables
  >(Queries.organizationDiscordChannels, { variables, skip });
  return {
    value: data?.channels ?? undefined,
    refetch: useCallback(async () => {
      await refetch();
    }, [refetch]),
  };
}

export function useOrganizationCoreTeam(
  organizationId: string | undefined
): User[] {
  const { organization } = useOrganization(organizationId);
  return useMemo(
    () =>
      organization?.members
        .filter((m) =>
          [OrganizationRole.ADMIN, OrganizationRole.OWNER].includes(m.role)
        )
        .map((m) => m.user) ?? [],
    [organization?.members]
  );
}

export function useOrganizationContributors(
  organizationId: string | undefined
): User[] {
  const { organization } = useOrganization(organizationId);
  const coreTeam = useOrganizationCoreTeam(organizationId);
  return useMemo(
    () =>
      _(organization?.projects)
        .map((p) => p.members)
        .flatten()
        .map((m) => m.user)
        .concat(coreTeam)
        .uniqBy((u) => u.id)
        .value(),
    [organization, coreTeam]
  );
}

export function useIsProjectPrivate(project: Project | undefined): boolean {
  const ability = useDefaultAbility(project?.organizationId);
  return useMemo(
    () => !!project && !ability.can("read", project),
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
