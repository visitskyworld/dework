import gql from "graphql-tag";
import {
  fundingSession,
  fundingSessionDetails,
  fundingVote,
} from "../fragments/funding";

export const createFundingSession = gql`
  mutation CreateFundingSessionMutation($input: CreateFundingSessionInput!) {
    session: createFundingSession(input: $input) {
      ...FundingSession
      organization {
        id
        fundingSessions {
          ...FundingSession
        }
      }
    }
  }

  ${fundingSession}
`;

export const setFundingVote = gql`
  mutation SetFundingVoteMutation($input: FundingVoteInput!) {
    vote: setFundingVote(input: $input) {
      ...FundingVote
      session {
        ...FundingSessionDetails
      }
    }
  }

  ${fundingSessionDetails}
  ${fundingVote}
`;

export const closeFundingSession = gql`
  mutation CloseFundingSessionMutation($id: UUID!) {
    session: closeFundingSession(id: $id) {
      ...FundingSessionDetails
    }
  }

  ${fundingSessionDetails}
`;
