import { useMutation } from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  CreateInviteInput,
  CreateInviteMutation,
  CreateInviteMutationVariables,
  AcceptInviteMutation,
  AcceptInviteMutationVariables,
} from "@dewo/app/graphql/types";
import { useCallback } from "react";

export function useCreateInvite(): (
  input: CreateInviteInput
) => Promise<string> {
  const [createInvite] = useMutation<
    CreateInviteMutation,
    CreateInviteMutationVariables
  >(Mutations.createInvite);
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
