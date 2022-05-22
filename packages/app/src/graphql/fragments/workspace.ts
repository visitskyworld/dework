import gql from "graphql-tag";

export const workspace = gql`
  fragment Workspace on Workspace {
    id
    name
    sortKey
  }
`;
