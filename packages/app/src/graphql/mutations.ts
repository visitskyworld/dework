import gql from "graphql-tag";
import * as Fragments from "./fragments";

export const authWithThreepid = gql`
  mutation AuthWithThreepidMutation($threepidId: UUID!) {
    authWithThreepid(threepidId: $threepidId) {
      authToken
      user {
        ...User
      }
    }
  }

  ${Fragments.user}
`;

export const updateUser = gql`
  mutation UpdateUserMutation($input: UpdateUserInput!) {
    user: updateUser(input: $input) {
      ...UserDetails
    }
  }

  ${Fragments.userDetails}
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
      ...Organization
    }
  }

  ${Fragments.organization}
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

export const createProject = gql`
  mutation CreateProjectMutation($input: CreateProjectInput!) {
    project: createProject(input: $input) {
      ...Project
      organization {
        ...OrganizationDetails
      }
    }
  }

  ${Fragments.project}
  ${Fragments.organizationDetails}
`;

export const updateProject = gql`
  mutation UpdateProjectMutation($input: UpdateProjectInput!) {
    project: updateProject(input: $input) {
      ...Project
    }
  }

  ${Fragments.project}
`;

export const createTask = gql`
  mutation CreateTaskMutation($input: CreateTaskInput!) {
    task: createTask(input: $input) {
      ...Task
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

export const claimTask = gql`
  mutation ClaimTaskMutation(
    $taskId: UUID!
    $application: CreateTaskApplicationInput!
  ) {
    task: claimTask(id: $taskId, application: $application) {
      ...Task
    }
  }

  ${Fragments.task}
`;

export const unclaimTask = gql`
  mutation UnclaimTaskMutation($taskId: UUID!) {
    task: unclaimTask(id: $taskId) {
      ...Task
    }
  }

  ${Fragments.task}
`;

export const deleteTask = gql`
  mutation DeleteTaskMutation($taskId: UUID!) {
    task: deleteTask(id: $taskId) {
      ...Task
    }
  }

  ${Fragments.task}
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

export const createProjectIntegration = gql`
  mutation CreateProjectIntegrationMutation(
    $input: CreateProjectIntegrationInput!
  ) {
    integration: createProjectIntegration(input: $input) {
      id
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
    detail: setUserDetail(input: $input) {
      ...User
      details {
        ...UserDetail
      }
    }
  }
`;

export const createInvite = gql`
  mutation CreateInviteMutation($input: CreateInviteInput!) {
    invite: createInvite(input: $input) {
      id
    }
  }
`;

export const acceptInvite = gql`
  mutation AcceptInviteMutation($inviteId: UUID!) {
    invite: acceptInvite(id: $inviteId) {
      id
    }
  }
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

  ${Fragments.paymentMethod}
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
