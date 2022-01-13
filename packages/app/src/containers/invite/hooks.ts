import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  AcceptInviteMutation,
  AcceptInviteMutationVariables,
  GetInviteQuery,
  GetInviteQueryVariables,
  Invite,
  OrganizationInviteInput,
  CreateOrganizationInviteMutation,
  CreateOrganizationInviteMutationVariables,
  ProjectInviteInput,
  CreateProjectInviteMutation,
  CreateProjectInviteMutationVariables,
} from "@dewo/app/graphql/types";
import copy from "copy-to-clipboard";
import { message } from "antd";
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
  input: OrganizationInviteInput
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
  input: ProjectInviteInput
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

export function useCopyToClipboardAndShowToast(): (textToCopy: string) => void {
  return useCallback((inviteLink: string) => {
    copy(inviteLink);
    message.success({ content: "Invite link copied" });
  }, []);
}
