import { useMutation, useQuery } from "@apollo/client";
import {
  createWorkspace,
  updateWorkspace,
} from "@dewo/app/graphql/mutations/workspace";
import { workspaceTasks } from "@dewo/app/graphql/queries";
import { getWorkspaceDetails } from "@dewo/app/graphql/queries/workspace";
import {
  CreateWorkspaceInput,
  CreateWorkspaceMutation,
  CreateWorkspaceMutationVariables,
  Workspace,
  UpdateWorkspaceInput,
  UpdateWorkspaceMutation,
  UpdateWorkspaceMutationVariables,
  WorkspaceDetails,
  GetWorkspaceDetailsQuery,
  GetWorkspaceDetailsQueryVariables,
  Task,
  GetWorkspaceTasksQuery,
  GetWorkspaceTasksQueryVariables,
} from "@dewo/app/graphql/types";
import { useCallback } from "react";

export function useWorkspaceDetails(
  slug: string | undefined
): WorkspaceDetails | undefined {
  const { data } = useQuery<
    GetWorkspaceDetailsQuery,
    GetWorkspaceDetailsQueryVariables
  >(getWorkspaceDetails, {
    variables: { slug: slug! },
    skip: !slug,
  });
  return data?.workspace;
}

export function useWorkspaceTasks(
  slug: string | undefined
): Task[] | undefined {
  const { data } = useQuery<
    GetWorkspaceTasksQuery,
    GetWorkspaceTasksQueryVariables
  >(workspaceTasks, {
    variables: { slug: slug! },
    skip: !slug,
  });
  return data?.workspace.tasks;
}

export function useCreateWorkspace(): (
  input: CreateWorkspaceInput
) => Promise<Workspace> {
  const [mutation] = useMutation<
    CreateWorkspaceMutation,
    CreateWorkspaceMutationVariables
  >(createWorkspace);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data.workspace;
    },
    [mutation]
  );
}

export function useUpdateWorkspace(): (
  input: UpdateWorkspaceInput
) => Promise<Workspace> {
  const [mutation] = useMutation<
    UpdateWorkspaceMutation,
    UpdateWorkspaceMutationVariables
  >(updateWorkspace);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data.workspace;
    },
    [mutation]
  );
}
