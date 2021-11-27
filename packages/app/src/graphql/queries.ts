import gql from "graphql-tag";
import * as Fragments from "./fragments";

export const me = gql`
  query MeQuery {
    me {
      ...User
    }
  }

  ${Fragments.user}
`;
