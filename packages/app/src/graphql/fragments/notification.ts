import gql from "graphql-tag";
import { organization, project } from "../fragments";

export const notification = gql`
  fragment Notification on Notification {
    id
    message
    archivedAt
    createdAt
    task {
      id
      name
      permalink
      project {
        ...Project
        organization {
          ...Organization
        }
      }
    }
  }

  ${project}
  ${organization}
`;
