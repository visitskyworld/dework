import gql from "graphql-tag";
import { token } from "./payment";
import { project } from "./project";
import { user } from "./user";

export const fundingVote = gql`
  fragment FundingVote on FundingVote {
    id
    taskId
    weight
    userId
  }
`;

export const fundingSession = gql`
  fragment FundingSession on FundingSession {
    id
    startDate
    endDate
    closedAt
    amount
    permalink
    organizationId
    token {
      ...PaymentToken
    }
  }

  ${token}
`;

export const fundingSessionDetails = gql`
  fragment FundingSessionDetails on FundingSession {
    ...FundingSession
    votes {
      ...FundingVote
    }
    voters {
      ...User
    }
    projects {
      ...Project
    }
    rewards {
      id
      amount
      peggedToUsd
      token {
        ...PaymentToken
      }
      task {
        id
        parentTask {
          id
          name
          permalink
        }
      }
    }
  }

  ${fundingSession}
  ${fundingVote}
  ${user}
  ${token}
  ${project}
`;
