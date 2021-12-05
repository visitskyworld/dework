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

export const myTasks = gql`
  query MyTasksQuery {
    me {
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

export const organization = gql`
  query GetOrganizationQuery($organizationId: UUID!) {
    organization: getOrganization(id: $organizationId) {
      ...OrganizationDetails
    }
  }

  ${Fragments.organizationDetails}
`;

export const project = gql`
  query GetProjectQuery($projectId: UUID!) {
    project: getProject(id: $projectId) {
      ...ProjectDetails
    }
  }

  ${Fragments.projectDetails}
`;

export const task = gql`
  query GetTaskQuery($taskId: UUID!) {
    task: getTask(id: $taskId) {
      ...Task
    }
  }

  ${Fragments.task}
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
