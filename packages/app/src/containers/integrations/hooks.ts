import { useCallback, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import {
  CreateProjectIntegrationInput,
  CreateProjectIntegrationMutation,
  CreateProjectIntegrationMutationVariables,
  UpdateProjectIntegrationInput,
  UpdateProjectIntegrationMutation,
  UpdateProjectIntegrationMutationVariables,
  GithubRepo,
  ProjectIntegration,
  ProjectIntegrationType,
  DiscordIntegrationChannel,
  CreateTasksFromGithubIssuesMutation,
  CreateTasksFromGithubIssuesMutationVariables,
  CreateProjectsFromNotionInput,
  CreateProjectsFromNotionMutation,
  CreateProjectsFromNotionMutationVariables,
  CreateProjectsFromTrelloInput,
  CreateProjectsFromTrelloMutation,
  CreateProjectsFromTrelloMutationVariables,
  GetTrelloBoardsQuery,
  GetTrelloBoardsQueryVariables,
  GetNotionDatabasesQuery,
  GetNotionDatabasesQueryVariables,
  AddUserToDiscordGuildMutation,
  AddUserToDiscordGuildMutationVariables,
  DiscordGuildMembershipState,
  GetDiscordGuildMembershipStateQuery,
  GetDiscordGuildMembershipStateQueryVariables,
  GetDiscordGuildRolesQuery,
  GetDiscordGuildRolesQueryVariables,
  OrganizationIntegration,
  OrganizationIntegrationType,
  ProjectRole,
  DiscordIntegrationRole,
} from "@dewo/app/graphql/types";
import * as Queries from "@dewo/app/graphql/queries";
import * as Mutations from "@dewo/app/graphql/mutations";
import { Constants } from "@dewo/app/util/constants";
import { useOrganization } from "../organization/hooks";

// Copied from @dewo/api/models/ProjectIntegration
export enum DiscordProjectIntegrationFeature {
  POST_TASK_UPDATES_TO_CHANNEL = "POST_TASK_UPDATES_TO_CHANNEL",
  POST_TASK_UPDATES_TO_THREAD = "POST_TASK_UPDATES_TO_THREAD",
  POST_TASK_UPDATES_TO_THREAD_PER_TASK = "POST_TASK_UPDATES_TO_THREAD_PER_TASK",
  POST_NEW_TASKS_TO_CHANNEL = "POST_NEW_TASKS_TO_CHANNEL",
}

// Copied from @dewo/api/models/ProjectIntegration
export enum GithubProjectIntegrationFeature {
  SHOW_BRANCHES = "SHOW_BRANCHES",
  SHOW_PULL_REQUESTS = "SHOW_PULL_REQUESTS",
  CREATE_ISSUES_FROM_TASKS = "CREATE_ISSUES_FROM_TASKS",
}

export function useConnectToGithubUrl(
  organizationId: string,
  stateOverride?: unknown
): string {
  const { user } = useAuthContext();
  return useMemo(() => {
    const appUrl = typeof window !== "undefined" ? window.location.href : "";
    const state = JSON.stringify({
      appUrl,
      creatorId: user?.id,
      organizationId,
      // @ts-ignore
      ...stateOverride,
    });

    return `${Constants.GITHUB_APP_URL}?state=${encodeURIComponent(state)}`;
  }, [organizationId, stateOverride, user?.id]);
}

export function useCreateProjectIntegration(): (
  input: CreateProjectIntegrationInput
) => Promise<ProjectIntegration> {
  const [mutation] = useMutation<
    CreateProjectIntegrationMutation,
    CreateProjectIntegrationMutationVariables
  >(Mutations.createProjectIntegration);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.integration;
    },
    [mutation]
  );
}

function useCreateTasksFromGithubIssues(): (
  projectId: string
) => Promise<void> {
  const [mutation] = useMutation<
    CreateTasksFromGithubIssuesMutation,
    CreateTasksFromGithubIssuesMutationVariables
  >(Mutations.createTasksFromGithubIssues);
  return useCallback(
    async (projectId) => {
      const res = await mutation({ variables: { projectId } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}

export function useCreateGithubProjectIntegration(): (input: {
  projectId: string;
  repo: GithubRepo;
  importIssues: boolean;
  features: GithubProjectIntegrationFeature[];
}) => Promise<ProjectIntegration> {
  const createProjectIntegration = useCreateProjectIntegration();
  const createTasksFromGithubIssues = useCreateTasksFromGithubIssues();
  return useCallback(
    async (input) => {
      const integration = await createProjectIntegration({
        projectId: input.projectId,
        type: ProjectIntegrationType.GITHUB,
        organizationIntegrationId: input.repo.integrationId,
        config: {
          repo: input.repo.name,
          organization: input.repo.organization,
          features: input.features,
        },
      });

      if (input.importIssues) {
        await createTasksFromGithubIssues(input.projectId);
      }

      return integration;
    },
    [createProjectIntegration, createTasksFromGithubIssues]
  );
}

export function useCreateDiscordProjectIntegration(): (input: {
  projectId: string;
  features: DiscordProjectIntegrationFeature[];
  channel: DiscordIntegrationChannel;
  thread?: DiscordIntegrationChannel;
}) => Promise<ProjectIntegration> {
  const createProjectIntegration = useCreateProjectIntegration();
  return useCallback(
    ({ projectId, features, channel, thread }) => {
      return createProjectIntegration({
        projectId,
        type: ProjectIntegrationType.DISCORD,
        organizationIntegrationId: channel.integrationId,
        config: {
          features,
          channelId: channel.id,
          threadId: thread?.id,
          name: thread?.name ?? channel.name,
        },
      });
    },
    [createProjectIntegration]
  );
}

export function useCreateDiscordRoleGateProjectIntegration(): (input: {
  projectId: string;
  projectRole: ProjectRole;
  discordRoleIds: string[];
  organizationIntegrationId: string;
}) => Promise<ProjectIntegration> {
  const createProjectIntegration = useCreateProjectIntegration();
  return useCallback(
    ({ projectId, projectRole, discordRoleIds, organizationIntegrationId }) => {
      return createProjectIntegration({
        projectId,
        organizationIntegrationId,
        type: ProjectIntegrationType.DISCORD_ROLE_GATE,
        config: { projectRole, discordRoleIds },
      });
    },
    [createProjectIntegration]
  );
}

export function useUpdateProjectIntegration(): (
  input: UpdateProjectIntegrationInput
) => Promise<ProjectIntegration> {
  const [mutation] = useMutation<
    UpdateProjectIntegrationMutation,
    UpdateProjectIntegrationMutationVariables
  >(Mutations.updateProjectIntegration);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.integration;
    },
    [mutation]
  );
}

export function useCreateProjectsFromNotion(): (
  input: CreateProjectsFromNotionInput
) => Promise<void> {
  const [mutation] = useMutation<
    CreateProjectsFromNotionMutation,
    CreateProjectsFromNotionMutationVariables
  >(Mutations.createProjectsFromNotion);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}

export function useCreateProjectsFromTrello(): (
  input: CreateProjectsFromTrelloInput
) => Promise<void> {
  const [mutation] = useMutation<
    CreateProjectsFromTrelloMutation,
    CreateProjectsFromTrelloMutationVariables
  >(Mutations.createProjectsFromTrello);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}

export function useTrelloBoards(threepidId: string) {
  const { data } = useQuery<
    GetTrelloBoardsQuery,
    GetTrelloBoardsQueryVariables
  >(Queries.trelloBoards, { variables: { threepidId } });
  return data?.trelloBoards;
}

export function useNotionDatabases(threepidId: string) {
  const { data } = useQuery<
    GetNotionDatabasesQuery,
    GetNotionDatabasesQueryVariables
  >(Queries.notionDatabases, { variables: { threepidId } });
  return data?.notionDatabases;
}

export function useDiscordGuildMembershipState(
  organizationId: string | undefined
): DiscordGuildMembershipState | undefined {
  const { data } = useQuery<
    GetDiscordGuildMembershipStateQuery,
    GetDiscordGuildMembershipStateQueryVariables
  >(Queries.getDiscordGuildMembershipState, {
    variables: { organizationId: organizationId! },
    skip: !organizationId,
  });
  return data?.state;
}

export function useDiscordGuildRoles(
  organizationId: string | undefined
): DiscordIntegrationRole[] | undefined {
  const { data } = useQuery<
    GetDiscordGuildRolesQuery,
    GetDiscordGuildRolesQueryVariables
  >(Queries.getDiscordGuildRoles, {
    variables: { organizationId: organizationId! },
    skip: !organizationId,
  });
  return data?.roles ?? undefined;
}

export function useAddUserToDiscordGuild(
  organizationId: string | undefined
): () => Promise<void> {
  const [mutation] = useMutation<
    AddUserToDiscordGuildMutation,
    AddUserToDiscordGuildMutationVariables
  >(Mutations.addUserToDiscordGuild);
  return useCallback(async () => {
    const res = await mutation({
      variables: { organizationId: organizationId! },
      refetchQueries: [
        {
          query: Queries.getDiscordGuildMembershipState,
          variables: { organizationId: organizationId! },
        },
      ],
      awaitRefetchQueries: true,
    });
    if (!res.data) throw new Error(JSON.stringify(res.errors));
  }, [mutation, organizationId]);
}

export function useOrganizationDiscordIntegration(
  organizationId: string | undefined
): OrganizationIntegration | undefined {
  const { organization } = useOrganization(organizationId);
  return useMemo(
    () =>
      organization?.integrations.find(
        (i) => i.type === OrganizationIntegrationType.DISCORD
      ),
    [organization?.integrations]
  );
}
