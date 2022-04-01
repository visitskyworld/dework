import {
  ApolloError,
  useMutation,
  useQuery,
  WatchQueryFetchPolicy,
} from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
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
  GetOrganizationBySlugQuery,
  GetOrganizationBySlugQueryVariables,
  GetOrganizationDetailsQuery,
  GetOrganizationDetailsQueryVariables,
  GetOrganizationDiscordChannelsQuery,
  GetOrganizationDiscordChannelsQueryVariables,
  GetOrganizationGithubReposQuery,
  GetOrganizationGithubReposQueryVariables,
  GetOrganizationIntegrationsQuery,
  GetOrganizationIntegrationsQueryVariables,
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
  OrganizationIntegration,
  OrganizationIntegrationType,
  OrganizationTag,
  ProjectSection,
  SetOrganizationDetailInput,
  SetOrganizationDetailMutation,
  SetOrganizationDetailMutationVariables,
  SetOrganizationDetailMutation_organization,
  TaskFilterInput,
  TaskTag,
  UpdateOrganizationInput,
  UpdateOrganizationMutation,
  UpdateOrganizationMutationVariables,
  UpdateProjectSectionInput,
  UpdateProjectSectionMutation,
  UpdateProjectSectionMutationVariables,
  UserWithRoles,
} from "@dewo/app/graphql/types";
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

export function useOrganization(
  organizationId: string | undefined
): Organization | undefined {
  const { data } = useQuery<
    GetOrganizationQuery,
    GetOrganizationQueryVariables
  >(Queries.organization, {
    variables: { organizationId: organizationId! },
    skip: !organizationId,
  });
  return data?.organization;
}

export function useOrganizationDetails(organizationId: string | undefined): {
  organization: OrganizationDetails | undefined;
  refetch(): Promise<unknown>;
} {
  const { data, refetch } = useQuery<
    GetOrganizationDetailsQuery,
    GetOrganizationDetailsQueryVariables
  >(Queries.organizationDetails, {
    variables: { organizationId: organizationId! },
    skip: !organizationId,
  });
  return { organization: data?.organization ?? undefined, refetch };
}

export function useOrganizationIntegrations(
  organizationId: string | undefined,
  type?: OrganizationIntegrationType
): OrganizationIntegration[] | undefined {
  const { data } = useQuery<
    GetOrganizationIntegrationsQuery,
    GetOrganizationIntegrationsQueryVariables
  >(Queries.organizationIntegrations, {
    variables: { organizationId: organizationId! },
    skip: !organizationId,
  });
  return useMemo(
    () =>
      data?.organization.integrations.filter((i) => !type || i.type === type),
    [data?.organization.integrations, type]
  );
}

export function useOrganizationBySlug(organizationSlug: string | undefined): {
  organization: Organization | undefined;
  refetch(): Promise<unknown>;
  error: ApolloError | undefined;
} {
  const { data, error, refetch } = useQuery<
    GetOrganizationBySlugQuery,
    GetOrganizationBySlugQueryVariables
  >(Queries.organizationBySlug, {
    variables: { organizationSlug: organizationSlug! },
    skip: !organizationSlug,
  });
  return { error, organization: data?.organization ?? undefined, refetch };
}

export function useOrganizationUsers(organizationId: string | undefined): {
  users: UserWithRoles[] | undefined;
  refetch(): Promise<unknown>;
} {
  const { data, refetch } = useQuery<
    GetOrganizationUsersQuery,
    GetOrganizationUsersQueryVariables
  >(Queries.organizationUsers, {
    variables: { organizationId: organizationId! },
    skip: !organizationId,
  });
  return { users: data?.organization?.users, refetch };
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
  filter: TaskFilterInput | undefined,
  fetchPolicy: WatchQueryFetchPolicy
): GetOrganizationTasksQuery["organization"] | undefined {
  const { data, refetch } = useQuery<
    GetOrganizationTasksQuery,
    GetOrganizationTasksQueryVariables
  >(Queries.organizationTasks, { variables: { organizationId, filter } });
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
