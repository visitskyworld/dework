import { useMutation, useQuery, WatchQueryFetchPolicy } from "@apollo/client";
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
} from "@dewo/app/graphql/types";
import { useCallback } from "react";
import { useListenToTasks } from "../task/hooks";

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
  organizationId: string | undefined
): OrganizationDetails | undefined {
  const { data } = useQuery<
    GetOrganizationQuery,
    GetOrganizationQueryVariables
  >(Queries.organization, {
    variables: { organizationId: organizationId! },
    skip: !organizationId,
  });
  return data?.organization ?? undefined;
}

export function useOrganizationTasks(
  organizationId: string,
  fetchPolicy: WatchQueryFetchPolicy
): GetOrganizationTasksQuery["organization"] | undefined {
  const { data } = useQuery<
    GetOrganizationTasksQuery,
    GetOrganizationTasksQueryVariables
  >(Queries.organizationTasks, { variables: { organizationId }, fetchPolicy });
  useListenToTasks();
  return data?.organization ?? undefined;
}
