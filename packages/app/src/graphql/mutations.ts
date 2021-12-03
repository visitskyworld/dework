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

export const createOrganization = gql`
  mutation CreateOrganizationMutation($input: CreateOrganizationInput!) {
    organization: createOrganization(input: $input) {
      ...Organization
    }
  }

  ${Fragments.organization}
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
