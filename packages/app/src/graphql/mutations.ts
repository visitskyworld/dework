import gql from "graphql-tag";
import * as Fragments from "./fragments";

export const authWithThreepid = gql`
  mutation AuthWithThreepidMutation($threepidId: UUID!) {
    authWithThreepid(threepidId: $threepidId) {
      authToken
      user {
        ...User
      }
    }
  }

  ${Fragments.user}
`;

export const createOrganization = gql`
  mutation CreateOrganizationMutation($input: CreateOrganizationInput!) {
    organization: createOrganization(input: $input) {
      ...Organization
    }
  }

  ${Fragments.organization}
`;

export const createProject = gql`
  mutation CreateProjectMutation($input: CreateProjectInput!) {
    project: createProject(input: $input) {
      ...Project
      organization {
        ...OrganizationDetails
      }
    }
  }

  ${Fragments.project}
  ${Fragments.organizationDetails}
`;
