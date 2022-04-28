import gql from "graphql-tag";
import { userDetails } from "../fragments";

export const deleteThreepid = gql`
  mutation DeleteThreepidMutation($id: UUID!) {
    deleteThreepid(id: $id) {
      ...UserDetails
    }
  }

  ${userDetails}
`;
