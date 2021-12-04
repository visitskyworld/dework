import gql from "graphql-tag";

export const user = gql`
  fragment User on User {
    id
    username
    imageUrl
  }
`;

export const paymentMethod = gql`
  fragment PaymentMethod on PaymentMethod {
    id
    type
    address
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

export const projectIntegration = gql`
  fragment ProjectIntegration on ProjectIntegration {
    id
    source
    config
  }
`;

export const project = gql`
  fragment Project on Project {
    id
    name
    paymentMethod {
      ...PaymentMethod
    }
  }

  ${paymentMethod}
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
    deletedAt
    tags {
      ...TaskTag
    }
    assignees {
      ...User
    }
    reward {
      amount
      currency
      trigger
    }
  }

  ${taskTag}
  ${user}
`;

export const userDetails = gql`
  fragment UserDetails on User {
    ...User
    organizations {
      ...Organization
    }
    threepids {
      id
      source
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
