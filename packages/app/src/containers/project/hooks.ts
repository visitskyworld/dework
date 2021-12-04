import { useMutation, useQuery } from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  CreateProjectInput,
  CreateProjectMutation,
  CreateProjectMutationVariables,
  GetProjectQuery,
  GetProjectQueryVariables,
  Project,
  ProjectDetails,
  UpdateProjectInput,
  UpdateProjectMutation,
  UpdateProjectMutationVariables,
} from "@dewo/app/graphql/types";
import { useCallback } from "react";

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
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.project;
    },
    [mutation]
  );
}

export function useProject(projectId: string): ProjectDetails | undefined {
  const { data } = useQuery<GetProjectQuery, GetProjectQueryVariables>(
    Queries.project,
    { variables: { projectId } }
  );
  return data?.project ?? undefined;
}
