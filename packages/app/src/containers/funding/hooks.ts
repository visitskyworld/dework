import { useMutation, useQuery } from "@apollo/client";
import {
  closeFundingSession,
  createFundingSession,
  setFundingVote,
} from "@dewo/app/graphql/mutations/funding";
import { getFundingSession } from "@dewo/app/graphql/queries/funding";
import {
  CreateFundingSessionInput,
  FundingSession,
  CreateFundingSessionMutation,
  CreateFundingSessionMutationVariables,
  FundingSessionDetails,
  GetFundingSessionQuery,
  GetFundingSessionQueryVariables,
  SetFundingVoteMutation,
  SetFundingVoteMutationVariables,
  FundingVoteInput,
  CloseFundingSessionMutation,
  CloseFundingSessionMutationVariables,
} from "@dewo/app/graphql/types";
import { useCallback } from "react";

export function useFundingSession(
  sessionId: string
): FundingSessionDetails | undefined {
  const { data } = useQuery<
    GetFundingSessionQuery,
    GetFundingSessionQueryVariables
  >(getFundingSession, {
    variables: { id: sessionId },
  });
  return data?.session;
}

export function useCreateFundingSession(): (
  input: CreateFundingSessionInput
) => Promise<FundingSession> {
  const [mutation] = useMutation<
    CreateFundingSessionMutation,
    CreateFundingSessionMutationVariables
  >(createFundingSession);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data.session;
    },
    [mutation]
  );
}

export function useCloseFundingSession(): (id: string) => Promise<void> {
  const [mutation] = useMutation<
    CloseFundingSessionMutation,
    CloseFundingSessionMutationVariables
  >(closeFundingSession);
  return useCallback(
    async (id) => {
      const res = await mutation({ variables: { id } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}

export function useSetFundingVote(): (
  input: FundingVoteInput
) => Promise<void> {
  const [mutation] = useMutation<
    SetFundingVoteMutation,
    SetFundingVoteMutationVariables
  >(setFundingVote);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}
