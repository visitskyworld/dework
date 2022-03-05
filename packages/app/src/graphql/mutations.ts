import gql from "graphql-tag";
import * as Fragments from "./fragments";

export const authWithThreepid = gql`
  mutation AuthWithThreepidMutation($threepidId: UUID!) {
    authWithThreepid(threepidId: $threepidId) {
      authToken
      user {
        ...UserDetails
      }
    }
  }

  ${Fragments.userDetails}
`;

export const createMetamaskThreepid = gql`
  mutation CreateMetamaskThreepid($input: CreateMetamaskThreepidInput!) {
    threepid: createMetamaskThreepid(input: $input) {
      id
    }
  }
`;

export const createHiroThreepid = gql`
  mutation CreateHiroThreepid($input: CreateHiroThreepidInput!) {
    threepid: createHiroThreepid(input: $input) {
      id
    }
  }
`;

export const updateUser = gql`
  mutation UpdateUserMutation($input: UpdateUserInput!) {
    user: updateUser(input: $input) {
      ...UserDetails
    }
  }

  ${Fragments.userDetails}
`;

export const updateUserOnboarding = gql`
  mutation UpdateUserOnboardingMutation($input: UpdateUserOnboardingInput!) {
    onboarding: updateUserOnboarding(input: $input) {
      ...UserOnboarding
      user {
        id
        onboarding {
          ...UserOnboarding
        }
      }
    }
  }

  ${Fragments.userOnboarding}
`;

export const createOrganization = gql`
  mutation CreateOrganizationMutation($input: CreateOrganizationInput!) {
    organization: createOrganization(input: $input) {
      ...Organization
    }
  }

  ${Fragments.organization}
`;

export const updateOrganization = gql`
  mutation UpdateOrganizationMutation($input: UpdateOrganizationInput!) {
    organization: updateOrganization(input: $input) {
      ...OrganizationDetails
    }
  }

  ${Fragments.organizationDetails}
`;

export const createOrganizationTag = gql`
  mutation CreateOrganizationTagMutation($input: CreateOrganizationTagInput!) {
    organizationTag: createOrganizationTag(input: $input) {
      ...OrganizationTag
      organization {
        id
        tags {
          ...OrganizationTag
        }
        allTags {
          ...OrganizationTag
        }
      }
    }
  }

  ${Fragments.organizationTag}
`;

export const updateOrganizationMember = gql`
  mutation UpdateOrganizationMemberMutation(
    $input: UpdateOrganizationMemberInput!
  ) {
    member: updateOrganizationMember(input: $input) {
      ...OrganizationMember
    }
  }

  ${Fragments.organizationMember}
`;

export const removeOrganizationMember = gql`
  mutation RemoveOrganizationMemberMutation(
    $input: RemoveOrganizationMemberInput!
  ) {
    organization: removeOrganizationMember(input: $input) {
      id
      members {
        ...OrganizationMember
      }
    }
  }

  ${Fragments.organizationMember}
`;

export const updateProjectMember = gql`
  mutation UpdateProjectMemberMutation($input: UpdateProjectMemberInput!) {
    member: updateProjectMember(input: $input) {
      ...ProjectMember
    }
  }

  ${Fragments.projectMember}
`;

export const removeProjectMember = gql`
  mutation RemoveProjectMemberMutation($input: RemoveProjectMemberInput!) {
    project: removeProjectMember(input: $input) {
      id
      members {
        ...ProjectMember
      }
    }
  }

  ${Fragments.projectMember}
`;

export const createProject = gql`
  mutation CreateProjectMutation($input: CreateProjectInput!) {
    project: createProject(input: $input) {
      ...ProjectDetails
      organization {
        ...OrganizationDetails
      }
    }
  }

  ${Fragments.projectDetails}
  ${Fragments.organizationDetails}
`;

export const updateProject = gql`
  mutation UpdateProjectMutation($input: UpdateProjectInput!) {
    project: updateProject(input: $input) {
      ...ProjectDetails
    }
  }

  ${Fragments.projectDetails}
`;

export const createProjectSection = gql`
  mutation CreateProjectSectionMutation($input: CreateProjectSectionInput!) {
    section: createProjectSection(input: $input) {
      ...ProjectSection
      organization {
        id
        projectSections {
          ...ProjectSection
        }
      }
    }
  }

  ${Fragments.projectSection}
`;

export const updateProjectSection = gql`
  mutation UpdateProjectSectionMutation($input: UpdateProjectSectionInput!) {
    section: updateProjectSection(input: $input) {
      ...ProjectSection
      organization {
        id
        projectSections {
          ...ProjectSection
        }
      }
    }
  }

  ${Fragments.projectSection}
`;

export const createTaskSection = gql`
  mutation CreateTaskSectionMutation($input: CreateTaskSectionInput!) {
    section: createTaskSection(input: $input) {
      id
      project {
        id
        taskSections {
          ...TaskSection
        }
      }
    }
  }

  ${Fragments.taskSection}
`;

export const createTask = gql`
  mutation CreateTaskMutation($input: CreateTaskInput!) {
    task: createTask(input: $input) {
      ...Task
      parentTask {
        id
        subtasks {
          ...Task
        }
      }
    }
  }

  ${Fragments.task}
`;

export const updateTask = gql`
  mutation UpdateTaskMutation($input: UpdateTaskInput!) {
    task: updateTask(input: $input) {
      ...Task
    }
  }

  ${Fragments.task}
`;

export const createTaskApplication = gql`
  mutation CreateTaskApplicationMutation($input: CreateTaskApplicationInput!) {
    application: createTaskApplication(input: $input) {
      id
      task {
        ...Task
      }
    }
  }

  ${Fragments.task}
`;

export const deleteTaskApplication = gql`
  mutation DeleteTaskApplicationMutation($input: DeleteTaskApplicationInput!) {
    task: deleteTaskApplication(input: $input) {
      ...Task
    }
  }

  ${Fragments.task}
`;

export const createTaskSubmission = gql`
  mutation CreateTaskSubmissionMutation($input: CreateTaskSubmissionInput!) {
    createTaskSubmission(input: $input) {
      id
      task {
        ...Task
      }
    }
  }

  ${Fragments.task}
`;

export const updateTaskSubmission = gql`
  mutation UpdateTaskSubmissionMutation($input: UpdateTaskSubmissionInput!) {
    updateTaskSubmission(input: $input) {
      id
      task {
        ...Task
      }
    }
  }

  ${Fragments.task}
`;

export const deleteTask = gql`
  mutation DeleteTaskMutation($taskId: UUID!) {
    task: deleteTask(id: $taskId) {
      id
      deletedAt
    }
  }
`;

export const createTaskReaction = gql`
  mutation CreateTaskReactionMutation($input: TaskReactionInput!) {
    task: createTaskReaction(input: $input) {
      id
      reactions {
        ...TaskReaction
      }
    }
  }

  ${Fragments.taskReaction}
`;

export const deleteTaskReaction = gql`
  mutation DeleteTaskReactionMutation($input: TaskReactionInput!) {
    task: deleteTaskReaction(input: $input) {
      id
      reactions {
        ...TaskReaction
      }
    }
  }

  ${Fragments.taskReaction}
`;

export const createTaskTag = gql`
  mutation CreateTaskTagMutation($input: CreateTaskTagInput!) {
    taskTag: createTaskTag(input: $input) {
      ...TaskTag
      project {
        id
        taskTags {
          ...TaskTag
        }
      }
    }
  }

  ${Fragments.taskTag}
`;

export const updateTaskTag = gql`
  mutation UpdateTaskTagMutation($input: UpdateTaskTagInput!) {
    taskTag: updateTaskTag(input: $input) {
      ...TaskTag
      project {
        id
        taskTags {
          ...TaskTag
        }
      }
    }
  }

  ${Fragments.taskTag}
`;

export const createProjectIntegration = gql`
  mutation CreateProjectIntegrationMutation(
    $input: CreateProjectIntegrationInput!
  ) {
    integration: createProjectIntegration(input: $input) {
      ...ProjectIntegration
      project {
        id
        integrations {
          ...ProjectIntegration
        }
      }
    }
  }

  ${Fragments.projectIntegration}
`;

export const setUserDetail = gql`
  mutation SetUserDetailMutation($input: SetUserDetailInput!) {
    organization: setUserDetail(input: $input) {
      ...User
      details {
        ...EntityDetail
      }
    }
  }

  ${Fragments.user}
  ${Fragments.entityDetail}
`;

export const setOrganizationDetail = gql`
  mutation SetOrganizationDetailMutation($input: SetOrganizationDetailInput!) {
    organization: setOrganizationDetail(input: $input) {
      ...Organization
      details {
        ...EntityDetail
      }
    }
  }

  ${Fragments.organization}
  ${Fragments.entityDetail}
`;

export const createProjectTokenGate = gql`
  mutation CreateProjectTokenGateMutation($input: ProjectTokenGateInput!) {
    tokenGate: createProjectTokenGate(input: $input) {
      id
      project {
        id
        tokenGates {
          ...ProjectTokenGate
        }
      }
    }
  }

  ${Fragments.projectTokenGate}
`;

export const deleteProjectTokenGate = gql`
  mutation DeleteProjectTokenGateMutation($input: ProjectTokenGateInput!) {
    tokenGate: deleteProjectTokenGate(input: $input) {
      id
      tokenGates {
        ...ProjectTokenGate
      }
    }
  }

  ${Fragments.projectTokenGate}
`;

export const createOrganizationInvite = gql`
  mutation CreateOrganizationInviteMutation($input: OrganizationInviteInput!) {
    invite: createOrganizationInvite(input: $input) {
      id
    }
  }
`;

export const createProjectInvite = gql`
  mutation CreateProjectInviteMutation($input: ProjectInviteInput!) {
    invite: createProjectInvite(input: $input) {
      id
      project {
        id
      }
    }
  }
`;

export const acceptInvite = gql`
  mutation AcceptInviteMutation($inviteId: UUID!) {
    invite: acceptInvite(id: $inviteId) {
      id
      organization {
        id
        members {
          ...OrganizationMember
        }
      }
      project {
        id
        name
        members {
          ...ProjectMember
        }
        organization {
          id
          members {
            ...OrganizationMember
          }
        }
      }
    }
  }

  ${Fragments.organizationMember}
  ${Fragments.projectMember}
`;

export const joinProjectWithToken = gql`
  mutation JoinProjectWithTokenMutation($projectId: UUID!) {
    member: joinProjectWithToken(projectId: $projectId) {
      id
      project {
        ...Project
      }
    }
  }

  ${Fragments.project}
`;

export const joinProjectsWithDiscordRole = gql`
  mutation JoinProjectsWithDiscordRoleMutation($organizationId: UUID!) {
    members: joinProjectsWithDiscordRole(organizationId: $organizationId) {
      id
      project {
        ...Project
      }
    }
  }

  ${Fragments.project}
`;

export const createPaymentMethod = gql`
  mutation CreatePaymentMethodMutation($input: CreatePaymentMethodInput!) {
    paymentMethod: createPaymentMethod(input: $input) {
      ...PaymentMethod
      project {
        id
        paymentMethods {
          ...PaymentMethod
        }
      }
      user {
        id
        paymentMethods {
          ...PaymentMethod
        }
      }
    }
  }

  ${Fragments.paymentMethod}
`;

export const createPaymentToken = gql`
  mutation CreatePaymentTokenMutation($input: CreatePaymentTokenInput!) {
    token: createPaymentToken(input: $input) {
      ...PaymentToken
      network {
        ...PaymentNetwork
        tokens {
          ...PaymentToken
        }
      }
    }
  }

  ${Fragments.paymentToken}
  ${Fragments.paymentNetwork}
`;

export const updatePaymentMethod = gql`
  mutation UpdatePaymentMethodMutation($input: UpdatePaymentMethodInput!) {
    paymentMethod: updatePaymentMethod(input: $input) {
      ...PaymentMethod
      project {
        id
        paymentMethods {
          ...PaymentMethod
        }
      }
    }
  }

  ${Fragments.paymentMethod}
`;

export const updateProjectIntegration = gql`
  mutation UpdateProjectIntegrationMutation(
    $input: UpdateProjectIntegrationInput!
  ) {
    integration: updateProjectIntegration(input: $input) {
      ...ProjectIntegration
      project {
        id
        integrations {
          ...ProjectIntegration
        }
      }
    }
  }

  ${Fragments.projectIntegration}
`;

export const createFileUploadUrl = gql`
  mutation CreateFileUploadMutation($input: CreateFileUploadUrlInput!) {
    fileUpload: createFileUploadUrl(input: $input) {
      signedUrl
      publicUrl
    }
  }
`;

export const createTaskPayments = gql`
  mutation CreateTaskPaymentsMutation($input: CreateTaskPaymentsInput!) {
    tasks: createTaskPayments(input: $input) {
      ...TaskDetails
    }
  }

  ${Fragments.taskDetails}
`;

export const startWalletConnectSession = gql`
  mutation StartWalletConnectSessionMutation($sessionId: UUID!) {
    connectorUri: startWalletConnectSession(sessionId: $sessionId)
  }
`;

export const checkWalletConnectSession = gql`
  mutation CheckWalletConnectSessionMutation($sessionId: UUID!) {
    threepid: checkWalletConnectSession(sessionId: $sessionId) {
      id
    }
  }
`;

export const createTasksFromGithubIssues = gql`
  mutation CreateTasksFromGithubIssuesMutation($projectId: UUID!) {
    project: createTasksFromGithubIssues(projectId: $projectId) {
      id
      tasks {
        ...Task
      }
    }
  }

  ${Fragments.task}
`;

export const postFeedbackToDiscord = gql`
  mutation PostFeedbackToDiscordMutation(
    $feedbackContent: String!
    $discordUsername: String
  ) {
    messageSent: postFeedbackToDiscord(
      feedbackContent: $feedbackContent
      discordUsername: $discordUsername
    )
  }
`;

export const createTaskDiscordLink = gql`
  mutation CreateTaskDiscordLinkMutation($taskId: UUID!) {
    link: createTaskDiscordLink(taskId: $taskId)
  }
`;

export const createProjectsFromNotion = gql`
  mutation CreateProjectsFromNotionMutation(
    $input: CreateProjectsFromNotionInput!
  ) {
    organization: createProjectsFromNotion(input: $input) {
      ...OrganizationDetails
    }
  }

  ${Fragments.organizationDetails}
`;

export const createProjectsFromTrello = gql`
  mutation CreateProjectsFromTrelloMutation(
    $input: CreateProjectsFromTrelloInput!
  ) {
    organization: createProjectsFromTrello(input: $input) {
      ...OrganizationDetails
    }
  }

  ${Fragments.organizationDetails}
`;

export const createProjectsFromGithub = gql`
  mutation CreateProjectsFromGithubMutation(
    $input: CreateProjectsFromGithubInput!
  ) {
    organization: createProjectsFromGithub(input: $input) {
      ...OrganizationDetails
    }
  }

  ${Fragments.organizationDetails}
`;

export const addUserToDiscordGuild = gql`
  mutation AddUserToDiscordGuildMutation($organizationId: UUID!) {
    added: addUserToDiscordGuild(organizationId: $organizationId)
  }
`;
