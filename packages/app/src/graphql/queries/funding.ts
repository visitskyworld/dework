import gql from "graphql-tag";
import { fundingSessionDetails } from "../fragments/funding";

export const getFundingSession = gql`
  query GetFundingSessionQuery($id: UUID!) {
    session: getFundingSession(id: $id) {
      ...FundingSessionDetails
    }
  }

  ${fundingSessionDetails}
`;
