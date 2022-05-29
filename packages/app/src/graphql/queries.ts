import gql from "graphql-tag";
import * as Fragments from "./fragments";
import { network, token } from "./fragments/payment";
import { project } from "./fragments/project";
import * as TaskFragments from "./fragments/task";
import { taskTag } from "./fragments/task";
import { user } from "./fragments/user";

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

export const organizationTaskViews = gql`
  query GetOrganizationTaskViewsQuery($organizationId: UUID!) {
    organization: getOrganization(id: $organizationId) {
      ...OrganizationDetails
      projects {
        id
        taskTags {
          ...TaskTag
        }
      }
    }
  }

  ${Fragments.organizationDetails}
  ${taskTag}
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

  ${user}
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

export const organizationContributors = gql`
  query GetOrganizationContributorsQuery($organizationId: UUID!) {
    organization: getOrganization(id: $organizationId) {
      id
      users {
        ...UserWithRoles
        threepids {
          source
          address: threepid
        }
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
  ${user}
`;

export const popularOrganizations = gql`
  query GetPopularOrganizationsQuery {
    organizations: getPopularOrganizations {
      ...Organization
      userCount
    }
  }

  ${Fragments.organization}
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

  ${taskTag}
`;

export const workspaceTasks = gql`
  query GetWorkspaceTasksQuery($slug: String!, $filter: TaskFilterInput) {
    workspace: getWorkspaceBySlug(slug: $slug) {
      id
      tasks(filter: $filter) {
        ...Task
      }
    }
  }

  ${Fragments.task}
`;

export const getProject = gql`
  query GetProjectQuery($projectId: UUID!) {
    project: getProject(id: $projectId) {
      ...Project
    }
  }

  ${project}
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

  ${project}
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

export const projectTasksExport = gql`
  query GetProjectTasksExportQuery($projectId: UUID!) {
    project: getProject(id: $projectId) {
      id
      tasks {
        ...Task
        creator {
          ...User
        }
        assignees {
          ...User
          threepids {
            source
            address: threepid
          }
        }
      }
    }
  }

  ${Fragments.task}
  ${user}
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

  ${taskTag}
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
  ${taskTag}
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
  ${user}
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

export const countTasks = gql`
  query GetTaskCountQuery($filter: CountTasksInput!) {
    count: getTaskCount(filter: $filter)
  }
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
  ${user}
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
        ...PaymentToken
      }
    }
  }

  ${network}
  ${token}
`;

export const organizationGithubRepos = gql`
  query GetOrganizationGithubReposQuery($organizationId: UUID!) {
    repos: getGithubRepos(organizationId: $organizationId) {
      ...GithubRepo
    }
  }

  ${Fragments.githubRepo}
`;

export const organizationGithubRepoLabels = gql`
  query GetOrganizationGithubRepoLabelsQuery(
    $repo: String!
    $organization: String!
    $organizationId: UUID!
  ) {
    labels: getGithubLabels(
      repo: $repo
      organization: $organization
      organizationId: $organizationId
    ) {
      id
      name
    }
  }
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
