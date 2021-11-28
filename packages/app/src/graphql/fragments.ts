import gql from "graphql-tag";

export const user = gql`
  fragment User on User {
    id
    username
    imageUrl
  }
`;

export const organization = gql`
  fragment Organization on Organization {
    id
    name
    imageUrl
    users {
      ...User
    }
  }

  ${user}
`;

export const project = gql`
  fragment Project on Project {
    id
    name
  }
`;

export const userDetails = gql`
  fragment UserDetails on User {
    ...User
    organizations {
      ...Organization
    }
  }

  ${user}
  ${organization}
`;

export const organizationDetails = gql`
  fragment OrganizationDetails on Organization {
    ...Organization
    projects {
      ...Project
    }
  }

  ${organization}
  ${project}
`;
