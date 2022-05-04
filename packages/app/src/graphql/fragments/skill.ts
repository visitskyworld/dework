import gql from "graphql-tag";

export const skill = gql`
  fragment Skill on Skill {
    id
    name
  }
`;
