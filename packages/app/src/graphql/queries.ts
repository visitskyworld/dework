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
      paymentMethod {
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
      ...Project
    }
  }

  ${Fragments.project}
`;

export const projectTasks = gql`
  query GetProjectTasksQuery($projectId: UUID!) {
    project: getProject(id: $projectId) {
      id
      tasks {
        ...Task
      }
      taskTags {
        ...TaskTag
      }
    }
  }

  ${Fragments.task}
  ${Fragments.taskTag}
`;

export const task = gql`
  query GetTaskQuery($taskId: UUID!) {
    task: getTask(id: $taskId) {
      ...Task
      project {
        id
        taskTags {
          ...TaskTag
        }
      }
    }
  }

  ${Fragments.task}
  ${Fragments.taskTag}
`;

export const discordListGuilds = gql`
  query DiscordListGuildsQuery {
    guilds: discordListGuilds {
      id
      name
      icon
    }
  }
`;

export const discordListChannels = gql`
  query DiscordListChannelsQuery($discordGuildId: String!) {
    channels: discordListTextChannels(discordGuildId: $discordGuildId) {
      id
      name
    }
  }
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
