import gql from "graphql-tag";

export const project = gql`
  fragment Project on Project {
    id
    slug
    name
    description
    deletedAt
    organizationId
    permalink
    workspaceId
    sortKey
  }
`;
