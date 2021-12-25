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

export const paymentNetwork = gql`
  fragment PaymentNetwork on PaymentNetwork {
    id
    url
    slug
    name
    sortKey
  }
`;

export const paymentToken = gql`
  fragment PaymentToken on PaymentToken {
    id
    exp
    type
    name
    address
    networkId
  }
`;

export const paymentMethod = gql`
  fragment PaymentMethod on PaymentMethod {
    id
    type
    address
    networks {
      ...PaymentNetwork
    }
    tokens {
      ...PaymentToken
    }
  }

  ${paymentNetwork}
  ${paymentToken}
`;

export const payment = gql`
  fragment Payment on Payment {
    id
    status
    data
    paymentMethod {
      ...PaymentMethod
    }
    network {
      ...PaymentNetwork
    }
  }

  ${paymentMethod}
  ${paymentNetwork}
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
    deletedAt
    organizationId
    taskCount
    doneTaskCount: taskCount(status: DONE)
    openBountyTaskCount: taskCount(status: TODO, rewardNotNull: true)
    paymentMethods {
      ...PaymentMethod
    }
    integrations {
      ...ProjectIntegration
    }
  }

  ${paymentMethod}
  ${projectIntegration}
`;

export const taskTag = gql`
  fragment TaskTag on TaskTag {
    id
    label
    color
    createdAt
  }
`;

export const taskReward = gql`
  fragment TaskReward on TaskReward {
    id
    amount
    trigger
    token {
      ...PaymentToken
    }
    payment {
      ...Payment
    }
  }

  ${payment}
  ${paymentToken}
`;

export const githubPullRequest = gql`
  fragment GithubPullRequest on GithubPullRequest {
    id
    title
    link
    status
    number
    branchName
    createdAt
    updatedAt
  }
`;

export const githubBranch = gql`
  fragment GithubBranch on GithubBranch {
    id
    name
    link
    repository
    createdAt
    updatedAt
    deletedAt
  }
`;

export const discordChannel = gql`
  fragment DiscordChannel on DiscordChannel {
    id
    link
    name
  }
`;

export const taskApplication = gql`
  fragment TaskApplication on TaskApplication {
    id
    message
    startDate
    endDate
    user {
      ...User
    }
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
    reward {
      ...TaskReward
    }
    applications {
      ...TaskApplication
    }
  }

  ${taskTag}
  ${taskReward}
  ${user}
  ${taskApplication}
`;

export const taskDetails = gql`
  fragment TaskDetails on Task {
    ...Task
    gitBranchName
    createdAt
    owner {
      ...User
    }
    creator {
      ...User
    }
    discordChannel {
      ...DiscordChannel
    }
    githubPullRequests {
      ...GithubPullRequest
    }
    githubBranches {
      ...GithubBranch
    }
    applications {
      ...TaskApplication
    }
  }

  ${task}
  ${user}
  ${githubPullRequest}
  ${githubBranch}
  ${discordChannel}
  ${taskApplication}
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
    paymentMethods {
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
