import { useMutation, useQuery } from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  AcceptInviteMutation,
  AcceptInviteMutationVariables,
  GetInviteQuery,
  GetInviteQueryVariables,
  Invite,
  CreateOrganizationInviteInput,
  CreateOrganizationInviteMutation,
  CreateOrganizationInviteMutationVariables,
  CreateProjectInviteInput,
  CreateProjectInviteMutation,
  CreateProjectInviteMutationVariables,
} from "@dewo/app/graphql/types";
import { useCallback } from "react";

export function useInvite(inviteId: string | undefined): Invite | undefined {
  const { data } = useQuery<GetInviteQuery, GetInviteQueryVariables>(
    Queries.invite,
    {
      variables: { inviteId: inviteId! },
      skip: !inviteId,
    }
  );
  return data?.invite ?? undefined;
}

export function useCreateOrganizationInvite(): (
  input: CreateOrganizationInviteInput
) => Promise<string> {
  const [createInvite] = useMutation<
    CreateOrganizationInviteMutation,
    CreateOrganizationInviteMutationVariables
  >(Mutations.createOrganizationInvite);
  return useCallback(
    async (input) => {
      const res = await createInvite({
        variables: { input },
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.invite.id;
    },
    [createInvite]
  );
}

export function useCreateProjectInvite(): (
  input: CreateProjectInviteInput
) => Promise<string> {
  const [createInvite] = useMutation<
    CreateProjectInviteMutation,
    CreateProjectInviteMutationVariables
  >(Mutations.createProjectInvite);
  return useCallback(
    async (input) => {
      const res = await createInvite({
        variables: { input },
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.invite.id;
    },
    [createInvite]
  );
}

export function useAcceptInvite(): (inviteId: string) => Promise<void> {
  const [mutation] = useMutation<
    AcceptInviteMutation,
    AcceptInviteMutationVariables
  >(Mutations.acceptInvite);
  return useCallback(
    async (inviteId) => {
      await mutation({
        variables: { inviteId },
        refetchQueries: [{ query: Queries.me }],
      });
    },
    [mutation]
  );
}
