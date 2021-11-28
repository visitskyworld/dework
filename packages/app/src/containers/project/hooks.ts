import { useMutation } from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  CreateProjectInput,
  CreateProjectMutation,
  CreateProjectMutationVariables,
  Project,
} from "@dewo/app/graphql/types";
import { useCallback } from "react";

export function useCreateProject(): (
  input: CreateProjectInput
) => Promise<Project> {
  const [createProject] = useMutation<
    CreateProjectMutation,
    CreateProjectMutationVariables
  >(Mutations.createProject);
  return useCallback(
    async (input) => {
      const res = await createProject({
        variables: { input },
        // refetchQueries: [{ query: Queries.me }],
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.project;
    },
    [createProject]
  );
}
