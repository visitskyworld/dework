import { useMutation } from "@apollo/client";
import {
  createWorkspace,
  updateWorkspace,
} from "@dewo/app/graphql/mutations/workspace";
import {
  CreateWorkspaceInput,
  CreateWorkspaceMutation,
  CreateWorkspaceMutationVariables,
  Workspace,
  UpdateWorkspaceInput,
  UpdateWorkspaceMutation,
  UpdateWorkspaceMutationVariables,
} from "@dewo/app/graphql/types";
import { useCallback } from "react";

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
