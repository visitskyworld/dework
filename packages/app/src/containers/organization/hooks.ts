import { useMutation, useQuery } from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  CreateOrganizationInput,
  CreateOrganizationMutation,
  CreateOrganizationMutationVariables,
  GetOrganizationQuery,
  GetOrganizationQueryVariables,
  GetOrganizationTasksQuery,
  GetOrganizationTasksQueryVariables,
  Organization,
  OrganizationDetails,
  Task,
} from "@dewo/app/graphql/types";
import { useCallback } from "react";

export function useCreateOrganization(): (
  input: CreateOrganizationInput
) => Promise<Organization> {
  const [createOrganization] = useMutation<
    CreateOrganizationMutation,
    CreateOrganizationMutationVariables
  >(Mutations.createOrganization);
  return useCallback(
    async (input) => {
      const res = await createOrganization({
        variables: { input },
        refetchQueries: [{ query: Queries.me }],
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.organization;
    },
    [createOrganization]
  );
}

export function useOrganization(
  organizationId: string
): OrganizationDetails | undefined {
  const { data } = useQuery<
    GetOrganizationQuery,
    GetOrganizationQueryVariables
  >(Queries.organization, { variables: { organizationId } });
  return data?.organization ?? undefined;
}

export function useOrganizationTasks(
  organizationId: string
): GetOrganizationTasksQuery["organization"] | undefined {
  const { data } = useQuery<
    GetOrganizationTasksQuery,
    GetOrganizationTasksQueryVariables
  >(Queries.organizationTasks, { variables: { organizationId } });
  return data?.organization ?? undefined;
}
