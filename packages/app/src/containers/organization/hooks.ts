import { useMutation, useQuery, WatchQueryFetchPolicy } from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  CreateOrganizationInput,
  CreateOrganizationMutation,
  CreateOrganizationMutationVariables,
  CreateOrganizationTagInput,
  CreateOrganizationTagMutation,
  CreateOrganizationTagMutationVariables,
  DiscordIntegrationChannel,
  GetFeaturedOrganizationsQuery,
  GetFeaturedOrganizationsQueryVariables,
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
  GithubRepo,
  Organization,
  OrganizationDetails,
  OrganizationMember,
  OrganizationRole,
  OrganizationTag,
  RemoveOrganizationMemberInput,
  RemoveOrganizationMemberMutation,
  RemoveOrganizationMemberMutationVariables,
  SetOrganizationDetailInput,
  SetOrganizationDetailMutation,
  SetOrganizationDetailMutationVariables,
  SetOrganizationDetailMutation_organization,
  UpdateOrganizationInput,
  UpdateOrganizationMemberInput,
  UpdateOrganizationMemberMutation,
  UpdateOrganizationMemberMutationVariables,
  UpdateOrganizationMutation,
  UpdateOrganizationMutationVariables,
  User,
} from "@dewo/app/graphql/types";
import _ from "lodash";
import { useCallback, useMemo } from "react";
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
      return res.data?.organization;
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
      return res.data?.organizationTag;
    },
    [createOrganizationTag]
  );
}

export function useUpdateOrganizationMember(): (
  input: UpdateOrganizationMemberInput
) => Promise<OrganizationMember> {
  const [mutation] = useMutation<
    UpdateOrganizationMemberMutation,
    UpdateOrganizationMemberMutationVariables
  >(Mutations.updateOrganizationMember);
  return useCallback(
    async (input) => {
      const res = await mutation({
        variables: { input },
        refetchQueries: [
          { query: Queries.me },
          {
            query: Queries.organization,
            variables: { organizationId: input.organizationId },
          },
        ],
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.member;
    },
    [mutation]
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

export function useFeaturedOrganizations(
  limit: number
): OrganizationDetails[] | undefined {
  const { data } = useQuery<
    GetFeaturedOrganizationsQuery,
    GetFeaturedOrganizationsQueryVariables
  >(Queries.featuredOrganizations, { variables: { limit } });
  return data?.featuredOrganizations;
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
  const { data } = useQuery<
    GetOrganizationTasksQuery,
    GetOrganizationTasksQueryVariables
  >(Queries.organizationTasks, { variables: { organizationId }, fetchPolicy });
  useListenToTasks();
  return data?.organization ?? undefined;
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
