import gql from "graphql-tag";

export const entityDetail = gql`
  fragment EntityDetail on EntityDetail {
    id
    type
    value
  }
`;

export const rule = gql`
  fragment Rule on Rule {
    id
    permission
    inverted
    taskId
    projectId
  }
`;

export const role = gql`
  fragment Role on Role {
    id
    name
    color
    source
    fallback
    userId
    organizationId
  }
`;

export const roleWithRules = gql`
  fragment RoleWithRules on Role {
    ...Role
    rules {
      ...Rule
    }
  }
  ${role}
  ${rule}
`;

export const user = gql`
  fragment User on User {
    id
    username
    imageUrl
    permalink
  }
`;

export const userWithRoles = gql`
  fragment UserWithRoles on User {
    ...User
    roles {
      ...Role
    }
  }
  ${user}
  ${role}
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

export const projectSection = gql`
  fragment ProjectSection on ProjectSection {
    id
    name
    sortKey
  }
`;

export const taskSection = gql`
  fragment TaskSection on TaskSection {
    id
    name
    status
    sortKey
    projectId
  }
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
    deletedAt
    organizationId
    permalink
  }
`;

export const projectTokenGate = gql`
  fragment ProjectTokenGate on ProjectTokenGate {
    id
    role
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

export const projectDiscordRoleGate = gql`
  fragment ProjectDiscordRoleGate on ProjectIntegration {
    id
    type
    deletedAt
    projectId
  }
`;

export const invite = gql`
  fragment Invite on Invite {
    id
    permalink
    inviter {
      ...User
    }
    organization {
      ...Organization
    }
    project {
      ...Project
      tokenGates {
        ...ProjectTokenGate
      }
    }
    projectRole
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
    taskSections {
      ...TaskSection
    }
  }

  ${project}
  ${paymentMethod}
  ${paymentToken}
  ${projectIntegration}
  ${projectTokenGate}
  ${organization}
  ${taskSection}
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
    sectionId
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
    }
    onboarding {
      ...UserOnboarding
    }
  }

  ${userProfile}
  ${userOnboarding}
  ${paymentMethod}
  ${organization}
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
    users {
      ...User
    }
    tags {
      ...OrganizationTag
    }
    details {
      ...EntityDetail
    }
    integrations {
      ...OrganizationIntegration
      discordRoleGates: projectIntegrations {
        ...ProjectDiscordRoleGate
      }
    }
    projectTokenGates {
      ...ProjectTokenGate
    }
    roles {
      ...Role
    }
  }

  ${organization}
  ${organizationIntegration}
  ${projectDetails}
  ${projectSection}
  ${organizationTag}
  ${entityDetail}
  ${user}
  ${projectTokenGate}
  ${projectDiscordRoleGate}
  ${role}
  ${user}
`;
