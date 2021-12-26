import gql from "graphql-tag";
import * as Fragments from "./fragments";

export const me = gql`
  query MeQuery {
    me {
      ...UserDetails
    }
  }

  ${Fragments.userDetails}
`;

export const userProfile = gql`
  query UserProfileQuery($userId: UUID!) {
    user: getUser(id: $userId) {
      ...UserProfile
    }
  }

  ${Fragments.userProfile}
`;

export const userTasks = gql`
  query UserTasksQuery($userId: UUID!) {
    user: getUser(id: $userId) {
      id
      tasks {
        ...Task
      }
    }
  }

  ${Fragments.task}
`;

export const userPaymentMethod = gql`
  query UserPaymentMethodQuery($id: UUID!) {
    user: getUser(id: $id) {
      id
      paymentMethods {
        ...PaymentMethod
      }
    }
  }

  ${Fragments.paymentMethod}
`;

export const permissions = gql`
  query PermissionsQuery($input: GetUserPermissionsInput) {
    me {
      id
      permissions(input: $input)
    }
  }
`;

export const organization = gql`
  query GetOrganizationQuery($organizationId: UUID!) {
    organization: getOrganization(id: $organizationId) {
      ...OrganizationDetails
    }
  }

  ${Fragments.organizationDetails}
`;

export const featuredOrganizations = gql`
  query GetFeaturedOrganizationsQuery($limit: Int!) {
    featuredOrganizations: getFeaturedOrganizations(limit: $limit) {
      ...OrganizationDetails
    }
  }

  ${Fragments.organizationDetails}
`;

export const organizationTasks = gql`
  query GetOrganizationTasksQuery($organizationId: UUID!) {
    organization: getOrganization(id: $organizationId) {
      id
      tasks {
        ...Task
      }
      projects {
        taskTags {
          ...TaskTag
        }
      }
    }
  }

  ${Fragments.task}
  ${Fragments.taskTag}
`;

export const project = gql`
  query GetProjectQuery($projectId: UUID!) {
    project: getProject(id: $projectId) {
      ...ProjectDetails
    }
  }

  ${Fragments.projectDetails}
`;

export const projectTasks = gql`
  query GetProjectTasksQuery($projectId: UUID!) {
    project: getProject(id: $projectId) {
      id
      tasks {
        ...Task
      }
    }
  }

  ${Fragments.task}
`;

export const projectTaskTags = gql`
  query GetProjectTaskTagsQuery($projectId: UUID!) {
    project: getProject(id: $projectId) {
      id
      taskTags {
        ...TaskTag
      }
    }
  }

  ${Fragments.taskTag}
`;

export const task = gql`
  query GetTaskQuery($taskId: UUID!) {
    task: getTask(id: $taskId) {
      ...TaskDetails
      project {
        id
        taskTags {
          ...TaskTag
        }
      }
    }
  }

  ${Fragments.taskDetails}
  ${Fragments.taskTag}
`;

export const tasks = gql`
  query GetTasksQuery($input: GetTasksInput!) {
    tasks: getTasks(input: $input) {
      ...Task
    }
  }

  ${Fragments.task}
`;

export const tasksToPay = gql`
  query GetTasksToPayQuery($input: GetTasksInput!) {
    tasks: getTasks(input: $input) {
      ...Task

      assignees {
        ...User
        paymentMethods {
          ...PaymentMethod
        }
      }
      project {
        id
        paymentMethods {
          ...PaymentMethod
        }
      }
    }
  }

  ${Fragments.task}
  ${Fragments.user}
  ${Fragments.paymentMethod}
`;

export const projectIntegrations = gql`
  query GetProjectIntegrationsQuery($projectId: UUID!) {
    project: getProject(id: $projectId) {
      id
      integrations {
        ...ProjectIntegration
      }
    }
  }

  ${Fragments.projectIntegration}
`;

export const invite = gql`
  query GetInviteQuery($inviteId: UUID!) {
    invite: getInvite(id: $inviteId) {
      ...Invite
    }
  }

  ${Fragments.invite}
`;

export const paymentNetworks = gql`
  query GetPaymentNetworksQuery {
    networks: getPaymentNetworks {
      ...PaymentNetwork
      tokens {
        id
        name
        type
        address
      }
    }
  }

  ${Fragments.paymentNetwork}
`;
