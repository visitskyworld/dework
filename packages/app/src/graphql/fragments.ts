import gql from "graphql-tag";
import { fundingSession } from "./fragments/funding";
import { network, payment, token } from "./fragments/payment";
import { project } from "./fragments/project";
import { skill } from "./fragments/skill";
import { subtask, taskTag, taskView } from "./fragments/task";
import { user } from "./fragments/user";
import { workspace } from "./fragments/workspace";

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
    fundingSessionId
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

export const threepid = gql`
  fragment Threepid on Threepid {
    source
    threepid
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
  ${token}
  ${network}
`;

export const organizationTag = gql`
  fragment OrganizationTag on OrganizationTag {
    id
    label
    color
    createdAt
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

export const organizationWithIntegrations = gql`
  fragment OrganizationWithIntegrations on Organization {
    id
    integrations {
      ...OrganizationIntegration
    }
  }

  ${organizationIntegration}
`;

export const projectIntegration = gql`
  fragment ProjectIntegration on ProjectIntegration {
    id
    type
    config
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

  ${token}
  ${network}
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
    task {
      id
      name
      permalink
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

export const taskReward = gql`
  fragment TaskReward on TaskReward {
    id
    amount
    peggedToUsd
    fundingSessionId
    token {
      ...PaymentToken
    }
    payments {
      id
      amount
      user {
        ...User
      }
      payment {
        ...Payment
      }
    }
  }

  ${payment}
  ${token}
  ${user}
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

export const githubIssue = gql`
  fragment GithubIssue on GithubIssue {
    id
    number
    link
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
    discordThreadUrl
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
    parentTask {
      id
      name
    }
    sectionId
    number
    gating
    submissionCount
    applicationCount
    subtasks {
      ...Subtask
    }
    tags {
      ...TaskTag
    }
    skills {
      ...Skill
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
    review {
      ...TaskReview
    }
    reactions {
      ...TaskReaction
    }
  }

  ${taskTag}
  ${skill}
  ${taskReward}
  ${user}
  ${subtask}
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
    githubIssue {
      ...GithubIssue
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
      payments {
        user {
          ...User
        }
        payment {
          ...Payment
        }
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
  ${githubIssue}
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
    skills {
      ...Skill
    }
  }

  ${user}
  ${organization}
  ${entityDetail}
  ${skill}
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
    taskViews {
      ...TaskView
    }
  }

  ${userProfile}
  ${userPrompt}
  ${organization}
  ${taskGatingDefault}
  ${taskView}
`;

export const organizationDetails = gql`
  fragment OrganizationDetails on Organization {
    ...Organization
    tagline
    description
    mintTaskNFTs
    projects {
      ...Project
      taskCount
      doneTaskCount: taskCount(status: DONE)
      openBountyTaskCount: taskCount(status: TODO, rewardNotNull: true)
    }
    workspaces {
      ...Workspace
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
    taskViews {
      ...TaskView
    }
    fundingSessions {
      ...FundingSession
    }
  }

  ${organization}
  ${project}
  ${workspace}
  ${organizationTag}
  ${entityDetail}
  ${projectTokenGate}
  ${taskView}
  ${fundingSession}
`;
