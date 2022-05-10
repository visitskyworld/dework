import gql from "graphql-tag";
import * as Fragments from "./fragments";
import * as TaskFragments from "./fragments/task";

export const me = gql`
  query MeQuery {
    me {
      ...UserDetails
    }
  }

  ${Fragments.userDetails}
`;

export const userProfileByUsername = gql`
  query UserProfileByUsernameQuery($username: String!) {
    user: getUserByUsername(username: $username) {
      ...UserProfile
    }
  }

  ${Fragments.userProfile}
`;

export const userProfile = gql`
  query UserProfileQuery($id: UUID!) {
    user: getUser(id: $id) {
      ...UserProfile
    }
  }

  ${Fragments.userProfile}
`;

export const userRoles = gql`
  query UserRolesQuery($userId: UUID!) {
    user: getUser(id: $userId) {
      ...UserWithRoles
      userRoles {
        roleId
        hidden
      }
    }
  }

  ${Fragments.userWithRoles}
`;

export const userTasks = gql`
  query UserTasksQuery($id: UUID!) {
    user: getUser(id: $id) {
      id
      tasks {
        ...TaskWithOrganization
      }
    }
  }

  ${Fragments.taskWithOrganization}
`;

export const userTaskViews = gql`
  query UserTaskViewsQuery($id: UUID!) {
    user: getUser(id: $id) {
      id
      taskViews {
        ...TaskView
      }
    }
  }

  ${TaskFragments.taskView}
`;

export const userAddress = gql`
  query UserAddressQuery($id: UUID!) {
    user: getUser(id: $id) {
      id
      threepids {
        source
        address: threepid
      }
    }
  }
`;

export const permissions = gql`
  query PermissionsQuery($organizationId: UUID, $unauthed: Boolean) {
    permissions: getPermissions(
      organizationId: $organizationId
      unauthed: $unauthed
    )
  }
`;

export const organization = gql`
  query GetOrganizationQuery($organizationId: UUID!) {
    organization: getOrganization(id: $organizationId) {
      ...Organization
    }
  }

  ${Fragments.organization}
`;

export const organizationDetails = gql`
  query GetOrganizationDetailsQuery($organizationId: UUID!) {
    organization: getOrganization(id: $organizationId) {
      ...OrganizationDetails
    }
  }

  ${Fragments.organizationDetails}
`;

export const organizationIntegrations = gql`
  query GetOrganizationIntegrationsQuery($organizationId: UUID!) {
    organization: getOrganization(id: $organizationId) {
      id
      integrations {
        ...OrganizationIntegration
      }
    }
  }

  ${Fragments.organizationIntegration}
`;

export const organizationBySlug = gql`
  query GetOrganizationBySlugQuery($organizationSlug: String!) {
    organization: getOrganizationBySlug(slug: $organizationSlug) {
      ...Organization
    }
  }

  ${Fragments.organization}
`;

export const organizationUsers = gql`
  query GetOrganizationUsersQuery($organizationId: UUID!) {
    organization: getOrganization(id: $organizationId) {
      id
      users {
        ...User
      }
      admins {
        ...User
      }
    }
  }

  ${Fragments.user}
`;

export const organizationUsersWithRoles = gql`
  query GetOrganizationUsersWithRolesQuery($organizationId: UUID!) {
    organization: getOrganization(id: $organizationId) {
      id
      users {
        ...UserWithRoles
      }
    }
  }

  ${Fragments.userWithRoles}
`;

export const organizationRoles = gql`
  query GetOrganizationRolesQuery($organizationId: UUID!) {
    organization: getOrganization(id: $organizationId) {
      id
      roles {
        ...RoleWithRules
      }
    }
  }

  ${Fragments.roleWithRules}
`;

export const featuredOrganizations = gql`
  query GetFeaturedOrganizationsQuery($limit: Int!) {
    organizations: getFeaturedOrganizations(limit: $limit) {
      ...Organization
      description
      users {
        ...User
      }
    }
  }

  ${Fragments.organization}
  ${Fragments.user}
`;

export const popularOrganizations = gql`
  query GetPopularOrganizationsQuery {
    organizations: getPopularOrganizations {
      ...Organization
      users {
        ...User
      }
    }
  }

  ${Fragments.organization}
  ${Fragments.user}
`;

export const organizationTokens = gql`
  query GetOrganizationTokensQuery($organizationId: UUID!) {
    organization: getOrganization(id: $organizationId) {
      ...OrganizationWithTokens
    }
  }

  ${Fragments.organizationWithTokens}
`;

export const organizationsUserFollowsOnDiscord = gql`
  query GetOrganizationsUserFollowsOnDiscordQuery {
    organizations: getOrganizationsUserFollowsOnDiscord {
      ...Organization
    }
  }

  ${Fragments.organization}
`;

export const organizationTags = gql`
  query GetOrganizationTagsQuery($organizationId: UUID!) {
    organization: getOrganization(id: $organizationId) {
      id
      tags {
        ...OrganizationTag
      }
      allTags {
        ...OrganizationTag
      }
    }
  }

  ${Fragments.organizationTag}
`;

export const organizationTasks = gql`
  query GetOrganizationTasksQuery(
    $organizationId: UUID!
    $filter: TaskFilterInput
  ) {
    organization: getOrganization(id: $organizationId) {
      id
      tasks(filter: $filter) {
        ...Task
      }
    }
  }

  ${Fragments.task}
`;

export const organizationTaskTags = gql`
  query GetOrganizationTaskTagsQuery($organizationId: UUID!) {
    organization: getOrganization(id: $organizationId) {
      id
      projects {
        taskTags {
          ...TaskTag
        }
      }
    }
  }

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

export const projectDetails = gql`
  query GetProjectDetailsQuery($projectId: UUID!) {
    project: getProject(id: $projectId) {
      ...ProjectDetails
    }
  }

  ${Fragments.projectDetails}
`;

export const projectBySlug = gql`
  query GetProjectBySlugQuery($projectSlug: String!) {
    project: getProjectBySlug(slug: $projectSlug) {
      ...Project
    }
  }

  ${Fragments.project}
`;

export const projectIdBySlug = gql`
  query GetProjectIdBySlugQuery($projectSlug: String!) {
    projectId: getProjectIdBySlug(slug: $projectSlug)
  }
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

export const taskReactionUsers = gql`
  query GetTaskReactionUsersQuery($taskId: UUID!) {
    task: getTask(id: $taskId) {
      id
      reactions {
        ...TaskReaction
        user {
          ...User
        }
      }
    }
  }

  ${Fragments.taskReaction}
  ${Fragments.user}
`;

export const paginatedTasks = gql`
  query GetPaginatedTasksQuery($filter: SearchTasksInput!, $cursor: String) {
    paginated: getPaginatedTasks(filter: $filter, cursor: $cursor) {
      total
      cursor
      tasks {
        ...Task
      }
    }
  }

  ${Fragments.task}
`;

export const paginatedTasksWithOrganization = gql`
  query GetPaginatedTasksWithOrganizationQuery(
    $filter: SearchTasksInput!
    $cursor: String
  ) {
    paginated: getPaginatedTasks(filter: $filter, cursor: $cursor) {
      total
      cursor
      tasks {
        ...TaskWithOrganization
      }
    }
  }

  ${Fragments.taskWithOrganization}
`;

export const tasksToPay = gql`
  query GetTasksToPayQuery($input: GetTasksInput!) {
    tasks: getTasks(input: $input) {
      ...Task
      assignees {
        ...User
        threepids {
          source
          address: threepid
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

export const projectPaymentMethods = gql`
  query GetProjectPaymentMethodsQuery($projectId: UUID!) {
    project: getProject(id: $projectId) {
      id
      paymentMethods {
        ...PaymentMethod
      }
    }
  }

  ${Fragments.paymentMethod}
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
        ...PaymentToken
      }
    }
  }

  ${Fragments.paymentNetwork}
  ${Fragments.paymentToken}
`;

export const organizationGithubRepos = gql`
  query GetOrganizationGithubReposQuery($organizationId: UUID!) {
    repos: getGithubRepos(organizationId: $organizationId) {
      ...GithubRepo
    }
  }

  ${Fragments.githubRepo}
`;

export const organizationDiscordChannels = gql`
  query GetOrganizationDiscordChannelsQuery(
    $organizationId: UUID!
    $discordParentChannelId: String
  ) {
    channels: getDiscordIntegrationChannels(
      organizationId: $organizationId
      discordParentChannelId: $discordParentChannelId
    ) {
      ...DiscordIntegrationChannel
    }
  }

  ${Fragments.discordIntegrationChannel}
`;

export const trelloBoards = gql`
  query GetTrelloBoardsQuery($threepidId: UUID!) {
    trelloBoards: getTrelloBoards(threepidId: $threepidId) {
      id
      name
    }
  }
`;

export const notionDatabases = gql`
  query GetNotionDatabasesQuery($threepidId: UUID!) {
    notionDatabases: getNotionDatabases(threepidId: $threepidId) {
      id
      name
    }
  }
`;

export const getDiscordGuildMembershipState = gql`
  query GetDiscordGuildMembershipStateQuery($organizationId: UUID!) {
    state: getDiscordGuildMembershipState(organizationId: $organizationId)
  }
`;

export const getDiscordGuildRoles = gql`
  query GetDiscordGuildRolesQuery($organizationId: UUID!) {
    roles: getDiscordGuildRoles(organizationId: $organizationId) {
      ...DiscordIntegrationRole
    }
  }

  ${Fragments.discordIntegrationRole}
`;
