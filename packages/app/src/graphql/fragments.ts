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
    permalink
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
    identifier
    usdPrice
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
    sortKey
    user {
      ...User
    }
  }

  ${user}
`;

export const projectSection = gql`
  fragment ProjectSection on ProjectSection {
    id
    name
    sortKey
  }
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

export const projectTokenGate = gql`
  fragment ProjectTokenGate on ProjectTokenGate {
    id
    projectId
    token {
      ...PaymentToken
      network {
        ...PaymentNetwork
      }
    }
  }

  ${paymentToken}
  ${paymentNetwork}
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
      tokenGates {
        ...ProjectTokenGate
      }
    }
  }

  ${user}
  ${organization}
  ${project}
  ${projectTokenGate}
`;

export const projectDetails = gql`
  fragment ProjectDetails on Project {
    ...Project
    sortKey
    sectionId
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
    tokenGates {
      ...ProjectTokenGate
    }
    organization {
      ...Organization
    }
  }

  ${project}
  ${projectMember}
  ${paymentMethod}
  ${paymentToken}
  ${projectIntegration}
  ${projectTokenGate}
  ${organization}
`;

export const taskTag = gql`
  fragment TaskTag on TaskTag {
    id
    label
    color
    createdAt
    deletedAt
    projectId
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

export const discordIntegrationChannel = gql`
  fragment DiscordIntegrationChannel on DiscordIntegrationChannel {
    id
    name
    integrationId
    permissions
  }
`;

export const discordIntegrationRole = gql`
  fragment DiscordIntegrationRole on DiscordIntegrationRole {
    id
    name
  }
`;

export const taskApplication = gql`
  fragment TaskApplication on TaskApplication {
    id
    message
    startDate
    endDate
    createdAt
    userId
    user {
      ...User
    }
  }

  ${user}
`;

export const taskSubmission = gql`
  fragment TaskSubmission on TaskSubmission {
    id
    content
    createdAt
    taskId
    userId
    user {
      ...User
    }
    approver {
      ...User
    }
  }

  ${user}
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
    status
    sortKey
    storyPoints
    dueDate
    createdAt
    doneAt
    deletedAt
    projectId
    parentTaskId
    ownerId
    number
    subtasks {
      id
      name
      status
    }
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
    submissions {
      ...TaskSubmission
    }
    review {
      ...TaskReview
    }
    reactions {
      ...TaskReaction
    }
    options {
      allowOpenSubmission
    }
  }

  ${taskTag}
  ${taskReward}
  ${user}
  ${taskApplication}
  ${taskSubmission}
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

export const taskNft = gql`
  fragment TaskNFT on TaskNFT {
    id
    tokenId
    createdAt
    contractAddress
    explorerUrl
    payment {
      ...Payment
    }
  }

  ${payment}
`;

export const taskDetails = gql`
  fragment TaskDetails on Task {
    ...Task
    gitBranchName
    permalink
    subtasks {
      ...Task
    }
    project {
      ...Project
      organization {
        ...Organization
      }
    }
    parentTask {
      id
      name
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
    githubBranches {
      ...GithubBranch
    }
    applications {
      ...TaskApplication
    }
    nfts {
      ...TaskNFT
    }
  }

  ${task}
  ${taskNft}
  ${user}
  ${project}
  ${organization}
  ${githubPullRequest}
  ${githubBranch}
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

export const userOnboarding = gql`
  fragment UserOnboarding on UserOnboarding {
    id
    type
  }
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
    organizations {
      ...Organization
      member {
        ...OrganizationMember
      }
    }
    onboarding {
      ...UserOnboarding
    }
  }

  ${userProfile}
  ${userOnboarding}
  ${paymentMethod}
  ${organization}
  ${organizationMember}
`;

export const organizationDetails = gql`
  fragment OrganizationDetails on Organization {
    ...Organization
    tagline
    description
    projects {
      ...ProjectDetails
    }
    projectSections {
      ...ProjectSection
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
    projectTokenGates {
      ...ProjectTokenGate
    }
  }

  ${organization}
  ${organizationMember}
  ${organizationIntegration}
  ${projectDetails}
  ${projectSection}
  ${organizationTag}
  ${entityDetail}
  ${user}
  ${projectTokenGate}
`;
