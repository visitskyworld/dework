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
  OrganizationMember,
  RemoveOrganizationMemberInput,
  RemoveOrganizationMemberMutation,
  RemoveOrganizationMemberMutationVariables,
  UpdateOrganizationMemberInput,
  UpdateOrganizationMemberMutation,
  UpdateOrganizationMemberMutationVariables,
} from "@dewo/app/graphql/types";
import { useCallback } from "react";
import { useListenToTasks } from "../task/hooks";
import { GetPopularOrganizationsQuery } from "../../graphql/types";

export function useCreateOrganization(): (
  input: CreateOrganizationInput
) => Promise<Organization> {
  const [mutation] = useMutation<
    CreateOrganizationMutation,
    CreateOrganizationMutationVariables
  >(Mutations.createOrganization);
  return useCallback(
    async (input) => {
      const res = await mutation({
        variables: { input },
        refetchQueries: [{ query: Queries.me }],
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.organization;
    },
    [mutation]
  );
}

export function useUpdateOrganizationMember(): (
  input: UpdateOrganizationMemberInput
) => Promise<OrganizationMember> {
  const [mutation] = useMutation<
    UpdateOrganizationMemberMutation,
    UpdateOrganizationMemberMutationVariables
  >(Mutations.updateOrganizationMember);
  return useCallback(
    async (input) => {
      const res = await mutation({
        variables: { input },
        refetchQueries: [{ query: Queries.me }],
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.member;
    },
    [mutation]
  );
}

export function useRemoveOrganizationMember(): (
  input: RemoveOrganizationMemberInput
) => Promise<void> {
  const [mutation] = useMutation<
    RemoveOrganizationMemberMutation,
    RemoveOrganizationMemberMutationVariables
  >(Mutations.removeOrganizationMember);
  return useCallback(
    async (input) => {
      const res = await mutation({
        variables: { input },
        refetchQueries: [{ query: Queries.me }],
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
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

export function usePopularOrganizations(): OrganizationDetails[] | undefined {
  const { data } = useQuery<GetPopularOrganizationsQuery>(
    Queries.popularOrganizations
  );
  return data?.popularOrganizations ?? undefined;
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
