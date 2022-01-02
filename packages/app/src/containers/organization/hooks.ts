import { useMutation, useQuery, WatchQueryFetchPolicy } from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  CreateOrganizationInput,
  CreateOrganizationMutation,
  CreateOrganizationMutationVariables,
  GetFeaturedOrganizationsQuery,
  GetFeaturedOrganizationsQueryVariables,
  GetOrganizationDiscordChannelsQuery,
  GetOrganizationDiscordChannelsQueryVariables,
  GetOrganizationGithubReposQuery,
  GetOrganizationGithubReposQueryVariables,
  GetOrganizationQuery,
  GetOrganizationQueryVariables,
  GetOrganizationTasksQuery,
  GetOrganizationTasksQueryVariables,
  GithubRepo,
  Organization,
  OrganizationDetails,
  OrganizationMember,
  RemoveOrganizationMemberInput,
  RemoveOrganizationMemberMutation,
  RemoveOrganizationMemberMutationVariables,
  UpdateOrganizationInput,
  UpdateOrganizationMemberInput,
  UpdateOrganizationMemberMutation,
  UpdateOrganizationMemberMutationVariables,
  UpdateOrganizationMutation,
  UpdateOrganizationMutationVariables,
} from "@dewo/app/graphql/types";
import { useCallback } from "react";
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

export function useOrganization(
  organizationId: string | undefined
): OrganizationDetails | undefined {
  const { data } = useQuery<
    GetOrganizationQuery,
    GetOrganizationQueryVariables
  >(Queries.organization, {
    variables: { organizationId: organizationId! },
    skip: !organizationId,
  });
  return data?.organization ?? undefined;
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
  organizationId: string,
  skip: boolean = false
): GetOrganizationDiscordChannelsQuery["channels"] | undefined {
  const { data } = useQuery<
    GetOrganizationDiscordChannelsQuery,
    GetOrganizationDiscordChannelsQueryVariables
  >(Queries.organizationDiscordChannels, {
    variables: { organizationId },
    skip,
  });
  return data?.channels ?? undefined;
}
