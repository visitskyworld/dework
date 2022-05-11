import _ from "lodash";
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
  DiscordIntegrationRole,
  CreateProjectsFromGithubInput,
  CreateProjectsFromGithubMutation,
  CreateProjectsFromGithubMutationVariables,
  CreateOrganizationIntegrationInput,
  CreateOrganizationIntegrationMutation,
  CreateOrganizationIntegrationMutationVariables,
  UpdateOrganizationRolesDiscordMutation,
  UpdateOrganizationRolesDiscordMutationVariables,
} from "@dewo/app/graphql/types";
import * as Queries from "@dewo/app/graphql/queries";
import * as Mutations from "@dewo/app/graphql/mutations";
import { Constants } from "@dewo/app/util/constants";
import { isSSR } from "@dewo/app/util/isSSR";

// Copied from @dewo/api/models/ProjectIntegration
export enum DiscordProjectIntegrationFeature {
  POST_TASK_UPDATES_TO_CHANNEL = "POST_TASK_UPDATES_TO_CHANNEL",
  POST_TASK_UPDATES_TO_THREAD = "POST_TASK_UPDATES_TO_THREAD",
  POST_TASK_UPDATES_TO_THREAD_PER_TASK = "POST_TASK_UPDATES_TO_THREAD_PER_TASK",
  POST_NEW_TASKS_TO_CHANNEL = "POST_NEW_TASKS_TO_CHANNEL",
  POST_STATUS_BOARD_MESSAGE = "POST_STATUS_BOARD_MESSAGE",
}

export const DiscordPermissionToString = {
  VIEW_CHANNEL: "View Channel",
  SEND_MESSAGES: "Send Messages",
  SEND_MESSAGES_IN_THREADS: "Send Messages in Threads",
  CREATE_PUBLIC_THREADS: "Create Public Threads",
  EMBED_LINKS: "Embed Links",
};

export type DiscordPermission = keyof typeof DiscordPermissionToString;

const DiscordPermissionsForFeature: Partial<
  Record<DiscordProjectIntegrationFeature, DiscordPermission[]>
> = {
  [DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_CHANNEL]: [
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "EMBED_LINKS",
  ],
  [DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD]: [
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "SEND_MESSAGES_IN_THREADS",
    "EMBED_LINKS",
  ],
  [DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK]: [
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "SEND_MESSAGES_IN_THREADS",
    "CREATE_PUBLIC_THREADS",
    "EMBED_LINKS",
  ],
};

// Copied from @dewo/api/models/ProjectIntegration
export enum GithubProjectIntegrationFeature {
  SHOW_BRANCHES = "SHOW_BRANCHES",
  SHOW_PULL_REQUESTS = "SHOW_PULL_REQUESTS",
  CREATE_ISSUES_FROM_TASKS = "CREATE_ISSUES_FROM_TASKS",
}

export function useConnectToGithubUrl(
  organizationId: string,
  stateOverride?: object
): string {
  const fn = useConnectToGithubUrlFn();
  return useMemo(
    () => fn(organizationId, stateOverride),
    [fn, organizationId, stateOverride]
  );
}

export function useConnectToGithubUrlFn(): (
  organizationId: string,
  stateOverride?: object
) => string {
  const { user } = useAuthContext();
  return useCallback(
    (organizationId, stateOverride) => {
      const appUrl = !isSSR ? window.location.href : "";
      const state = JSON.stringify({
        appUrl,
        creatorId: user?.id,
        organizationId,
        ...stateOverride,
      });

      return `${Constants.GITHUB_APP_URL}?state=${encodeURIComponent(state)}`;
    },
    [user?.id]
  );
}

export function useUpdateOrganizationDiscordRoles(): (
  organizationId: string
) => Promise<void> {
  const [mutation] = useMutation<
    UpdateOrganizationRolesDiscordMutation,
    UpdateOrganizationRolesDiscordMutationVariables
  >(Mutations.updateOrganizationDiscordRoles);

  return useCallback(
    async (organizationId) => {
      const res = await mutation({
        variables: { organizationId },
      });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
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

export function useCreateOrganizationIntegration(): (
  input: CreateOrganizationIntegrationInput
) => Promise<OrganizationIntegration> {
  const [mutation] = useMutation<
    CreateOrganizationIntegrationMutation,
    CreateOrganizationIntegrationMutationVariables
  >(Mutations.createOrganizationIntegration);
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

export function useCreateProjectsFromGithub(): (
  input: CreateProjectsFromGithubInput
) => Promise<void> {
  const [mutation] = useMutation<
    CreateProjectsFromGithubMutation,
    CreateProjectsFromGithubMutationVariables
  >(Mutations.createProjectsFromGithub);
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
  const { user } = useAuthContext();
  const { data } = useQuery<
    GetDiscordGuildMembershipStateQuery,
    GetDiscordGuildMembershipStateQueryVariables
  >(Queries.getDiscordGuildMembershipState, {
    variables: { organizationId: organizationId! },
    skip: !organizationId || !user,
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

export function useMissingPermissions(
  channels: DiscordIntegrationChannel[] | undefined,
  discordFeature: DiscordProjectIntegrationFeature | undefined,
  discordChannelId: string | undefined
) {
  const requiredPermissions = useMemo(
    () =>
      !!discordFeature ? DiscordPermissionsForFeature[discordFeature] : [],
    [discordFeature]
  );
  const channel = useMemo(
    () => channels?.find((c) => c.id === discordChannelId),
    [channels, discordChannelId]
  );
  return useMemo(
    () =>
      _.difference(
        requiredPermissions,
        channel?.permissions ?? []
      ) as DiscordPermission[],
    [requiredPermissions, channel?.permissions]
  );
}
