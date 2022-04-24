import gql from "graphql-tag";
import { taskView } from "./fragments/task";

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

export const auditLogEvent = gql`
  fragment AuditLogEvent on AuditLogEvent {
    id
    createdAt
    user {
      ...User
    }
    sessionId
    diff
  }

  ${user}
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
    network {
      ...PaymentNetwork
    }
  }

  ${paymentNetwork}
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
    tagline
    permalink
  }
`;

export const organizationWithTokens = gql`
  fragment OrganizationWithTokens on Organization {
    id
    tokens {
      ...PaymentToken
      network {
        ...PaymentNetwork
      }
    }
  }
  ${paymentToken}
  ${paymentNetwork}
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
    sectionId
    sortKey
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
    permission
  }

  ${user}
  ${organization}
  ${project}
  ${projectTokenGate}
`;

export const projectDetails = gql`
  fragment ProjectDetails on Project {
    ...Project
    options {
      showBacklogColumn
      showCommunitySuggestions
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
    taskViews {
      ...TaskView
    }
  }

  ${project}
  ${projectTokenGate}
  ${organization}
  ${taskSection}
  ${taskView}
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
    peggedToUsd
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
    priority
    sortKey
    storyPoints
    dueDate
    createdAt
    doneAt
    deletedAt
    projectId
    parentTaskId
    sectionId
    number
    gating
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
    owners {
      ...User
    }
    reward {
      ...TaskReward
    }
    applications {
      id
      userId
    }
    submissions {
      id
      userId
      content
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
    owners {
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
    submissions {
      ...TaskSubmission
    }
    nfts {
      ...TaskNFT
    }
    reward {
      ...TaskReward
      payment {
        ...Payment
      }
    }
    auditLog {
      ...AuditLogEvent
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
  ${taskSubmission}
  ${payment}
  ${auditLogEvent}
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

export const userPrompt = gql`
  fragment UserPrompt on UserPrompt {
    id
    type
    createdAt
    completedAt
  }
`;

export const taskGatingDefault = gql`
  fragment TaskGatingDefault on TaskGatingDefault {
    id
    userId
    projectId
    type
    roles {
      id
    }
  }
`;

export const userDetails = gql`
  fragment UserDetails on User {
    ...UserProfile
    threepids {
      id
      source
      threepid
    }
    organizations {
      ...Organization
    }
    prompts {
      ...UserPrompt
    }
    taskGatingDefaults {
      ...TaskGatingDefault
    }
  }

  ${userProfile}
  ${userPrompt}
  ${organization}
  ${taskGatingDefault}
`;

export const organizationDetails = gql`
  fragment OrganizationDetails on Organization {
    ...Organization
    tagline
    description
    projects {
      ...Project
      taskCount
      doneTaskCount: taskCount(status: DONE)
      openBountyTaskCount: taskCount(status: TODO, rewardNotNull: true)
    }
    projectSections {
      ...ProjectSection
    }
    tags {
      ...OrganizationTag
    }
    details {
      ...EntityDetail
    }
    projectTokenGates {
      ...ProjectTokenGate
    }
  }

  ${organization}
  ${project}
  ${projectSection}
  ${organizationTag}
  ${entityDetail}
  ${projectTokenGate}
`;
