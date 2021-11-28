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
    # users {
    #   ...User
    # }
  }
`;

export const project = gql`
  fragment Project on Project {
    id
    name
  }
`;

export const taskTag = gql`
  fragment TaskTag on TaskTag {
    id
    label
    color
  }
`;

export const task = gql`
  fragment Task on Task {
    id
    name
    description
    status
    sortKey
    tags {
      ...TaskTag
    }
  }

  ${taskTag}
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

export const projectDetails = gql`
  fragment ProjectDetails on Project {
    ...Project
    tasks {
      ...Task
    }
    taskTags {
      ...TaskTag
    }
  }

  ${project}
  ${task}
  ${taskTag}
`;
