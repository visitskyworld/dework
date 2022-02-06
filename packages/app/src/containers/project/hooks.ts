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
  DeleteProjectTokenGateMutation,
  DeleteProjectTokenGateMutationVariables,
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
  ProjectMember,
  ProjectTokenGateInput,
  RemoveProjectMemberInput,
  RemoveProjectMemberMutation,
  RemoveProjectMemberMutationVariables,
  TaskTag,
  UpdateProjectInput,
  UpdateProjectMemberInput,
  UpdateProjectMemberMutation,
  UpdateProjectMemberMutationVariables,
  UpdateProjectMutation,
  UpdateProjectMutationVariables,
} from "@dewo/app/graphql/types";
import { useCallback, useEffect, useMemo } from "react";
import { useListenToTasks } from "../task/hooks";
import _ from "lodash";

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

export function useUpdateProjectMember(): (
  input: UpdateProjectMemberInput
) => Promise<ProjectMember> {
  const [mutation] = useMutation<
    UpdateProjectMemberMutation,
    UpdateProjectMemberMutationVariables
  >(Mutations.updateProjectMember);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.member;
    },
    [mutation]
  );
}

export function useRemoveProjectMember(): (
  input: RemoveProjectMemberInput
) => Promise<void> {
  const [mutation] = useMutation<
    RemoveProjectMemberMutation,
    RemoveProjectMemberMutationVariables
  >(Mutations.removeProjectMember);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
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
  project: ProjectDetails | undefined;
  error: ApolloError | undefined;
} {
  const { data, error } = useQuery<GetProjectQuery, GetProjectQueryVariables>(
    Queries.project,
    { variables: { projectId: projectId! }, skip: !projectId }
  );
  return { project: data?.project ?? undefined, error };
}

export function useProjectTasks(
  projectId: string,
  fetchPolicy?: WatchQueryFetchPolicy
): GetProjectTasksQuery["project"] | undefined {
  const { data, refetch } = useQuery<
    GetProjectTasksQuery,
    GetProjectTasksQueryVariables
  >(Queries.projectTasks, { variables: { projectId } });
  useEffect(() => {
    if (fetchPolicy === "cache-and-network" && !!data) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useListenToTasks();
  return data?.project ?? undefined;
}

export function useProjectTaskTags(projectId: string): TaskTag[] {
  const { data } = useQuery<
    GetProjectTaskTagsQuery,
    GetProjectTaskTagsQueryVariables
  >(Queries.projectTaskTags, { variables: { projectId } });
  return useMemo(
    () => data?.project?.taskTags ?? [],
    [data?.project?.taskTags]
  );
}

export function useProjectIntegrations(
  projectId: string
): ProjectIntegration[] | undefined {
  const { data } = useQuery<
    GetProjectIntegrationsQuery,
    GetProjectIntegrationsQueryVariables
  >(Queries.projectIntegrations, { variables: { projectId } });
  return data?.project.integrations ?? undefined;
}
