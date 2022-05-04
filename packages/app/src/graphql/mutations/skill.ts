import gql from "graphql-tag";
import { skill } from "../fragments/skill";

export const setUserSkills = gql`
  mutation SetUserSkillsMutation($skillIds: [UUID!]!) {
    setUserSkills(skillIds: $skillIds) {
      id
      skills {
        ...Skill
      }
    }
  }

  ${skill}
`;
