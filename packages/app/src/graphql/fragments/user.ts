import gql from "graphql-tag";

export const user = gql`
  fragment User on User {
    id
    username
    imageUrl
    permalink
  }
`;
