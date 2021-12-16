import gql from "graphql-tag";

export const userDetail = gql`
  fragment UserDetail on UserDetail {
    id
    type
    value
  }
`;

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
    slug
  }
`;

export const organizationMember = gql`
  fragment OrganizationMember on OrganizationMember {
    id
    role
    organizationId
    userId
    user {
      ...User
    }
  }

  ${user}
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
    slug
    name
    organizationId
    taskCount
    doneTaskCount: taskCount(status: DONE)
    openBountyTaskCount: taskCount(status: TODO, rewardNotNull: true)
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

export const taskReward = gql`
  fragment TaskReward on TaskReward {
    amount
    currency
    trigger
  }
`;

export const githubPullRequest = gql`
  fragment GithubPullRequest on GithubPullRequest {
    title
    link
    status
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
    projectId
    tags {
      ...TaskTag
    }
    assignees {
      ...User
    }
    owner {
      ...User
    }
    creator {
      ...User
    }
    githubPullRequests {
      ...GithubPullRequest
    }
    reward {
      ...TaskReward
    }
  }

  ${githubPullRequest}
  ${taskTag}
  ${taskReward}
  ${user}
`;

export const userProfile = gql`
  fragment UserProfile on User {
    ...User
    bio
    organizations {
      ...Organization
    }
    details {
      ...UserDetail
    }
  }

  ${user}
  ${organization}
  ${userDetail}
`;

export const userDetails = gql`
  fragment UserDetails on User {
    ...UserProfile
    threepids {
      id
      source
    }
    paymentMethod {
      ...PaymentMethod
    }
  }

  ${userProfile}
  ${paymentMethod}
`;

export const organizationDetails = gql`
  fragment OrganizationDetails on Organization {
    ...Organization
    description
    projects {
      ...Project
    }
    members {
      ...OrganizationMember
    }
  }

  ${organization}
  ${organizationMember}
  ${project}
  ${user}
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

export const invite = gql`
  fragment Invite on Invite {
    id
    inviter {
      ...User
    }
    organization {
      ...Organization
    }
  }

  ${user}
  ${organization}
`;
