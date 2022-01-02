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
} from "@dewo/app/graphql/types";
import * as Mutations from "@dewo/app/graphql/mutations";
import { Constants } from "@dewo/app/util/constants";
import { useCallback, useMemo } from "react";

export function useConnectToGithubUrl(organizationId: string): string {
  const { user } = useAuthContext();
  return useMemo(() => {
    const appUrl = typeof window !== "undefined" ? window.location.href : "";
    const state = JSON.stringify({
      appUrl,
      creatorId: user?.id,
      organizationId,
    });

    return `${Constants.GITHUB_APP_URL}?state=${encodeURIComponent(state)}`;
  }, [organizationId, user?.id]);
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

export function useCreateGithubProjectIntegration(): (
  projectId: string,
  repo: GithubRepo
) => Promise<ProjectIntegration> {
  const createProjectIntegration = useCreateProjectIntegration();
  return useCallback(
    (projectId, repo) => {
      return createProjectIntegration({
        projectId,
        type: ProjectIntegrationType.GITHUB,
        organizationIntegrationId: repo.integrationId,
        config: {
          repo: repo.name,
          organization: repo.organization,
          features: [],
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
