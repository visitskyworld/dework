/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AuthWithThreepidMutation
// ====================================================

export interface AuthWithThreepidMutation_authWithThreepid_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface AuthWithThreepidMutation_authWithThreepid {
  __typename: "AuthResponse";
  authToken: string;
  user: AuthWithThreepidMutation_authWithThreepid_user;
}

export interface AuthWithThreepidMutation {
  authWithThreepid: AuthWithThreepidMutation_authWithThreepid;
}

export interface AuthWithThreepidMutationVariables {
  threepidId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUserMutation
// ====================================================

export interface UpdateUserMutation_user_organizations {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
}

export interface UpdateUserMutation_user_details {
  __typename: "UserDetail";
  id: Scalar.UUID;
  type: UserDetailType;
  value: string;
}

export interface UpdateUserMutation_user_threepids {
  __typename: "Threepid";
  id: Scalar.UUID;
  source: ThreepidSource;
}

export interface UpdateUserMutation_user_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
}

export interface UpdateUserMutation_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  bio: string | null;
  organizations: UpdateUserMutation_user_organizations[];
  details: UpdateUserMutation_user_details[];
  threepids: UpdateUserMutation_user_threepids[];
  paymentMethod: UpdateUserMutation_user_paymentMethod | null;
}

export interface UpdateUserMutation {
  user: UpdateUserMutation_user;
}

export interface UpdateUserMutationVariables {
  input: UpdateUserInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateOrganizationMutation
// ====================================================

export interface CreateOrganizationMutation_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
}

export interface CreateOrganizationMutation {
  organization: CreateOrganizationMutation_organization;
}

export interface CreateOrganizationMutationVariables {
  input: CreateOrganizationInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateOrganizationMemberMutation
// ====================================================

export interface UpdateOrganizationMemberMutation_member_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface UpdateOrganizationMemberMutation_member {
  __typename: "OrganizationMember";
  id: Scalar.UUID;
  role: OrganizationRole;
  organizationId: string;
  userId: string;
  user: UpdateOrganizationMemberMutation_member_user;
}

export interface UpdateOrganizationMemberMutation {
  member: UpdateOrganizationMemberMutation_member;
}

export interface UpdateOrganizationMemberMutationVariables {
  input: UpdateOrganizationMemberInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveOrganizationMemberMutation
// ====================================================

export interface RemoveOrganizationMemberMutation_organization_members_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface RemoveOrganizationMemberMutation_organization_members {
  __typename: "OrganizationMember";
  id: Scalar.UUID;
  role: OrganizationRole;
  organizationId: string;
  userId: string;
  user: RemoveOrganizationMemberMutation_organization_members_user;
}

export interface RemoveOrganizationMemberMutation_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  members: RemoveOrganizationMemberMutation_organization_members[];
}

export interface RemoveOrganizationMemberMutation {
  organization: RemoveOrganizationMemberMutation_organization;
}

export interface RemoveOrganizationMemberMutationVariables {
  input: RemoveOrganizationMemberInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateProjectMutation
// ====================================================

export interface CreateProjectMutation_project_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
}

export interface CreateProjectMutation_project_organization_projects_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
}

export interface CreateProjectMutation_project_organization_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  taskCount: number;
  doneTaskCount: number;
  openBountyTaskCount: number;
  paymentMethod: CreateProjectMutation_project_organization_projects_paymentMethod | null;
}

export interface CreateProjectMutation_project_organization_members_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface CreateProjectMutation_project_organization_members {
  __typename: "OrganizationMember";
  id: Scalar.UUID;
  role: OrganizationRole;
  organizationId: string;
  userId: string;
  user: CreateProjectMutation_project_organization_members_user;
}

export interface CreateProjectMutation_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  description: string | null;
  projects: CreateProjectMutation_project_organization_projects[];
  members: CreateProjectMutation_project_organization_members[];
}

export interface CreateProjectMutation_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  taskCount: number;
  doneTaskCount: number;
  openBountyTaskCount: number;
  paymentMethod: CreateProjectMutation_project_paymentMethod | null;
  organization: CreateProjectMutation_project_organization;
}

export interface CreateProjectMutation {
  project: CreateProjectMutation_project;
}

export interface CreateProjectMutationVariables {
  input: CreateProjectInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateProjectMutation
// ====================================================

export interface UpdateProjectMutation_project_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
}

export interface UpdateProjectMutation_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  taskCount: number;
  doneTaskCount: number;
  openBountyTaskCount: number;
  paymentMethod: UpdateProjectMutation_project_paymentMethod | null;
}

export interface UpdateProjectMutation {
  project: UpdateProjectMutation_project;
}

export interface UpdateProjectMutationVariables {
  input: UpdateProjectInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTaskMutation
// ====================================================

export interface CreateTaskMutation_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface CreateTaskMutation_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface CreateTaskMutation_task_owner {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface CreateTaskMutation_task_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface CreateTaskMutation_task_discordChannel {
  __typename: "DiscordChannel";
  id: Scalar.UUID;
  link: string;
  name: string;
}

export interface CreateTaskMutation_task_githubPullRequests {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatusEnum;
  number: number;
  branchName: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface CreateTaskMutation_task_githubBranches {
  __typename: "GithubBranch";
  id: Scalar.UUID;
  name: string;
  link: string;
  repository: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface CreateTaskMutation_task_reward {
  __typename: "TaskReward";
  amount: number;
  currency: string;
  trigger: TaskRewardTrigger;
}

export interface CreateTaskMutation_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatusEnum;
  sortKey: string;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  tags: CreateTaskMutation_task_tags[];
  assignees: CreateTaskMutation_task_assignees[];
  owner: CreateTaskMutation_task_owner | null;
  creator: CreateTaskMutation_task_creator | null;
  discordChannel: CreateTaskMutation_task_discordChannel | null;
  githubPullRequests: CreateTaskMutation_task_githubPullRequests[];
  githubBranches: CreateTaskMutation_task_githubBranches[];
  reward: CreateTaskMutation_task_reward | null;
}

export interface CreateTaskMutation {
  task: CreateTaskMutation_task;
}

export interface CreateTaskMutationVariables {
  input: CreateTaskInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateTaskMutation
// ====================================================

export interface UpdateTaskMutation_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface UpdateTaskMutation_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface UpdateTaskMutation_task_owner {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface UpdateTaskMutation_task_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface UpdateTaskMutation_task_discordChannel {
  __typename: "DiscordChannel";
  id: Scalar.UUID;
  link: string;
  name: string;
}

export interface UpdateTaskMutation_task_githubPullRequests {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatusEnum;
  number: number;
  branchName: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface UpdateTaskMutation_task_githubBranches {
  __typename: "GithubBranch";
  id: Scalar.UUID;
  name: string;
  link: string;
  repository: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface UpdateTaskMutation_task_reward {
  __typename: "TaskReward";
  amount: number;
  currency: string;
  trigger: TaskRewardTrigger;
}

export interface UpdateTaskMutation_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatusEnum;
  sortKey: string;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  tags: UpdateTaskMutation_task_tags[];
  assignees: UpdateTaskMutation_task_assignees[];
  owner: UpdateTaskMutation_task_owner | null;
  creator: UpdateTaskMutation_task_creator | null;
  discordChannel: UpdateTaskMutation_task_discordChannel | null;
  githubPullRequests: UpdateTaskMutation_task_githubPullRequests[];
  githubBranches: UpdateTaskMutation_task_githubBranches[];
  reward: UpdateTaskMutation_task_reward | null;
}

export interface UpdateTaskMutation {
  task: UpdateTaskMutation_task;
}

export interface UpdateTaskMutationVariables {
  input: UpdateTaskInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ClaimTaskMutation
// ====================================================

export interface ClaimTaskMutation_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface ClaimTaskMutation_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface ClaimTaskMutation_task_owner {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface ClaimTaskMutation_task_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface ClaimTaskMutation_task_discordChannel {
  __typename: "DiscordChannel";
  id: Scalar.UUID;
  link: string;
  name: string;
}

export interface ClaimTaskMutation_task_githubPullRequests {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatusEnum;
  number: number;
  branchName: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface ClaimTaskMutation_task_githubBranches {
  __typename: "GithubBranch";
  id: Scalar.UUID;
  name: string;
  link: string;
  repository: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface ClaimTaskMutation_task_reward {
  __typename: "TaskReward";
  amount: number;
  currency: string;
  trigger: TaskRewardTrigger;
}

export interface ClaimTaskMutation_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatusEnum;
  sortKey: string;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  tags: ClaimTaskMutation_task_tags[];
  assignees: ClaimTaskMutation_task_assignees[];
  owner: ClaimTaskMutation_task_owner | null;
  creator: ClaimTaskMutation_task_creator | null;
  discordChannel: ClaimTaskMutation_task_discordChannel | null;
  githubPullRequests: ClaimTaskMutation_task_githubPullRequests[];
  githubBranches: ClaimTaskMutation_task_githubBranches[];
  reward: ClaimTaskMutation_task_reward | null;
}

export interface ClaimTaskMutation {
  task: ClaimTaskMutation_task;
}

export interface ClaimTaskMutationVariables {
  taskId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UnclaimTaskMutation
// ====================================================

export interface UnclaimTaskMutation_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface UnclaimTaskMutation_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface UnclaimTaskMutation_task_owner {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface UnclaimTaskMutation_task_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface UnclaimTaskMutation_task_discordChannel {
  __typename: "DiscordChannel";
  id: Scalar.UUID;
  link: string;
  name: string;
}

export interface UnclaimTaskMutation_task_githubPullRequests {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatusEnum;
  number: number;
  branchName: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface UnclaimTaskMutation_task_githubBranches {
  __typename: "GithubBranch";
  id: Scalar.UUID;
  name: string;
  link: string;
  repository: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface UnclaimTaskMutation_task_reward {
  __typename: "TaskReward";
  amount: number;
  currency: string;
  trigger: TaskRewardTrigger;
}

export interface UnclaimTaskMutation_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatusEnum;
  sortKey: string;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  tags: UnclaimTaskMutation_task_tags[];
  assignees: UnclaimTaskMutation_task_assignees[];
  owner: UnclaimTaskMutation_task_owner | null;
  creator: UnclaimTaskMutation_task_creator | null;
  discordChannel: UnclaimTaskMutation_task_discordChannel | null;
  githubPullRequests: UnclaimTaskMutation_task_githubPullRequests[];
  githubBranches: UnclaimTaskMutation_task_githubBranches[];
  reward: UnclaimTaskMutation_task_reward | null;
}

export interface UnclaimTaskMutation {
  task: UnclaimTaskMutation_task;
}

export interface UnclaimTaskMutationVariables {
  taskId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteTaskMutation
// ====================================================

export interface DeleteTaskMutation_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface DeleteTaskMutation_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface DeleteTaskMutation_task_owner {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface DeleteTaskMutation_task_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface DeleteTaskMutation_task_discordChannel {
  __typename: "DiscordChannel";
  id: Scalar.UUID;
  link: string;
  name: string;
}

export interface DeleteTaskMutation_task_githubPullRequests {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatusEnum;
  number: number;
  branchName: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface DeleteTaskMutation_task_githubBranches {
  __typename: "GithubBranch";
  id: Scalar.UUID;
  name: string;
  link: string;
  repository: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface DeleteTaskMutation_task_reward {
  __typename: "TaskReward";
  amount: number;
  currency: string;
  trigger: TaskRewardTrigger;
}

export interface DeleteTaskMutation_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatusEnum;
  sortKey: string;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  tags: DeleteTaskMutation_task_tags[];
  assignees: DeleteTaskMutation_task_assignees[];
  owner: DeleteTaskMutation_task_owner | null;
  creator: DeleteTaskMutation_task_creator | null;
  discordChannel: DeleteTaskMutation_task_discordChannel | null;
  githubPullRequests: DeleteTaskMutation_task_githubPullRequests[];
  githubBranches: DeleteTaskMutation_task_githubBranches[];
  reward: DeleteTaskMutation_task_reward | null;
}

export interface DeleteTaskMutation {
  task: DeleteTaskMutation_task;
}

export interface DeleteTaskMutationVariables {
  taskId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTaskTagMutation
// ====================================================

export interface CreateTaskTagMutation_taskTag_project_taskTags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface CreateTaskTagMutation_taskTag_project {
  __typename: "Project";
  id: Scalar.UUID;
  taskTags: CreateTaskTagMutation_taskTag_project_taskTags[];
}

export interface CreateTaskTagMutation_taskTag {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  project: CreateTaskTagMutation_taskTag_project;
}

export interface CreateTaskTagMutation {
  taskTag: CreateTaskTagMutation_taskTag;
}

export interface CreateTaskTagMutationVariables {
  input: CreateTaskTagInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateProjectIntegrationMutation
// ====================================================

export interface CreateProjectIntegrationMutation_integration_project_integrations {
  __typename: "ProjectIntegration";
  id: Scalar.UUID;
  source: string;
  config: Scalar.JSONObject;
}

export interface CreateProjectIntegrationMutation_integration_project {
  __typename: "Project";
  id: Scalar.UUID;
  integrations: CreateProjectIntegrationMutation_integration_project_integrations[];
}

export interface CreateProjectIntegrationMutation_integration {
  __typename: "ProjectIntegration";
  id: Scalar.UUID;
  project: CreateProjectIntegrationMutation_integration_project;
}

export interface CreateProjectIntegrationMutation {
  integration: CreateProjectIntegrationMutation_integration;
}

export interface CreateProjectIntegrationMutationVariables {
  input: CreateProjectIntegrationInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetUserDetailMutation
// ====================================================

export interface SetUserDetailMutation_detail_details {
  __typename: "UserDetail";
  id: Scalar.UUID;
  type: UserDetailType;
  value: string;
}

export interface SetUserDetailMutation_detail {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  details: SetUserDetailMutation_detail_details[];
}

export interface SetUserDetailMutation {
  detail: SetUserDetailMutation_detail;
}

export interface SetUserDetailMutationVariables {
  input: SetUserDetailInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateInviteMutation
// ====================================================

export interface CreateInviteMutation_invite {
  __typename: "Invite";
  id: Scalar.UUID;
}

export interface CreateInviteMutation {
  invite: CreateInviteMutation_invite;
}

export interface CreateInviteMutationVariables {
  input: CreateInviteInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AcceptInviteMutation
// ====================================================

export interface AcceptInviteMutation_invite {
  __typename: "Invite";
  id: Scalar.UUID;
}

export interface AcceptInviteMutation {
  invite: AcceptInviteMutation_invite;
}

export interface AcceptInviteMutationVariables {
  inviteId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreatePaymentMethodMutation
// ====================================================

export interface CreatePaymentMethodMutation_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
}

export interface CreatePaymentMethodMutation {
  paymentMethod: CreatePaymentMethodMutation_paymentMethod;
}

export interface CreatePaymentMethodMutationVariables {
  input: CreatePaymentMethodInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateFileUploadMutation
// ====================================================

export interface CreateFileUploadMutation_fileUpload {
  __typename: "CreateFileUploadResponse";
  signedUrl: string;
  publicUrl: string;
}

export interface CreateFileUploadMutation {
  fileUpload: CreateFileUploadMutation_fileUpload;
}

export interface CreateFileUploadMutationVariables {
  input: CreateFileUploadUrlInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MeQuery
// ====================================================

export interface MeQuery_me_organizations {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
}

export interface MeQuery_me_details {
  __typename: "UserDetail";
  id: Scalar.UUID;
  type: UserDetailType;
  value: string;
}

export interface MeQuery_me_threepids {
  __typename: "Threepid";
  id: Scalar.UUID;
  source: ThreepidSource;
}

export interface MeQuery_me_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
}

export interface MeQuery_me {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  bio: string | null;
  organizations: MeQuery_me_organizations[];
  details: MeQuery_me_details[];
  threepids: MeQuery_me_threepids[];
  paymentMethod: MeQuery_me_paymentMethod | null;
}

export interface MeQuery {
  me: MeQuery_me;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserProfileQuery
// ====================================================

export interface UserProfileQuery_user_organizations {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
}

export interface UserProfileQuery_user_details {
  __typename: "UserDetail";
  id: Scalar.UUID;
  type: UserDetailType;
  value: string;
}

export interface UserProfileQuery_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  bio: string | null;
  organizations: UserProfileQuery_user_organizations[];
  details: UserProfileQuery_user_details[];
}

export interface UserProfileQuery {
  user: UserProfileQuery_user;
}

export interface UserProfileQueryVariables {
  userId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserTasksQuery
// ====================================================

export interface UserTasksQuery_user_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface UserTasksQuery_user_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface UserTasksQuery_user_tasks_owner {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface UserTasksQuery_user_tasks_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface UserTasksQuery_user_tasks_discordChannel {
  __typename: "DiscordChannel";
  id: Scalar.UUID;
  link: string;
  name: string;
}

export interface UserTasksQuery_user_tasks_githubPullRequests {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatusEnum;
  number: number;
  branchName: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface UserTasksQuery_user_tasks_githubBranches {
  __typename: "GithubBranch";
  id: Scalar.UUID;
  name: string;
  link: string;
  repository: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface UserTasksQuery_user_tasks_reward {
  __typename: "TaskReward";
  amount: number;
  currency: string;
  trigger: TaskRewardTrigger;
}

export interface UserTasksQuery_user_tasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatusEnum;
  sortKey: string;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  tags: UserTasksQuery_user_tasks_tags[];
  assignees: UserTasksQuery_user_tasks_assignees[];
  owner: UserTasksQuery_user_tasks_owner | null;
  creator: UserTasksQuery_user_tasks_creator | null;
  discordChannel: UserTasksQuery_user_tasks_discordChannel | null;
  githubPullRequests: UserTasksQuery_user_tasks_githubPullRequests[];
  githubBranches: UserTasksQuery_user_tasks_githubBranches[];
  reward: UserTasksQuery_user_tasks_reward | null;
}

export interface UserTasksQuery_user {
  __typename: "User";
  id: Scalar.UUID;
  tasks: UserTasksQuery_user_tasks[];
}

export interface UserTasksQuery {
  user: UserTasksQuery_user;
}

export interface UserTasksQueryVariables {
  userId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserPaymentMethodQuery
// ====================================================

export interface UserPaymentMethodQuery_user_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
}

export interface UserPaymentMethodQuery_user {
  __typename: "User";
  id: Scalar.UUID;
  paymentMethod: UserPaymentMethodQuery_user_paymentMethod | null;
}

export interface UserPaymentMethodQuery {
  user: UserPaymentMethodQuery_user;
}

export interface UserPaymentMethodQueryVariables {
  id: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PermissionsQuery
// ====================================================

export interface PermissionsQuery_me {
  __typename: "User";
  id: Scalar.UUID;
  permissions: Scalar.JSONObject[];
}

export interface PermissionsQuery {
  me: PermissionsQuery_me;
}

export interface PermissionsQueryVariables {
  input?: GetUserPermissionsInput | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationQuery
// ====================================================

export interface GetOrganizationQuery_organization_projects_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
}

export interface GetOrganizationQuery_organization_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  taskCount: number;
  doneTaskCount: number;
  openBountyTaskCount: number;
  paymentMethod: GetOrganizationQuery_organization_projects_paymentMethod | null;
}

export interface GetOrganizationQuery_organization_members_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetOrganizationQuery_organization_members {
  __typename: "OrganizationMember";
  id: Scalar.UUID;
  role: OrganizationRole;
  organizationId: string;
  userId: string;
  user: GetOrganizationQuery_organization_members_user;
}

export interface GetOrganizationQuery_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  description: string | null;
  projects: GetOrganizationQuery_organization_projects[];
  members: GetOrganizationQuery_organization_members[];
}

export interface GetOrganizationQuery {
  organization: GetOrganizationQuery_organization;
}

export interface GetOrganizationQueryVariables {
  organizationId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetFeaturedOrganizationsQuery
// ====================================================

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_projects_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  taskCount: number;
  doneTaskCount: number;
  openBountyTaskCount: number;
  paymentMethod: GetFeaturedOrganizationsQuery_featuredOrganizations_projects_paymentMethod | null;
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_members_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_members {
  __typename: "OrganizationMember";
  id: Scalar.UUID;
  role: OrganizationRole;
  organizationId: string;
  userId: string;
  user: GetFeaturedOrganizationsQuery_featuredOrganizations_members_user;
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  description: string | null;
  projects: GetFeaturedOrganizationsQuery_featuredOrganizations_projects[];
  members: GetFeaturedOrganizationsQuery_featuredOrganizations_members[];
}

export interface GetFeaturedOrganizationsQuery {
  featuredOrganizations: GetFeaturedOrganizationsQuery_featuredOrganizations[];
}

export interface GetFeaturedOrganizationsQueryVariables {
  limit: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationTasksQuery
// ====================================================

export interface GetOrganizationTasksQuery_organization_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface GetOrganizationTasksQuery_organization_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetOrganizationTasksQuery_organization_tasks_owner {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetOrganizationTasksQuery_organization_tasks_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetOrganizationTasksQuery_organization_tasks_discordChannel {
  __typename: "DiscordChannel";
  id: Scalar.UUID;
  link: string;
  name: string;
}

export interface GetOrganizationTasksQuery_organization_tasks_githubPullRequests {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatusEnum;
  number: number;
  branchName: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface GetOrganizationTasksQuery_organization_tasks_githubBranches {
  __typename: "GithubBranch";
  id: Scalar.UUID;
  name: string;
  link: string;
  repository: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface GetOrganizationTasksQuery_organization_tasks_reward {
  __typename: "TaskReward";
  amount: number;
  currency: string;
  trigger: TaskRewardTrigger;
}

export interface GetOrganizationTasksQuery_organization_tasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatusEnum;
  sortKey: string;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  tags: GetOrganizationTasksQuery_organization_tasks_tags[];
  assignees: GetOrganizationTasksQuery_organization_tasks_assignees[];
  owner: GetOrganizationTasksQuery_organization_tasks_owner | null;
  creator: GetOrganizationTasksQuery_organization_tasks_creator | null;
  discordChannel: GetOrganizationTasksQuery_organization_tasks_discordChannel | null;
  githubPullRequests: GetOrganizationTasksQuery_organization_tasks_githubPullRequests[];
  githubBranches: GetOrganizationTasksQuery_organization_tasks_githubBranches[];
  reward: GetOrganizationTasksQuery_organization_tasks_reward | null;
}

export interface GetOrganizationTasksQuery_organization_projects_taskTags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface GetOrganizationTasksQuery_organization_projects {
  __typename: "Project";
  taskTags: GetOrganizationTasksQuery_organization_projects_taskTags[];
}

export interface GetOrganizationTasksQuery_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  tasks: GetOrganizationTasksQuery_organization_tasks[];
  projects: GetOrganizationTasksQuery_organization_projects[];
}

export interface GetOrganizationTasksQuery {
  organization: GetOrganizationTasksQuery_organization;
}

export interface GetOrganizationTasksQueryVariables {
  organizationId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProjectQuery
// ====================================================

export interface GetProjectQuery_project_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
}

export interface GetProjectQuery_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  taskCount: number;
  doneTaskCount: number;
  openBountyTaskCount: number;
  paymentMethod: GetProjectQuery_project_paymentMethod | null;
}

export interface GetProjectQuery {
  project: GetProjectQuery_project;
}

export interface GetProjectQueryVariables {
  projectId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProjectTasksQuery
// ====================================================

export interface GetProjectTasksQuery_project_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface GetProjectTasksQuery_project_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetProjectTasksQuery_project_tasks_owner {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetProjectTasksQuery_project_tasks_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetProjectTasksQuery_project_tasks_discordChannel {
  __typename: "DiscordChannel";
  id: Scalar.UUID;
  link: string;
  name: string;
}

export interface GetProjectTasksQuery_project_tasks_githubPullRequests {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatusEnum;
  number: number;
  branchName: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface GetProjectTasksQuery_project_tasks_githubBranches {
  __typename: "GithubBranch";
  id: Scalar.UUID;
  name: string;
  link: string;
  repository: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface GetProjectTasksQuery_project_tasks_reward {
  __typename: "TaskReward";
  amount: number;
  currency: string;
  trigger: TaskRewardTrigger;
}

export interface GetProjectTasksQuery_project_tasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatusEnum;
  sortKey: string;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  tags: GetProjectTasksQuery_project_tasks_tags[];
  assignees: GetProjectTasksQuery_project_tasks_assignees[];
  owner: GetProjectTasksQuery_project_tasks_owner | null;
  creator: GetProjectTasksQuery_project_tasks_creator | null;
  discordChannel: GetProjectTasksQuery_project_tasks_discordChannel | null;
  githubPullRequests: GetProjectTasksQuery_project_tasks_githubPullRequests[];
  githubBranches: GetProjectTasksQuery_project_tasks_githubBranches[];
  reward: GetProjectTasksQuery_project_tasks_reward | null;
}

export interface GetProjectTasksQuery_project_taskTags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface GetProjectTasksQuery_project {
  __typename: "Project";
  id: Scalar.UUID;
  tasks: GetProjectTasksQuery_project_tasks[];
  taskTags: GetProjectTasksQuery_project_taskTags[];
}

export interface GetProjectTasksQuery {
  project: GetProjectTasksQuery_project;
}

export interface GetProjectTasksQueryVariables {
  projectId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTaskQuery
// ====================================================

export interface GetTaskQuery_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface GetTaskQuery_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetTaskQuery_task_owner {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetTaskQuery_task_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetTaskQuery_task_discordChannel {
  __typename: "DiscordChannel";
  id: Scalar.UUID;
  link: string;
  name: string;
}

export interface GetTaskQuery_task_githubPullRequests {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatusEnum;
  number: number;
  branchName: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface GetTaskQuery_task_githubBranches {
  __typename: "GithubBranch";
  id: Scalar.UUID;
  name: string;
  link: string;
  repository: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface GetTaskQuery_task_reward {
  __typename: "TaskReward";
  amount: number;
  currency: string;
  trigger: TaskRewardTrigger;
}

export interface GetTaskQuery_task_project_taskTags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface GetTaskQuery_task_project {
  __typename: "Project";
  id: Scalar.UUID;
  taskTags: GetTaskQuery_task_project_taskTags[];
}

export interface GetTaskQuery_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatusEnum;
  sortKey: string;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  tags: GetTaskQuery_task_tags[];
  assignees: GetTaskQuery_task_assignees[];
  owner: GetTaskQuery_task_owner | null;
  creator: GetTaskQuery_task_creator | null;
  discordChannel: GetTaskQuery_task_discordChannel | null;
  githubPullRequests: GetTaskQuery_task_githubPullRequests[];
  githubBranches: GetTaskQuery_task_githubBranches[];
  reward: GetTaskQuery_task_reward | null;
  project: GetTaskQuery_task_project;
}

export interface GetTaskQuery {
  task: GetTaskQuery_task;
}

export interface GetTaskQueryVariables {
  taskId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProjectIntegrationsQuery
// ====================================================

export interface GetProjectIntegrationsQuery_project_integrations {
  __typename: "ProjectIntegration";
  id: Scalar.UUID;
  source: string;
  config: Scalar.JSONObject;
}

export interface GetProjectIntegrationsQuery_project {
  __typename: "Project";
  id: Scalar.UUID;
  integrations: GetProjectIntegrationsQuery_project_integrations[];
}

export interface GetProjectIntegrationsQuery {
  project: GetProjectIntegrationsQuery_project;
}

export interface GetProjectIntegrationsQueryVariables {
  projectId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetInviteQuery
// ====================================================

export interface GetInviteQuery_invite_inviter {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetInviteQuery_invite_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
}

export interface GetInviteQuery_invite {
  __typename: "Invite";
  id: Scalar.UUID;
  inviter: GetInviteQuery_invite_inviter;
  organization: GetInviteQuery_invite_organization;
}

export interface GetInviteQuery {
  invite: GetInviteQuery_invite | null;
}

export interface GetInviteQueryVariables {
  inviteId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: TaskCreatedSubscription
// ====================================================

export interface TaskCreatedSubscription_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface TaskCreatedSubscription_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskCreatedSubscription_task_owner {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskCreatedSubscription_task_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskCreatedSubscription_task_discordChannel {
  __typename: "DiscordChannel";
  id: Scalar.UUID;
  link: string;
  name: string;
}

export interface TaskCreatedSubscription_task_githubPullRequests {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatusEnum;
  number: number;
  branchName: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface TaskCreatedSubscription_task_githubBranches {
  __typename: "GithubBranch";
  id: Scalar.UUID;
  name: string;
  link: string;
  repository: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface TaskCreatedSubscription_task_reward {
  __typename: "TaskReward";
  amount: number;
  currency: string;
  trigger: TaskRewardTrigger;
}

export interface TaskCreatedSubscription_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatusEnum;
  sortKey: string;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  tags: TaskCreatedSubscription_task_tags[];
  assignees: TaskCreatedSubscription_task_assignees[];
  owner: TaskCreatedSubscription_task_owner | null;
  creator: TaskCreatedSubscription_task_creator | null;
  discordChannel: TaskCreatedSubscription_task_discordChannel | null;
  githubPullRequests: TaskCreatedSubscription_task_githubPullRequests[];
  githubBranches: TaskCreatedSubscription_task_githubBranches[];
  reward: TaskCreatedSubscription_task_reward | null;
}

export interface TaskCreatedSubscription {
  task: TaskCreatedSubscription_task;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: TaskUpdatedSubscription
// ====================================================

export interface TaskUpdatedSubscription_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface TaskUpdatedSubscription_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskUpdatedSubscription_task_owner {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskUpdatedSubscription_task_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskUpdatedSubscription_task_discordChannel {
  __typename: "DiscordChannel";
  id: Scalar.UUID;
  link: string;
  name: string;
}

export interface TaskUpdatedSubscription_task_githubPullRequests {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatusEnum;
  number: number;
  branchName: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface TaskUpdatedSubscription_task_githubBranches {
  __typename: "GithubBranch";
  id: Scalar.UUID;
  name: string;
  link: string;
  repository: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface TaskUpdatedSubscription_task_reward {
  __typename: "TaskReward";
  amount: number;
  currency: string;
  trigger: TaskRewardTrigger;
}

export interface TaskUpdatedSubscription_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatusEnum;
  sortKey: string;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  tags: TaskUpdatedSubscription_task_tags[];
  assignees: TaskUpdatedSubscription_task_assignees[];
  owner: TaskUpdatedSubscription_task_owner | null;
  creator: TaskUpdatedSubscription_task_creator | null;
  discordChannel: TaskUpdatedSubscription_task_discordChannel | null;
  githubPullRequests: TaskUpdatedSubscription_task_githubPullRequests[];
  githubBranches: TaskUpdatedSubscription_task_githubBranches[];
  reward: TaskUpdatedSubscription_task_reward | null;
}

export interface TaskUpdatedSubscription {
  task: TaskUpdatedSubscription_task;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserDetail
// ====================================================

export interface UserDetail {
  __typename: "UserDetail";
  id: Scalar.UUID;
  type: UserDetailType;
  value: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: User
// ====================================================

export interface User {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PaymentMethod
// ====================================================

export interface PaymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Organization
// ====================================================

export interface Organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: OrganizationMember
// ====================================================

export interface OrganizationMember_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface OrganizationMember {
  __typename: "OrganizationMember";
  id: Scalar.UUID;
  role: OrganizationRole;
  organizationId: string;
  userId: string;
  user: OrganizationMember_user;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProjectIntegration
// ====================================================

export interface ProjectIntegration {
  __typename: "ProjectIntegration";
  id: Scalar.UUID;
  source: string;
  config: Scalar.JSONObject;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Project
// ====================================================

export interface Project_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
}

export interface Project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  taskCount: number;
  doneTaskCount: number;
  openBountyTaskCount: number;
  paymentMethod: Project_paymentMethod | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TaskTag
// ====================================================

export interface TaskTag {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TaskReward
// ====================================================

export interface TaskReward {
  __typename: "TaskReward";
  amount: number;
  currency: string;
  trigger: TaskRewardTrigger;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: GithubPullRequest
// ====================================================

export interface GithubPullRequest {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatusEnum;
  number: number;
  branchName: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: GithubBranch
// ====================================================

export interface GithubBranch {
  __typename: "GithubBranch";
  id: Scalar.UUID;
  name: string;
  link: string;
  repository: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: DiscordChannel
// ====================================================

export interface DiscordChannel {
  __typename: "DiscordChannel";
  id: Scalar.UUID;
  link: string;
  name: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Task
// ====================================================

export interface Task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface Task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface Task_owner {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface Task_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface Task_discordChannel {
  __typename: "DiscordChannel";
  id: Scalar.UUID;
  link: string;
  name: string;
}

export interface Task_githubPullRequests {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatusEnum;
  number: number;
  branchName: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface Task_githubBranches {
  __typename: "GithubBranch";
  id: Scalar.UUID;
  name: string;
  link: string;
  repository: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface Task_reward {
  __typename: "TaskReward";
  amount: number;
  currency: string;
  trigger: TaskRewardTrigger;
}

export interface Task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatusEnum;
  sortKey: string;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  tags: Task_tags[];
  assignees: Task_assignees[];
  owner: Task_owner | null;
  creator: Task_creator | null;
  discordChannel: Task_discordChannel | null;
  githubPullRequests: Task_githubPullRequests[];
  githubBranches: Task_githubBranches[];
  reward: Task_reward | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserProfile
// ====================================================

export interface UserProfile_organizations {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
}

export interface UserProfile_details {
  __typename: "UserDetail";
  id: Scalar.UUID;
  type: UserDetailType;
  value: string;
}

export interface UserProfile {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  bio: string | null;
  organizations: UserProfile_organizations[];
  details: UserProfile_details[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserDetails
// ====================================================

export interface UserDetails_organizations {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
}

export interface UserDetails_details {
  __typename: "UserDetail";
  id: Scalar.UUID;
  type: UserDetailType;
  value: string;
}

export interface UserDetails_threepids {
  __typename: "Threepid";
  id: Scalar.UUID;
  source: ThreepidSource;
}

export interface UserDetails_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
}

export interface UserDetails {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  bio: string | null;
  organizations: UserDetails_organizations[];
  details: UserDetails_details[];
  threepids: UserDetails_threepids[];
  paymentMethod: UserDetails_paymentMethod | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: OrganizationDetails
// ====================================================

export interface OrganizationDetails_projects_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
}

export interface OrganizationDetails_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  taskCount: number;
  doneTaskCount: number;
  openBountyTaskCount: number;
  paymentMethod: OrganizationDetails_projects_paymentMethod | null;
}

export interface OrganizationDetails_members_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface OrganizationDetails_members {
  __typename: "OrganizationMember";
  id: Scalar.UUID;
  role: OrganizationRole;
  organizationId: string;
  userId: string;
  user: OrganizationDetails_members_user;
}

export interface OrganizationDetails {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  description: string | null;
  projects: OrganizationDetails_projects[];
  members: OrganizationDetails_members[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProjectDetails
// ====================================================

export interface ProjectDetails_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
}

export interface ProjectDetails_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface ProjectDetails_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface ProjectDetails_tasks_owner {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface ProjectDetails_tasks_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface ProjectDetails_tasks_discordChannel {
  __typename: "DiscordChannel";
  id: Scalar.UUID;
  link: string;
  name: string;
}

export interface ProjectDetails_tasks_githubPullRequests {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatusEnum;
  number: number;
  branchName: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface ProjectDetails_tasks_githubBranches {
  __typename: "GithubBranch";
  id: Scalar.UUID;
  name: string;
  link: string;
  repository: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface ProjectDetails_tasks_reward {
  __typename: "TaskReward";
  amount: number;
  currency: string;
  trigger: TaskRewardTrigger;
}

export interface ProjectDetails_tasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatusEnum;
  sortKey: string;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  tags: ProjectDetails_tasks_tags[];
  assignees: ProjectDetails_tasks_assignees[];
  owner: ProjectDetails_tasks_owner | null;
  creator: ProjectDetails_tasks_creator | null;
  discordChannel: ProjectDetails_tasks_discordChannel | null;
  githubPullRequests: ProjectDetails_tasks_githubPullRequests[];
  githubBranches: ProjectDetails_tasks_githubBranches[];
  reward: ProjectDetails_tasks_reward | null;
}

export interface ProjectDetails_taskTags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface ProjectDetails {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  taskCount: number;
  doneTaskCount: number;
  openBountyTaskCount: number;
  paymentMethod: ProjectDetails_paymentMethod | null;
  tasks: ProjectDetails_tasks[];
  taskTags: ProjectDetails_taskTags[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Invite
// ====================================================

export interface Invite_inviter {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface Invite_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
}

export interface Invite {
  __typename: "Invite";
  id: Scalar.UUID;
  inviter: Invite_inviter;
  organization: Invite_organization;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum GithubPullRequestStatusEnum {
  DONE = "DONE",
  DRAFT = "DRAFT",
  OPEN = "OPEN",
}

export enum OrganizationRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  OWNER = "OWNER",
}

export enum PaymentMethodType {
  GNOSIS_SAFE = "GNOSIS_SAFE",
  METAMASK = "METAMASK",
  PHANTOM = "PHANTOM",
}

export enum ProjectIntegrationSource {
  discord = "discord",
  github = "github",
}

export enum TaskRewardTrigger {
  CORE_TEAM_APPROVAL = "CORE_TEAM_APPROVAL",
  PULL_REQUEST_MERGED = "PULL_REQUEST_MERGED",
}

export enum TaskStatusEnum {
  DONE = "DONE",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  TODO = "TODO",
}

export enum ThreepidSource {
  discord = "discord",
  github = "github",
}

export enum UserDetailType {
  country = "country",
  github = "github",
  linkedin = "linkedin",
  twitter = "twitter",
  website = "website",
}

export interface CreateFileUploadUrlInput {
  fileName: string;
  contentType: string;
}

export interface CreateInviteInput {
  organizationId: Scalar.UUID;
  role?: OrganizationRole | null;
}

export interface CreateOrganizationInput {
  name: string;
  imageUrl?: string | null;
}

export interface CreatePaymentMethodInput {
  type: PaymentMethodType;
  address: string;
}

export interface CreateProjectInput {
  name: string;
  organizationId: Scalar.UUID;
}

export interface CreateProjectIntegrationInput {
  source: ProjectIntegrationSource;
  config: Scalar.JSONObject;
  projectId: Scalar.UUID;
}

export interface CreateTaskInput {
  name: string;
  description?: string | null;
  projectId: Scalar.UUID;
  tagIds?: Scalar.UUID[] | null;
  assigneeIds?: Scalar.UUID[] | null;
  ownerId?: Scalar.UUID | null;
  status: TaskStatusEnum;
  reward?: UpdateTaskRewardInput | null;
}

export interface CreateTaskTagInput {
  label: string;
  color: string;
  projectId: Scalar.UUID;
}

export interface GetUserPermissionsInput {
  organizationId?: Scalar.UUID | null;
  projectId?: Scalar.UUID | null;
  taskId?: Scalar.UUID | null;
}

export interface RemoveOrganizationMemberInput {
  organizationId: Scalar.UUID;
  userId: Scalar.UUID;
}

export interface SetUserDetailInput {
  type: UserDetailType;
  value?: string | null;
}

export interface UpdateOrganizationMemberInput {
  organizationId: Scalar.UUID;
  userId: Scalar.UUID;
  role: OrganizationRole;
}

export interface UpdateProjectInput {
  id: Scalar.UUID;
  name?: string | null;
  paymentMethodId?: Scalar.UUID | null;
  deletedAt?: Scalar.DateTime | null;
}

export interface UpdateTaskInput {
  id: Scalar.UUID;
  name?: string | null;
  description?: string | null;
  sortKey?: string | null;
  tagIds?: Scalar.UUID[] | null;
  assigneeIds?: Scalar.UUID[] | null;
  ownerId?: Scalar.UUID | null;
  status?: TaskStatusEnum | null;
  reward?: UpdateTaskRewardInput | null;
}

export interface UpdateTaskRewardInput {
  amount: number;
  currency: string;
  trigger: TaskRewardTrigger;
}

export interface UpdateUserInput {
  username?: string | null;
  bio?: string | null;
  imageUrl?: string | null;
  paymentMethodId?: Scalar.UUID | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
