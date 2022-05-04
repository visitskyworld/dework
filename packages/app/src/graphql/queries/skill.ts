import gql from "graphql-tag";
import { skill } from "../fragments/skill";

export const getSkills = gql`
  query GetSkillsQuery {
    skills: getSkills {
      ...Skill
    }
  }

  ${skill}
`;
