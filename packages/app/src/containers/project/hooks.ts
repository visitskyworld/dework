import {
  ApolloError,
  useApolloClient,
  useMutation,
  useQuery,
  WatchQueryFetchPolicy,
} from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import * as Fragments from "@dewo/app/graphql/fragments";
import {
  CreateProjectInput,
  CreateProjectMutation,
  CreateProjectMutationVariables,
  CreateProjectTokenGateMutation,
  CreateProjectTokenGateMutationVariables,
  CreateTaskSectionInput,
  CreateTaskSectionMutation,
  CreateTaskSectionMutationVariables,
  DeleteProjectTokenGateMutation,
  DeleteProjectTokenGateMutationVariables,
  GetProjectBySlugQuery,
  GetProjectBySlugQueryVariables,
  GetProjectIntegrationsQuery,
  GetProjectIntegrationsQueryVariables,
  GetProjectQuery,
  GetProjectQueryVariables,
  GetProjectTasksQuery,
  GetProjectTasksQueryVariables,
  GetProjectTaskTagsQuery,
  GetProjectTaskTagsQueryVariables,
  Project,
  ProjectDetails,
  ProjectIntegration,
  ProjectTokenGateInput,
  Task,
  TaskTag,
  UpdateProjectInput,
  UpdateProjectMutation,
  UpdateProjectMutationVariables,
  UpdateTaskSectionInput,
  UpdateTaskSectionMutation,
  UpdateTaskSectionMutationVariables,
  DeleteTaskSectionMutation,
  DeleteTaskSectionMutationVariables,
  TaskSection,
  GetProjectDetailsQuery,
  GetProjectDetailsQueryVariables,
  TaskGatingDefaultInput,
  SetTaskGatingDefault,
  SetTaskGatingDefaultVariables,
  GetProjectIdBySlugQuery,
  GetProjectIdBySlugQueryVariables,
} from "@dewo/app/graphql/types";
import { useCallback, useEffect, useMemo } from "react";
import { useListenToTasks } from "../task/hooks";
import _ from "lodash";
import { isSSR } from "@dewo/app/util/isSSR";

export function useCreateProject(): (
  input: CreateProjectInput
) => Promise<Project> {
  const [mutation] = useMutation<
    CreateProjectMutation,
    CreateProjectMutationVariables
  >(Mutations.createProject);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.project;
    },
    [mutation]
  );
}

export function useUpdateProject(): (
  input: UpdateProjectInput
) => Promise<Project> {
  const [mutation] = useMutation<
    UpdateProjectMutation,
    UpdateProjectMutationVariables
  >(Mutations.updateProject);
  const apolloClient = useApolloClient();
  return useCallback(
    async (input) => {
      const fragment = await (async () => {
        try {
          return apolloClient.readFragment<ProjectDetails>({
            id: `Project:${input.id}`,
            fragment: Fragments.projectDetails,
            fragmentName: "ProjectDetails",
          });
        } catch {
          return undefined;
        }
      })();

      const res = await mutation({
        variables: { input },
        optimisticResponse: !!fragment
          ? { project: _.merge({}, fragment, input) }
          : undefined,
      });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.project;
    },
    [mutation, apolloClient]
  );
}

export function useCreateProjectTokenGate(): (
  input: ProjectTokenGateInput
) => Promise<void> {
  const [mutation] = useMutation<
    CreateProjectTokenGateMutation,
    CreateProjectTokenGateMutationVariables
  >(Mutations.createProjectTokenGate);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}

export function useDeleteProjectTokenGate(): (
  input: ProjectTokenGateInput
) => Promise<void> {
  const [mutation] = useMutation<
    DeleteProjectTokenGateMutation,
    DeleteProjectTokenGateMutationVariables
  >(Mutations.deleteProjectTokenGate);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}

export function useProject(projectId: string | undefined): {
  project: Project | undefined;
  error: ApolloError | undefined;
} {
  const { data, error } = useQuery<GetProjectQuery, GetProjectQueryVariables>(
    Queries.project,
    { variables: { projectId: projectId! }, skip: !projectId }
  );
  return { project: data?.project ?? undefined, error };
}

export function useProjectDetails(projectId: string | undefined): {
  project: ProjectDetails | undefined;
  error: ApolloError | undefined;
} {
  const { data, error } = useQuery<
    GetProjectDetailsQuery,
    GetProjectDetailsQueryVariables
  >(Queries.projectDetails, {
    variables: { projectId: projectId! },
    skip: !projectId,
  });
  return { project: data?.project ?? undefined, error };
}

export function useProjectBySlug(projectSlug: string | undefined): {
  project: Project | undefined;
  error: ApolloError | undefined;
} {
  const { data, error } = useQuery<
    GetProjectBySlugQuery,
    GetProjectBySlugQueryVariables
  >(Queries.projectBySlug, {
    variables: { projectSlug: projectSlug! },
    skip: !projectSlug,
  });
  return { project: data?.project ?? undefined, error };
}

export function useProjectIdBySlug(
  projectSlug: string | undefined
): string | undefined {
  const { data } = useQuery<
    GetProjectIdBySlugQuery,
    GetProjectIdBySlugQueryVariables
  >(Queries.projectIdBySlug, {
    variables: { projectSlug: projectSlug! },
    skip: !projectSlug,
  });
  return data?.projectId;
}

export function useProjectIntegrations(
  projectId: string | undefined
): ProjectIntegration[] | undefined {
  const { data } = useQuery<
    GetProjectIntegrationsQuery,
    GetProjectIntegrationsQueryVariables
  >(Queries.projectIntegrations, {
    variables: { projectId: projectId! },
    skip: !projectId,
  });
  return data?.project.integrations;
}

export function useProjectTasks(
  projectId: string | undefined,
  fetchPolicy?: WatchQueryFetchPolicy
): Task[] | undefined {
  const { data, refetch } = useQuery<
    GetProjectTasksQuery,
    GetProjectTasksQueryVariables
  >(Queries.projectTasks, {
    variables: { projectId: projectId! },
    skip: !projectId || isSSR,
  });
  useEffect(() => {
    if (fetchPolicy === "cache-and-network" && !!data) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useListenToTasks();
  const tasks = data?.project.tasks ?? undefined;
  // filter out tasks that recently have been moved
  return useMemo(
    () => tasks?.filter((t) => t.projectId === projectId),
    [tasks, projectId]
  );
}

export function useProjectTaskTags(projectId: string | undefined): TaskTag[] {
  const { data } = useQuery<
    GetProjectTaskTagsQuery,
    GetProjectTaskTagsQueryVariables
  >(Queries.projectTaskTags, {
    variables: { projectId: projectId! },
    skip: !projectId,
  });
  return useMemo(
    () => data?.project?.taskTags ?? [],
    [data?.project?.taskTags]
  );
}

export function useCreateTaskSection(): (
  input: CreateTaskSectionInput
) => Promise<void> {
  const [mutation] = useMutation<
    CreateTaskSectionMutation,
    CreateTaskSectionMutationVariables
  >(Mutations.createTaskSection);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}

export function useUpdateTaskSection(): (
  input: UpdateTaskSectionInput,
  section: TaskSection
) => Promise<void> {
  const [mutation] = useMutation<
    UpdateTaskSectionMutation,
    UpdateTaskSectionMutationVariables
  >(Mutations.updateTaskSection);
  return useCallback(
    async (input, section) => {
      const res = await mutation({
        variables: { input },
        optimisticResponse: { section: { ...section, ...(input as any) } },
      });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}

export function useDeleteTaskSection(): (
  input: UpdateTaskSectionInput
) => Promise<void> {
  const [mutation] = useMutation<
    DeleteTaskSectionMutation,
    DeleteTaskSectionMutationVariables
  >(Mutations.deleteTaskSection);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}

export function useSetTaskGatingDefault(): (
  input: TaskGatingDefaultInput
) => Promise<void> {
  const [mutation] = useMutation<
    SetTaskGatingDefault,
    SetTaskGatingDefaultVariables
  >(Mutations.setTaskGatingDefault);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}
