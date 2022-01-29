import { useCallback, useMemo } from "react";
import { useMutation } from "@apollo/client";
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
} from "@dewo/app/graphql/types";
import * as Mutations from "@dewo/app/graphql/mutations";
import { Constants } from "@dewo/app/util/constants";

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
