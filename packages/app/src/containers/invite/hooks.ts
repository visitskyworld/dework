import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  AcceptInviteMutation,
  AcceptInviteMutationVariables,
  GetInviteQuery,
  GetInviteQueryVariables,
  Invite,
  CreateInviteInput,
  CreateInviteMutation,
  CreateInviteMutationVariables,
  JoinProjectWithTokenMutation,
  JoinProjectWithTokenMutationVariables,
  Project,
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
      return res.data?.invite.permalink;
    },
    [createInvite]
  );
}

export function useAcceptInvite(): (
  inviteId: string
) => Promise<AcceptInviteMutation["invite"]> {
  const [mutation] = useMutation<
    AcceptInviteMutation,
    AcceptInviteMutationVariables
  >(Mutations.acceptInvite);
  const apolloClient = useApolloClient();
  return useCallback(
    async (inviteId) => {
      const res = await mutation({ variables: { inviteId } });
      apolloClient.reFetchObservableQueries();
      if (!res.data) throw res.errors?.[0];
      return res.data!.invite;
    },
    [mutation, apolloClient]
  );
}

export function useJoinProjectWithToken(): (
  projectId: string
) => Promise<Project> {
  const [mutation] = useMutation<
    JoinProjectWithTokenMutation,
    JoinProjectWithTokenMutationVariables
  >(Mutations.joinProjectWithToken);
  const apolloClient = useApolloClient();
  return useCallback(
    async (projectId) => {
      const res = await mutation({ variables: { projectId } });
      apolloClient.reFetchObservableQueries();
      if (!res.data) throw res.errors?.[0];
      return res.data.project;
    },
    [mutation, apolloClient]
  );
}
