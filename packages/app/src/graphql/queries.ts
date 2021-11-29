import gql from "graphql-tag";
import * as Fragments from "./fragments";

export const me = gql`
  query MeQuery {
    me {
      ...UserDetails
    }
  }

  ${Fragments.userDetails}
`;

export const organization = gql`
  query GetOrganizationQuery($organizationId: UUID!) {
    organization: getOrganization(id: $organizationId) {
      ...OrganizationDetails
    }
  }

  ${Fragments.organizationDetails}
`;

export const project = gql`
  query GetProjectQuery($projectId: UUID!) {
    project: getProject(id: $projectId) {
      ...ProjectDetails
    }
  }

  ${Fragments.projectDetails}
`;

export const task = gql`
  query GetTaskQuery($taskId: UUID!) {
    task: getTask(id: $taskId) {
      ...Task
    }
  }

  ${Fragments.task}
`;
