import gql from "graphql-tag";
import * as Fragments from "./fragments";
import { network, paymentMethod, token } from "./fragments/payment";
import { project } from "./fragments/project";
import { taskTag } from "./fragments/task";
import { user } from "./fragments/user";
import { workspaceDetails } from "./fragments/workspace";

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

export const createPhantomThreepid = gql`
  mutation CreatePhantomThreepid($input: CreatePhantomThreepidInput!) {
    threepid: createPhantomThreepid(input: $input) {
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

export const updateUserPrompt = gql`
  mutation UpdateUserPromptMutation($input: UpdateUserPromptInput!) {
    prompt: updateUserPrompt(input: $input) {
      ...UserPrompt
      user {
        id
        prompts {
          ...UserPrompt
        }
      }
    }
  }

  ${Fragments.userPrompt}
`;

export const updateUserRole = gql`
  mutation UpdateUserRoleMutation($input: UpdateUserRoleInput!) {
    user: updateUserRole(input: $input) {
      id
      userRoles {
        roleId
        hidden
      }
    }
  }
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

export const deleteOrganization = gql`
  mutation DeleteOrganizationMutation($id: UUID!) {
    deleteOrganization(id: $id)
  }
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

export const createProject = gql`
  mutation CreateProjectMutation($input: CreateProjectInput!) {
    project: createProject(input: $input) {
      ...ProjectDetails
      organization {
        ...OrganizationDetails
      }
      workspace {
        ...WorkspaceDetails
      }
    }
  }

  ${Fragments.projectDetails}
  ${Fragments.organizationDetails}
  ${workspaceDetails}
`;

export const updateProject = gql`
  mutation UpdateProjectMutation($input: UpdateProjectInput!) {
    project: updateProject(input: $input) {
      ...ProjectDetails
    }
  }

  ${Fragments.projectDetails}
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

export const updateTaskSection = gql`
  mutation UpdateTaskSectionMutation($input: UpdateTaskSectionInput!) {
    section: updateTaskSection(input: $input) {
      ...TaskSection
    }
  }

  ${Fragments.taskSection}
`;

export const deleteTaskSection = gql`
  mutation DeleteTaskSectionMutation($input: UpdateTaskSectionInput!) {
    section: updateTaskSection(input: $input) {
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
      ...TaskApplication
      task {
        ...TaskDetails
      }
    }
  }

  ${Fragments.taskDetails}
  ${Fragments.taskApplication}
`;

export const deleteTaskApplication = gql`
  mutation DeleteTaskApplicationMutation($input: DeleteTaskApplicationInput!) {
    task: deleteTaskApplication(input: $input) {
      ...TaskDetails
    }
  }

  ${Fragments.taskDetails}
`;

export const createTaskSubmission = gql`
  mutation CreateTaskSubmissionMutation($input: CreateTaskSubmissionInput!) {
    createTaskSubmission(input: $input) {
      id
      task {
        ...TaskDetails
      }
    }
  }

  ${Fragments.taskDetails}
`;

export const updateTaskSubmission = gql`
  mutation UpdateTaskSubmissionMutation($input: UpdateTaskSubmissionInput!) {
    updateTaskSubmission(input: $input) {
      id
      task {
        ...TaskDetails
      }
    }
  }

  ${Fragments.taskDetails}
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

  ${taskTag}
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

  ${taskTag}
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

export const createOrganizationIntegration = gql`
  mutation CreateOrganizationIntegrationMutation(
    $input: CreateOrganizationIntegrationInput!
  ) {
    integration: createOrganizationIntegration(input: $input) {
      ...OrganizationIntegration
      organization {
        id
        integrations {
          ...OrganizationIntegration
        }
      }
    }
  }

  ${Fragments.organizationIntegration}
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

  ${user}
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

export const createInvite = gql`
  mutation CreateInviteMutation($input: CreateInviteInput!) {
    invite: createInvite(input: $input) {
      id
      permalink
    }
  }
`;

export const acceptInvite = gql`
  mutation AcceptInviteMutation($inviteId: UUID!) {
    invite: acceptInvite(id: $inviteId) {
      id
      organization {
        id
        users {
          ...User
        }
      }
      project {
        id
        name
        organization {
          id
          users {
            ...User
          }
        }
      }
    }
  }

  ${user}
`;

export const joinProjectWithToken = gql`
  mutation JoinProjectWithTokenMutation($projectId: UUID!) {
    project: joinProjectWithToken(projectId: $projectId) {
      ...Project
    }
  }

  ${project}
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
    }
  }

  ${paymentMethod}
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

  ${token}
  ${network}
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

  ${paymentMethod}
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

export const clearTaskPayments = gql`
  mutation ClearTaskPaymentsMutation($paymentId: UUID!) {
    tasks: clearTaskPayments(paymentId: $paymentId) {
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

export const updateOrganizationDiscordRoles = gql`
  mutation UpdateOrganizationRolesDiscordMutation($organizationId: UUID!) {
    organization: updateOrganizationDiscordRoles(
      organizationId: $organizationId
    ) {
      id
      roles {
        ...RoleWithRules
      }
    }
  }

  ${Fragments.roleWithRules}
`;

export const addRole = gql`
  mutation AddRoleMutation($roleId: UUID!, $userId: UUID!) {
    addRole(roleId: $roleId, userId: $userId) {
      ...UserWithRoles
    }
  }

  ${Fragments.userWithRoles}
`;

export const removeRole = gql`
  mutation RemoveRoleMutation($roleId: UUID!, $userId: UUID!) {
    removeRole(roleId: $roleId, userId: $userId) {
      ...UserWithRoles
    }
  }

  ${Fragments.userWithRoles}
`;

export const createRole = gql`
  mutation CreateRoleMutation($input: CreateRoleInput!) {
    role: createRole(input: $input) {
      ...RoleWithRules
    }
  }

  ${Fragments.roleWithRules}
`;

export const addTokenToOrganization = gql`
  mutation AddTokenToOrganizationMutation(
    $organizationId: UUID!
    $tokenId: UUID!
  ) {
    organization: addTokenToOrganization(
      organizationId: $organizationId
      tokenId: $tokenId
    ) {
      ...OrganizationWithTokens
    }
  }

  ${Fragments.organizationWithTokens}
`;

export const removeTokenFromOrganization = gql`
  mutation RemoveTokenFromOrganizationMutation(
    $organizationId: UUID!
    $tokenId: UUID!
  ) {
    organization: removeTokenFromOrganization(
      organizationId: $organizationId
      tokenId: $tokenId
    ) {
      ...OrganizationWithTokens
    }
  }

  ${Fragments.organizationWithTokens}
`;

export const createRule = gql`
  mutation CreateRuleMutation($input: CreateRuleInput!) {
    rule: createRule(input: $input) {
      ...Rule
      role {
        ...RoleWithRules
      }
    }
  }

  ${Fragments.rule}
  ${Fragments.roleWithRules}
`;

export const deleteRule = gql`
  mutation DeleteRuleMutation($id: UUID!) {
    role: deleteRule(id: $id) {
      ...RoleWithRules
    }
  }

  ${Fragments.roleWithRules}
`;

export const setTaskGatingDefault = gql`
  mutation SetTaskGatingDefault($input: TaskGatingDefaultInput!) {
    setTaskGatingDefault(input: $input) {
      id
      taskGatingDefaults {
        ...TaskGatingDefault
      }
    }
  }

  ${Fragments.taskGatingDefault}
`;
