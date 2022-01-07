import gql from "graphql-tag";

export const entityDetail = gql`
  fragment EntityDetail on EntityDetail {
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
    slug
    name
    type
    config
    sortKey
  }
`;

export const paymentToken = gql`
  fragment PaymentToken on PaymentToken {
    id
    exp
    type
    name
    symbol
    address
    networkId
    visibility
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
    permalink
  }
`;

export const organizationTag = gql`
  fragment OrganizationTag on OrganizationTag {
    id
    label
    color
    createdAt
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

export const projectMember = gql`
  fragment ProjectMember on ProjectMember {
    id
    role
    projectId
    userId
    user {
      ...User
    }
  }

  ${user}
`;

export const organizationIntegration = gql`
  fragment OrganizationIntegration on OrganizationIntegration {
    id
    type
    config
  }
`;

export const projectIntegration = gql`
  fragment ProjectIntegration on ProjectIntegration {
    id
    type
    config
  }
`;

export const project = gql`
  fragment Project on Project {
    id
    slug
    name
    description
    visibility
    deletedAt
    organizationId
    permalink
  }
`;

export const projectDetails = gql`
  fragment ProjectDetails on Project {
    ...Project
    taskCount
    options {
      showBacklogColumn
    }
    doneTaskCount: taskCount(status: DONE)
    openBountyTaskCount: taskCount(status: TODO, rewardNotNull: true)
    members {
      ...ProjectMember
    }
    paymentMethods {
      ...PaymentMethod
    }
    integrations {
      ...ProjectIntegration
    }
  }

  ${project}
  ${projectMember}
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

export const taskReview = gql`
  fragment TaskReview on TaskReview {
    id
    message
    rating
  }
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
    repo
    organization
    createdAt
    updatedAt
    deletedAt
  }
`;

export const githubRepo = gql`
  fragment GithubRepo on GithubRepo {
    id
    name
    organization
    integrationId
  }
`;

export const discordChannel = gql`
  fragment DiscordChannel on DiscordChannel {
    id
    link
    name
  }
`;

export const discordIntegrationChannel = gql`
  fragment DiscordIntegrationChannel on DiscordIntegrationChannel {
    id
    name
    integrationId
    hasAccess
  }
`;

export const taskApplication = gql`
  fragment TaskApplication on TaskApplication {
    id
    message
    startDate
    endDate
    userId
    user {
      ...User
    }
  }
`;

export const taskReaction = gql`
  fragment TaskReaction on TaskReaction {
    id
    userId
    reaction
  }
`;

export const task = gql`
  fragment Task on Task {
    id
    name
    description
    submission
    status
    sortKey
    deletedAt
    projectId
    ownerId
    number
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
    review {
      ...TaskReview
    }
    reactions {
      ...TaskReaction
    }
  }

  ${taskTag}
  ${taskReward}
  ${user}
  ${taskApplication}
  ${taskReview}
  ${taskReaction}
`;

export const taskWithOrganization = gql`
  fragment TaskWithOrganization on Task {
    ...Task
    project {
      ...Project
      organization {
        ...Organization
      }
    }
  }

  ${task}
  ${project}
  ${organization}
`;

export const taskDetails = gql`
  fragment TaskDetails on Task {
    ...Task
    gitBranchName
    createdAt
    permalink
    owner {
      ...User
    }
    creator {
      ...User
    }
    project {
      ...Project
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
  ${project}
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
      ...EntityDetail
    }
  }

  ${user}
  ${organization}
  ${entityDetail}
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
    tagline
    description
    projects {
      ...ProjectDetails
    }
    members {
      ...OrganizationMember
    }
    tags {
      ...OrganizationTag
    }
    details {
      ...EntityDetail
    }
    integrations {
      ...OrganizationIntegration
    }
  }

  ${organization}
  ${organizationMember}
  ${organizationIntegration}
  ${projectDetails}
  ${organizationTag}
  ${entityDetail}
  ${user}
`;

export const invite = gql`
  fragment Invite on Invite {
    id
    inviter {
      ...User
    }
    organizationRole
    organization {
      ...Organization
    }

    projectRole
    project {
      ...Project
    }
  }

  ${user}
  ${organization}
  ${project}
`;
