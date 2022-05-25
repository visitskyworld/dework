/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AuthWithThreepidMutation
// ====================================================

export interface AuthWithThreepidMutation_authWithThreepid_user_organizations {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface AuthWithThreepidMutation_authWithThreepid_user_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface AuthWithThreepidMutation_authWithThreepid_user_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface AuthWithThreepidMutation_authWithThreepid_user_threepids {
  __typename: "Threepid";
  id: string;
  source: ThreepidSource;
  threepid: string;
}

export interface AuthWithThreepidMutation_authWithThreepid_user_prompts {
  __typename: "UserPrompt";
  id: Scalar.UUID;
  type: string;
  createdAt: Scalar.DateTime;
  completedAt: Scalar.DateTime | null;
}

export interface AuthWithThreepidMutation_authWithThreepid_user_taskGatingDefaults_roles {
  __typename: "Role";
  id: Scalar.UUID;
}

export interface AuthWithThreepidMutation_authWithThreepid_user_taskGatingDefaults {
  __typename: "TaskGatingDefault";
  id: Scalar.UUID;
  userId: string;
  projectId: string;
  type: TaskGatingType;
  roles: AuthWithThreepidMutation_authWithThreepid_user_taskGatingDefaults_roles[];
}

export interface AuthWithThreepidMutation_authWithThreepid_user_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface AuthWithThreepidMutation_authWithThreepid_user_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface AuthWithThreepidMutation_authWithThreepid_user_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: AuthWithThreepidMutation_authWithThreepid_user_taskViews_filters[];
  sortBys: AuthWithThreepidMutation_authWithThreepid_user_taskViews_sortBys[];
}

export interface AuthWithThreepidMutation_authWithThreepid_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
  bio: string | null;
  organizations: AuthWithThreepidMutation_authWithThreepid_user_organizations[];
  details: AuthWithThreepidMutation_authWithThreepid_user_details[];
  skills: AuthWithThreepidMutation_authWithThreepid_user_skills[];
  threepids: AuthWithThreepidMutation_authWithThreepid_user_threepids[];
  prompts: AuthWithThreepidMutation_authWithThreepid_user_prompts[];
  taskGatingDefaults: AuthWithThreepidMutation_authWithThreepid_user_taskGatingDefaults[];
  taskViews: AuthWithThreepidMutation_authWithThreepid_user_taskViews[];
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
// GraphQL mutation operation: CreateMetamaskThreepid
// ====================================================

export interface CreateMetamaskThreepid_threepid {
  __typename: "Threepid";
  id: string;
}

export interface CreateMetamaskThreepid {
  threepid: CreateMetamaskThreepid_threepid;
}

export interface CreateMetamaskThreepidVariables {
  input: CreateMetamaskThreepidInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreatePhantomThreepid
// ====================================================

export interface CreatePhantomThreepid_threepid {
  __typename: "Threepid";
  id: string;
}

export interface CreatePhantomThreepid {
  threepid: CreatePhantomThreepid_threepid;
}

export interface CreatePhantomThreepidVariables {
  input: CreatePhantomThreepidInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateHiroThreepid
// ====================================================

export interface CreateHiroThreepid_threepid {
  __typename: "Threepid";
  id: string;
}

export interface CreateHiroThreepid {
  threepid: CreateHiroThreepid_threepid;
}

export interface CreateHiroThreepidVariables {
  input: CreateHiroThreepidInput;
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
  tagline: string | null;
  permalink: string;
}

export interface UpdateUserMutation_user_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface UpdateUserMutation_user_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface UpdateUserMutation_user_threepids {
  __typename: "Threepid";
  id: string;
  source: ThreepidSource;
  threepid: string;
}

export interface UpdateUserMutation_user_prompts {
  __typename: "UserPrompt";
  id: Scalar.UUID;
  type: string;
  createdAt: Scalar.DateTime;
  completedAt: Scalar.DateTime | null;
}

export interface UpdateUserMutation_user_taskGatingDefaults_roles {
  __typename: "Role";
  id: Scalar.UUID;
}

export interface UpdateUserMutation_user_taskGatingDefaults {
  __typename: "TaskGatingDefault";
  id: Scalar.UUID;
  userId: string;
  projectId: string;
  type: TaskGatingType;
  roles: UpdateUserMutation_user_taskGatingDefaults_roles[];
}

export interface UpdateUserMutation_user_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface UpdateUserMutation_user_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface UpdateUserMutation_user_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: UpdateUserMutation_user_taskViews_filters[];
  sortBys: UpdateUserMutation_user_taskViews_sortBys[];
}

export interface UpdateUserMutation_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
  bio: string | null;
  organizations: UpdateUserMutation_user_organizations[];
  details: UpdateUserMutation_user_details[];
  skills: UpdateUserMutation_user_skills[];
  threepids: UpdateUserMutation_user_threepids[];
  prompts: UpdateUserMutation_user_prompts[];
  taskGatingDefaults: UpdateUserMutation_user_taskGatingDefaults[];
  taskViews: UpdateUserMutation_user_taskViews[];
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
// GraphQL mutation operation: UpdateUserPromptMutation
// ====================================================

export interface UpdateUserPromptMutation_prompt_user_prompts {
  __typename: "UserPrompt";
  id: Scalar.UUID;
  type: string;
  createdAt: Scalar.DateTime;
  completedAt: Scalar.DateTime | null;
}

export interface UpdateUserPromptMutation_prompt_user {
  __typename: "User";
  id: Scalar.UUID;
  prompts: UpdateUserPromptMutation_prompt_user_prompts[];
}

export interface UpdateUserPromptMutation_prompt {
  __typename: "UserPrompt";
  id: Scalar.UUID;
  type: string;
  createdAt: Scalar.DateTime;
  completedAt: Scalar.DateTime | null;
  user: UpdateUserPromptMutation_prompt_user;
}

export interface UpdateUserPromptMutation {
  prompt: UpdateUserPromptMutation_prompt;
}

export interface UpdateUserPromptMutationVariables {
  input: UpdateUserPromptInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUserRoleMutation
// ====================================================

export interface UpdateUserRoleMutation_user_userRoles {
  __typename: "UserRole";
  roleId: string;
  hidden: boolean;
}

export interface UpdateUserRoleMutation_user {
  __typename: "User";
  id: Scalar.UUID;
  userRoles: UpdateUserRoleMutation_user_userRoles[];
}

export interface UpdateUserRoleMutation {
  user: UpdateUserRoleMutation_user;
}

export interface UpdateUserRoleMutationVariables {
  input: UpdateUserRoleInput;
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
  tagline: string | null;
  permalink: string;
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
// GraphQL mutation operation: UpdateOrganizationMutation
// ====================================================

export interface UpdateOrganizationMutation_organization_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  taskCount: number;
  doneTaskCount: number;
  openBountyTaskCount: number;
}

export interface UpdateOrganizationMutation_organization_workspaces {
  __typename: "Workspace";
  id: Scalar.UUID;
  name: string;
  sortKey: string;
}

export interface UpdateOrganizationMutation_organization_tags {
  __typename: "OrganizationTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface UpdateOrganizationMutation_organization_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface UpdateOrganizationMutation_organization_projectTokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UpdateOrganizationMutation_organization_projectTokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: UpdateOrganizationMutation_organization_projectTokenGates_token_network;
}

export interface UpdateOrganizationMutation_organization_projectTokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  token: UpdateOrganizationMutation_organization_projectTokenGates_token;
}

export interface UpdateOrganizationMutation_organization_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface UpdateOrganizationMutation_organization_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface UpdateOrganizationMutation_organization_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: UpdateOrganizationMutation_organization_taskViews_filters[];
  sortBys: UpdateOrganizationMutation_organization_taskViews_sortBys[];
}

export interface UpdateOrganizationMutation_organization_fundingSessions_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface UpdateOrganizationMutation_organization_fundingSessions {
  __typename: "FundingSession";
  id: Scalar.UUID;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  closedAt: Scalar.DateTime | null;
  amount: string;
  permalink: string;
  organizationId: string;
  token: UpdateOrganizationMutation_organization_fundingSessions_token;
}

export interface UpdateOrganizationMutation_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
  description: string | null;
  projects: UpdateOrganizationMutation_organization_projects[];
  workspaces: UpdateOrganizationMutation_organization_workspaces[];
  tags: UpdateOrganizationMutation_organization_tags[];
  details: UpdateOrganizationMutation_organization_details[];
  projectTokenGates: UpdateOrganizationMutation_organization_projectTokenGates[];
  taskViews: UpdateOrganizationMutation_organization_taskViews[];
  fundingSessions: UpdateOrganizationMutation_organization_fundingSessions[];
}

export interface UpdateOrganizationMutation {
  organization: UpdateOrganizationMutation_organization;
}

export interface UpdateOrganizationMutationVariables {
  input: UpdateOrganizationInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteOrganizationMutation
// ====================================================

export interface DeleteOrganizationMutation {
  deleteOrganization: boolean;
}

export interface DeleteOrganizationMutationVariables {
  id: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateOrganizationTagMutation
// ====================================================

export interface CreateOrganizationTagMutation_organizationTag_organization_tags {
  __typename: "OrganizationTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface CreateOrganizationTagMutation_organizationTag_organization_allTags {
  __typename: "OrganizationTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface CreateOrganizationTagMutation_organizationTag_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  tags: CreateOrganizationTagMutation_organizationTag_organization_tags[];
  allTags: CreateOrganizationTagMutation_organizationTag_organization_allTags[];
}

export interface CreateOrganizationTagMutation_organizationTag {
  __typename: "OrganizationTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  organization: CreateOrganizationTagMutation_organizationTag_organization;
}

export interface CreateOrganizationTagMutation {
  organizationTag: CreateOrganizationTagMutation_organizationTag;
}

export interface CreateOrganizationTagMutationVariables {
  input: CreateOrganizationTagInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateProjectMutation
// ====================================================

export interface CreateProjectMutation_project_options {
  __typename: "ProjectOptions";
  showBacklogColumn: boolean | null;
  showCommunitySuggestions: boolean | null;
}

export interface CreateProjectMutation_project_tokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateProjectMutation_project_tokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: CreateProjectMutation_project_tokenGates_token_network;
}

export interface CreateProjectMutation_project_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  token: CreateProjectMutation_project_tokenGates_token;
}

export interface CreateProjectMutation_project_organization_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  taskCount: number;
  doneTaskCount: number;
  openBountyTaskCount: number;
}

export interface CreateProjectMutation_project_organization_workspaces {
  __typename: "Workspace";
  id: Scalar.UUID;
  name: string;
  sortKey: string;
}

export interface CreateProjectMutation_project_organization_tags {
  __typename: "OrganizationTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface CreateProjectMutation_project_organization_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface CreateProjectMutation_project_organization_projectTokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateProjectMutation_project_organization_projectTokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: CreateProjectMutation_project_organization_projectTokenGates_token_network;
}

export interface CreateProjectMutation_project_organization_projectTokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  token: CreateProjectMutation_project_organization_projectTokenGates_token;
}

export interface CreateProjectMutation_project_organization_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface CreateProjectMutation_project_organization_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface CreateProjectMutation_project_organization_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: CreateProjectMutation_project_organization_taskViews_filters[];
  sortBys: CreateProjectMutation_project_organization_taskViews_sortBys[];
}

export interface CreateProjectMutation_project_organization_fundingSessions_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateProjectMutation_project_organization_fundingSessions {
  __typename: "FundingSession";
  id: Scalar.UUID;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  closedAt: Scalar.DateTime | null;
  amount: string;
  permalink: string;
  organizationId: string;
  token: CreateProjectMutation_project_organization_fundingSessions_token;
}

export interface CreateProjectMutation_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
  description: string | null;
  projects: CreateProjectMutation_project_organization_projects[];
  workspaces: CreateProjectMutation_project_organization_workspaces[];
  tags: CreateProjectMutation_project_organization_tags[];
  details: CreateProjectMutation_project_organization_details[];
  projectTokenGates: CreateProjectMutation_project_organization_projectTokenGates[];
  taskViews: CreateProjectMutation_project_organization_taskViews[];
  fundingSessions: CreateProjectMutation_project_organization_fundingSessions[];
}

export interface CreateProjectMutation_project_taskSections {
  __typename: "TaskSection";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
  projectId: string;
}

export interface CreateProjectMutation_project_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface CreateProjectMutation_project_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface CreateProjectMutation_project_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: CreateProjectMutation_project_taskViews_filters[];
  sortBys: CreateProjectMutation_project_taskViews_sortBys[];
}

export interface CreateProjectMutation_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  options: CreateProjectMutation_project_options | null;
  tokenGates: CreateProjectMutation_project_tokenGates[];
  organization: CreateProjectMutation_project_organization;
  taskSections: CreateProjectMutation_project_taskSections[];
  taskViews: CreateProjectMutation_project_taskViews[];
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

export interface UpdateProjectMutation_project_options {
  __typename: "ProjectOptions";
  showBacklogColumn: boolean | null;
  showCommunitySuggestions: boolean | null;
}

export interface UpdateProjectMutation_project_tokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UpdateProjectMutation_project_tokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: UpdateProjectMutation_project_tokenGates_token_network;
}

export interface UpdateProjectMutation_project_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  token: UpdateProjectMutation_project_tokenGates_token;
}

export interface UpdateProjectMutation_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface UpdateProjectMutation_project_taskSections {
  __typename: "TaskSection";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
  projectId: string;
}

export interface UpdateProjectMutation_project_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface UpdateProjectMutation_project_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface UpdateProjectMutation_project_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: UpdateProjectMutation_project_taskViews_filters[];
  sortBys: UpdateProjectMutation_project_taskViews_sortBys[];
}

export interface UpdateProjectMutation_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  options: UpdateProjectMutation_project_options | null;
  tokenGates: UpdateProjectMutation_project_tokenGates[];
  organization: UpdateProjectMutation_project_organization;
  taskSections: UpdateProjectMutation_project_taskSections[];
  taskViews: UpdateProjectMutation_project_taskViews[];
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
// GraphQL mutation operation: CreateTaskSectionMutation
// ====================================================

export interface CreateTaskSectionMutation_section_project_taskSections {
  __typename: "TaskSection";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
  projectId: string;
}

export interface CreateTaskSectionMutation_section_project {
  __typename: "Project";
  id: Scalar.UUID;
  taskSections: CreateTaskSectionMutation_section_project_taskSections[];
}

export interface CreateTaskSectionMutation_section {
  __typename: "TaskSection";
  id: Scalar.UUID;
  project: CreateTaskSectionMutation_section_project;
}

export interface CreateTaskSectionMutation {
  section: CreateTaskSectionMutation_section;
}

export interface CreateTaskSectionMutationVariables {
  input: CreateTaskSectionInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateTaskSectionMutation
// ====================================================

export interface UpdateTaskSectionMutation_section {
  __typename: "TaskSection";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
  projectId: string;
}

export interface UpdateTaskSectionMutation {
  section: UpdateTaskSectionMutation_section;
}

export interface UpdateTaskSectionMutationVariables {
  input: UpdateTaskSectionInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteTaskSectionMutation
// ====================================================

export interface DeleteTaskSectionMutation_section_project_taskSections {
  __typename: "TaskSection";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
  projectId: string;
}

export interface DeleteTaskSectionMutation_section_project {
  __typename: "Project";
  id: Scalar.UUID;
  taskSections: DeleteTaskSectionMutation_section_project_taskSections[];
}

export interface DeleteTaskSectionMutation_section {
  __typename: "TaskSection";
  id: Scalar.UUID;
  project: DeleteTaskSectionMutation_section_project;
}

export interface DeleteTaskSectionMutation {
  section: DeleteTaskSectionMutation_section;
}

export interface DeleteTaskSectionMutationVariables {
  input: UpdateTaskSectionInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTaskMutation
// ====================================================

export interface CreateTaskMutation_task_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface CreateTaskMutation_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface CreateTaskMutation_task_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface CreateTaskMutation_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskMutation_task_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskMutation_task_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateTaskMutation_task_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskMutation_task_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskMutation_task_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: CreateTaskMutation_task_reward_payments_payment_paymentMethod_network;
}

export interface CreateTaskMutation_task_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskMutation_task_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: CreateTaskMutation_task_reward_payments_payment_paymentMethod;
  network: CreateTaskMutation_task_reward_payments_payment_network;
}

export interface CreateTaskMutation_task_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: CreateTaskMutation_task_reward_payments_user;
  payment: CreateTaskMutation_task_reward_payments_payment;
}

export interface CreateTaskMutation_task_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: CreateTaskMutation_task_reward_token;
  payments: CreateTaskMutation_task_reward_payments[];
}

export interface CreateTaskMutation_task_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface CreateTaskMutation_task_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface CreateTaskMutation_task_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface CreateTaskMutation_task_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface CreateTaskMutation_task_parentTask_subtasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface CreateTaskMutation_task_parentTask_subtasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface CreateTaskMutation_task_parentTask_subtasks_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface CreateTaskMutation_task_parentTask_subtasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskMutation_task_parentTask_subtasks_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskMutation_task_parentTask_subtasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateTaskMutation_task_parentTask_subtasks_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskMutation_task_parentTask_subtasks_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskMutation_task_parentTask_subtasks_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: CreateTaskMutation_task_parentTask_subtasks_reward_payments_payment_paymentMethod_network;
}

export interface CreateTaskMutation_task_parentTask_subtasks_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskMutation_task_parentTask_subtasks_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: CreateTaskMutation_task_parentTask_subtasks_reward_payments_payment_paymentMethod;
  network: CreateTaskMutation_task_parentTask_subtasks_reward_payments_payment_network;
}

export interface CreateTaskMutation_task_parentTask_subtasks_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: CreateTaskMutation_task_parentTask_subtasks_reward_payments_user;
  payment: CreateTaskMutation_task_parentTask_subtasks_reward_payments_payment;
}

export interface CreateTaskMutation_task_parentTask_subtasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: CreateTaskMutation_task_parentTask_subtasks_reward_token;
  payments: CreateTaskMutation_task_parentTask_subtasks_reward_payments[];
}

export interface CreateTaskMutation_task_parentTask_subtasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface CreateTaskMutation_task_parentTask_subtasks_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface CreateTaskMutation_task_parentTask_subtasks_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface CreateTaskMutation_task_parentTask_subtasks_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface CreateTaskMutation_task_parentTask_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: CreateTaskMutation_task_parentTask_subtasks_subtasks[];
  tags: CreateTaskMutation_task_parentTask_subtasks_tags[];
  skills: CreateTaskMutation_task_parentTask_subtasks_skills[];
  assignees: CreateTaskMutation_task_parentTask_subtasks_assignees[];
  owners: CreateTaskMutation_task_parentTask_subtasks_owners[];
  reward: CreateTaskMutation_task_parentTask_subtasks_reward | null;
  applications: CreateTaskMutation_task_parentTask_subtasks_applications[];
  submissions: CreateTaskMutation_task_parentTask_subtasks_submissions[];
  review: CreateTaskMutation_task_parentTask_subtasks_review | null;
  reactions: CreateTaskMutation_task_parentTask_subtasks_reactions[];
}

export interface CreateTaskMutation_task_parentTask {
  __typename: "Task";
  id: Scalar.UUID;
  subtasks: CreateTaskMutation_task_parentTask_subtasks[];
}

export interface CreateTaskMutation_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: CreateTaskMutation_task_subtasks[];
  tags: CreateTaskMutation_task_tags[];
  skills: CreateTaskMutation_task_skills[];
  assignees: CreateTaskMutation_task_assignees[];
  owners: CreateTaskMutation_task_owners[];
  reward: CreateTaskMutation_task_reward | null;
  applications: CreateTaskMutation_task_applications[];
  submissions: CreateTaskMutation_task_submissions[];
  review: CreateTaskMutation_task_review | null;
  reactions: CreateTaskMutation_task_reactions[];
  parentTask: CreateTaskMutation_task_parentTask | null;
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

export interface UpdateTaskMutation_task_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface UpdateTaskMutation_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface UpdateTaskMutation_task_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface UpdateTaskMutation_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface UpdateTaskMutation_task_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface UpdateTaskMutation_task_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface UpdateTaskMutation_task_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface UpdateTaskMutation_task_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UpdateTaskMutation_task_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: UpdateTaskMutation_task_reward_payments_payment_paymentMethod_network;
}

export interface UpdateTaskMutation_task_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UpdateTaskMutation_task_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: UpdateTaskMutation_task_reward_payments_payment_paymentMethod;
  network: UpdateTaskMutation_task_reward_payments_payment_network;
}

export interface UpdateTaskMutation_task_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: UpdateTaskMutation_task_reward_payments_user;
  payment: UpdateTaskMutation_task_reward_payments_payment;
}

export interface UpdateTaskMutation_task_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: UpdateTaskMutation_task_reward_token;
  payments: UpdateTaskMutation_task_reward_payments[];
}

export interface UpdateTaskMutation_task_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface UpdateTaskMutation_task_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface UpdateTaskMutation_task_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface UpdateTaskMutation_task_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface UpdateTaskMutation_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: UpdateTaskMutation_task_subtasks[];
  tags: UpdateTaskMutation_task_tags[];
  skills: UpdateTaskMutation_task_skills[];
  assignees: UpdateTaskMutation_task_assignees[];
  owners: UpdateTaskMutation_task_owners[];
  reward: UpdateTaskMutation_task_reward | null;
  applications: UpdateTaskMutation_task_applications[];
  submissions: UpdateTaskMutation_task_submissions[];
  review: UpdateTaskMutation_task_review | null;
  reactions: UpdateTaskMutation_task_reactions[];
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
// GraphQL mutation operation: CreateTaskApplicationMutation
// ====================================================

export interface CreateTaskApplicationMutation_application_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskApplicationMutation_application_task_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface CreateTaskApplicationMutation_application_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface CreateTaskApplicationMutation_application_task_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface CreateTaskApplicationMutation_application_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskApplicationMutation_application_task_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskApplicationMutation_application_task_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateTaskApplicationMutation_application_task_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskApplicationMutation_application_task_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskApplicationMutation_application_task_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: CreateTaskApplicationMutation_application_task_reward_payments_payment_paymentMethod_network;
}

export interface CreateTaskApplicationMutation_application_task_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskApplicationMutation_application_task_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: CreateTaskApplicationMutation_application_task_reward_payments_payment_paymentMethod;
  network: CreateTaskApplicationMutation_application_task_reward_payments_payment_network;
}

export interface CreateTaskApplicationMutation_application_task_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: CreateTaskApplicationMutation_application_task_reward_payments_user;
  payment: CreateTaskApplicationMutation_application_task_reward_payments_payment;
}

export interface CreateTaskApplicationMutation_application_task_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: CreateTaskApplicationMutation_application_task_reward_token;
  payments: CreateTaskApplicationMutation_application_task_reward_payments[];
}

export interface CreateTaskApplicationMutation_application_task_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface CreateTaskApplicationMutation_application_task_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface CreateTaskApplicationMutation_application_task_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface CreateTaskApplicationMutation_application_task_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface CreateTaskApplicationMutation_application_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: CreateTaskApplicationMutation_application_task_subtasks[];
  tags: CreateTaskApplicationMutation_application_task_tags[];
  skills: CreateTaskApplicationMutation_application_task_skills[];
  assignees: CreateTaskApplicationMutation_application_task_assignees[];
  owners: CreateTaskApplicationMutation_application_task_owners[];
  reward: CreateTaskApplicationMutation_application_task_reward | null;
  applications: CreateTaskApplicationMutation_application_task_applications[];
  submissions: CreateTaskApplicationMutation_application_task_submissions[];
  review: CreateTaskApplicationMutation_application_task_review | null;
  reactions: CreateTaskApplicationMutation_application_task_reactions[];
}

export interface CreateTaskApplicationMutation_application {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  createdAt: Scalar.DateTime;
  userId: string;
  discordThreadUrl: string | null;
  user: CreateTaskApplicationMutation_application_user;
  task: CreateTaskApplicationMutation_application_task;
}

export interface CreateTaskApplicationMutation {
  application: CreateTaskApplicationMutation_application;
}

export interface CreateTaskApplicationMutationVariables {
  input: CreateTaskApplicationInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteTaskApplicationMutation
// ====================================================

export interface DeleteTaskApplicationMutation_task_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface DeleteTaskApplicationMutation_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface DeleteTaskApplicationMutation_task_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface DeleteTaskApplicationMutation_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface DeleteTaskApplicationMutation_task_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface DeleteTaskApplicationMutation_task_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface DeleteTaskApplicationMutation_task_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface DeleteTaskApplicationMutation_task_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface DeleteTaskApplicationMutation_task_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: DeleteTaskApplicationMutation_task_reward_payments_payment_paymentMethod_network;
}

export interface DeleteTaskApplicationMutation_task_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface DeleteTaskApplicationMutation_task_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: DeleteTaskApplicationMutation_task_reward_payments_payment_paymentMethod;
  network: DeleteTaskApplicationMutation_task_reward_payments_payment_network;
}

export interface DeleteTaskApplicationMutation_task_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: DeleteTaskApplicationMutation_task_reward_payments_user;
  payment: DeleteTaskApplicationMutation_task_reward_payments_payment;
}

export interface DeleteTaskApplicationMutation_task_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: DeleteTaskApplicationMutation_task_reward_token;
  payments: DeleteTaskApplicationMutation_task_reward_payments[];
}

export interface DeleteTaskApplicationMutation_task_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface DeleteTaskApplicationMutation_task_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface DeleteTaskApplicationMutation_task_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface DeleteTaskApplicationMutation_task_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface DeleteTaskApplicationMutation_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: DeleteTaskApplicationMutation_task_subtasks[];
  tags: DeleteTaskApplicationMutation_task_tags[];
  skills: DeleteTaskApplicationMutation_task_skills[];
  assignees: DeleteTaskApplicationMutation_task_assignees[];
  owners: DeleteTaskApplicationMutation_task_owners[];
  reward: DeleteTaskApplicationMutation_task_reward | null;
  applications: DeleteTaskApplicationMutation_task_applications[];
  submissions: DeleteTaskApplicationMutation_task_submissions[];
  review: DeleteTaskApplicationMutation_task_review | null;
  reactions: DeleteTaskApplicationMutation_task_reactions[];
}

export interface DeleteTaskApplicationMutation {
  task: DeleteTaskApplicationMutation_task;
}

export interface DeleteTaskApplicationMutationVariables {
  input: DeleteTaskApplicationInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTaskSubmissionMutation
// ====================================================

export interface CreateTaskSubmissionMutation_createTaskSubmission_task_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface CreateTaskSubmissionMutation_createTaskSubmission_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface CreateTaskSubmissionMutation_createTaskSubmission_task_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface CreateTaskSubmissionMutation_createTaskSubmission_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskSubmissionMutation_createTaskSubmission_task_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskSubmissionMutation_createTaskSubmission_task_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateTaskSubmissionMutation_createTaskSubmission_task_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskSubmissionMutation_createTaskSubmission_task_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskSubmissionMutation_createTaskSubmission_task_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: CreateTaskSubmissionMutation_createTaskSubmission_task_reward_payments_payment_paymentMethod_network;
}

export interface CreateTaskSubmissionMutation_createTaskSubmission_task_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskSubmissionMutation_createTaskSubmission_task_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: CreateTaskSubmissionMutation_createTaskSubmission_task_reward_payments_payment_paymentMethod;
  network: CreateTaskSubmissionMutation_createTaskSubmission_task_reward_payments_payment_network;
}

export interface CreateTaskSubmissionMutation_createTaskSubmission_task_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: CreateTaskSubmissionMutation_createTaskSubmission_task_reward_payments_user;
  payment: CreateTaskSubmissionMutation_createTaskSubmission_task_reward_payments_payment;
}

export interface CreateTaskSubmissionMutation_createTaskSubmission_task_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: CreateTaskSubmissionMutation_createTaskSubmission_task_reward_token;
  payments: CreateTaskSubmissionMutation_createTaskSubmission_task_reward_payments[];
}

export interface CreateTaskSubmissionMutation_createTaskSubmission_task_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface CreateTaskSubmissionMutation_createTaskSubmission_task_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface CreateTaskSubmissionMutation_createTaskSubmission_task_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface CreateTaskSubmissionMutation_createTaskSubmission_task_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface CreateTaskSubmissionMutation_createTaskSubmission_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: CreateTaskSubmissionMutation_createTaskSubmission_task_subtasks[];
  tags: CreateTaskSubmissionMutation_createTaskSubmission_task_tags[];
  skills: CreateTaskSubmissionMutation_createTaskSubmission_task_skills[];
  assignees: CreateTaskSubmissionMutation_createTaskSubmission_task_assignees[];
  owners: CreateTaskSubmissionMutation_createTaskSubmission_task_owners[];
  reward: CreateTaskSubmissionMutation_createTaskSubmission_task_reward | null;
  applications: CreateTaskSubmissionMutation_createTaskSubmission_task_applications[];
  submissions: CreateTaskSubmissionMutation_createTaskSubmission_task_submissions[];
  review: CreateTaskSubmissionMutation_createTaskSubmission_task_review | null;
  reactions: CreateTaskSubmissionMutation_createTaskSubmission_task_reactions[];
}

export interface CreateTaskSubmissionMutation_createTaskSubmission {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  task: CreateTaskSubmissionMutation_createTaskSubmission_task;
}

export interface CreateTaskSubmissionMutation {
  createTaskSubmission: CreateTaskSubmissionMutation_createTaskSubmission;
}

export interface CreateTaskSubmissionMutationVariables {
  input: CreateTaskSubmissionInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateTaskSubmissionMutation
// ====================================================

export interface UpdateTaskSubmissionMutation_updateTaskSubmission_task_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface UpdateTaskSubmissionMutation_updateTaskSubmission_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface UpdateTaskSubmissionMutation_updateTaskSubmission_task_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface UpdateTaskSubmissionMutation_updateTaskSubmission_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface UpdateTaskSubmissionMutation_updateTaskSubmission_task_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface UpdateTaskSubmissionMutation_updateTaskSubmission_task_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface UpdateTaskSubmissionMutation_updateTaskSubmission_task_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface UpdateTaskSubmissionMutation_updateTaskSubmission_task_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UpdateTaskSubmissionMutation_updateTaskSubmission_task_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: UpdateTaskSubmissionMutation_updateTaskSubmission_task_reward_payments_payment_paymentMethod_network;
}

export interface UpdateTaskSubmissionMutation_updateTaskSubmission_task_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UpdateTaskSubmissionMutation_updateTaskSubmission_task_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: UpdateTaskSubmissionMutation_updateTaskSubmission_task_reward_payments_payment_paymentMethod;
  network: UpdateTaskSubmissionMutation_updateTaskSubmission_task_reward_payments_payment_network;
}

export interface UpdateTaskSubmissionMutation_updateTaskSubmission_task_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: UpdateTaskSubmissionMutation_updateTaskSubmission_task_reward_payments_user;
  payment: UpdateTaskSubmissionMutation_updateTaskSubmission_task_reward_payments_payment;
}

export interface UpdateTaskSubmissionMutation_updateTaskSubmission_task_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: UpdateTaskSubmissionMutation_updateTaskSubmission_task_reward_token;
  payments: UpdateTaskSubmissionMutation_updateTaskSubmission_task_reward_payments[];
}

export interface UpdateTaskSubmissionMutation_updateTaskSubmission_task_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface UpdateTaskSubmissionMutation_updateTaskSubmission_task_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface UpdateTaskSubmissionMutation_updateTaskSubmission_task_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface UpdateTaskSubmissionMutation_updateTaskSubmission_task_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface UpdateTaskSubmissionMutation_updateTaskSubmission_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: UpdateTaskSubmissionMutation_updateTaskSubmission_task_subtasks[];
  tags: UpdateTaskSubmissionMutation_updateTaskSubmission_task_tags[];
  skills: UpdateTaskSubmissionMutation_updateTaskSubmission_task_skills[];
  assignees: UpdateTaskSubmissionMutation_updateTaskSubmission_task_assignees[];
  owners: UpdateTaskSubmissionMutation_updateTaskSubmission_task_owners[];
  reward: UpdateTaskSubmissionMutation_updateTaskSubmission_task_reward | null;
  applications: UpdateTaskSubmissionMutation_updateTaskSubmission_task_applications[];
  submissions: UpdateTaskSubmissionMutation_updateTaskSubmission_task_submissions[];
  review: UpdateTaskSubmissionMutation_updateTaskSubmission_task_review | null;
  reactions: UpdateTaskSubmissionMutation_updateTaskSubmission_task_reactions[];
}

export interface UpdateTaskSubmissionMutation_updateTaskSubmission {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  task: UpdateTaskSubmissionMutation_updateTaskSubmission_task;
}

export interface UpdateTaskSubmissionMutation {
  updateTaskSubmission: UpdateTaskSubmissionMutation_updateTaskSubmission;
}

export interface UpdateTaskSubmissionMutationVariables {
  input: UpdateTaskSubmissionInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteTaskMutation
// ====================================================

export interface DeleteTaskMutation_task {
  __typename: "Task";
  id: Scalar.UUID;
  deletedAt: Scalar.DateTime | null;
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
// GraphQL mutation operation: CreateTaskReactionMutation
// ====================================================

export interface CreateTaskReactionMutation_task_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface CreateTaskReactionMutation_task {
  __typename: "Task";
  id: Scalar.UUID;
  reactions: CreateTaskReactionMutation_task_reactions[];
}

export interface CreateTaskReactionMutation {
  task: CreateTaskReactionMutation_task;
}

export interface CreateTaskReactionMutationVariables {
  input: TaskReactionInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteTaskReactionMutation
// ====================================================

export interface DeleteTaskReactionMutation_task_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface DeleteTaskReactionMutation_task {
  __typename: "Task";
  id: Scalar.UUID;
  reactions: DeleteTaskReactionMutation_task_reactions[];
}

export interface DeleteTaskReactionMutation {
  task: DeleteTaskReactionMutation_task;
}

export interface DeleteTaskReactionMutationVariables {
  input: TaskReactionInput;
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
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
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
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
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
// GraphQL mutation operation: UpdateTaskTagMutation
// ====================================================

export interface UpdateTaskTagMutation_taskTag_project_taskTags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface UpdateTaskTagMutation_taskTag_project {
  __typename: "Project";
  id: Scalar.UUID;
  taskTags: UpdateTaskTagMutation_taskTag_project_taskTags[];
}

export interface UpdateTaskTagMutation_taskTag {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  project: UpdateTaskTagMutation_taskTag_project;
}

export interface UpdateTaskTagMutation {
  taskTag: UpdateTaskTagMutation_taskTag;
}

export interface UpdateTaskTagMutationVariables {
  input: UpdateTaskTagInput;
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
  type: string;
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
  type: string;
  config: Scalar.JSONObject;
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
// GraphQL mutation operation: CreateOrganizationIntegrationMutation
// ====================================================

export interface CreateOrganizationIntegrationMutation_integration_organization_integrations {
  __typename: "OrganizationIntegration";
  id: Scalar.UUID;
  type: OrganizationIntegrationType;
  config: Scalar.JSONObject | null;
}

export interface CreateOrganizationIntegrationMutation_integration_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  integrations: CreateOrganizationIntegrationMutation_integration_organization_integrations[];
}

export interface CreateOrganizationIntegrationMutation_integration {
  __typename: "OrganizationIntegration";
  id: Scalar.UUID;
  type: OrganizationIntegrationType;
  config: Scalar.JSONObject | null;
  organization: CreateOrganizationIntegrationMutation_integration_organization;
}

export interface CreateOrganizationIntegrationMutation {
  integration: CreateOrganizationIntegrationMutation_integration;
}

export interface CreateOrganizationIntegrationMutationVariables {
  input: CreateOrganizationIntegrationInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetUserDetailMutation
// ====================================================

export interface SetUserDetailMutation_organization_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface SetUserDetailMutation_organization {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
  details: SetUserDetailMutation_organization_details[];
}

export interface SetUserDetailMutation {
  organization: SetUserDetailMutation_organization;
}

export interface SetUserDetailMutationVariables {
  input: SetUserDetailInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetOrganizationDetailMutation
// ====================================================

export interface SetOrganizationDetailMutation_organization_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface SetOrganizationDetailMutation_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
  details: SetOrganizationDetailMutation_organization_details[];
}

export interface SetOrganizationDetailMutation {
  organization: SetOrganizationDetailMutation_organization;
}

export interface SetOrganizationDetailMutationVariables {
  input: SetOrganizationDetailInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateProjectTokenGateMutation
// ====================================================

export interface CreateProjectTokenGateMutation_tokenGate_project_tokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateProjectTokenGateMutation_tokenGate_project_tokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: CreateProjectTokenGateMutation_tokenGate_project_tokenGates_token_network;
}

export interface CreateProjectTokenGateMutation_tokenGate_project_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  token: CreateProjectTokenGateMutation_tokenGate_project_tokenGates_token;
}

export interface CreateProjectTokenGateMutation_tokenGate_project {
  __typename: "Project";
  id: Scalar.UUID;
  tokenGates: CreateProjectTokenGateMutation_tokenGate_project_tokenGates[];
}

export interface CreateProjectTokenGateMutation_tokenGate {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  project: CreateProjectTokenGateMutation_tokenGate_project;
}

export interface CreateProjectTokenGateMutation {
  tokenGate: CreateProjectTokenGateMutation_tokenGate;
}

export interface CreateProjectTokenGateMutationVariables {
  input: ProjectTokenGateInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteProjectTokenGateMutation
// ====================================================

export interface DeleteProjectTokenGateMutation_tokenGate_tokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface DeleteProjectTokenGateMutation_tokenGate_tokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: DeleteProjectTokenGateMutation_tokenGate_tokenGates_token_network;
}

export interface DeleteProjectTokenGateMutation_tokenGate_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  token: DeleteProjectTokenGateMutation_tokenGate_tokenGates_token;
}

export interface DeleteProjectTokenGateMutation_tokenGate {
  __typename: "Project";
  id: Scalar.UUID;
  tokenGates: DeleteProjectTokenGateMutation_tokenGate_tokenGates[];
}

export interface DeleteProjectTokenGateMutation {
  tokenGate: DeleteProjectTokenGateMutation_tokenGate;
}

export interface DeleteProjectTokenGateMutationVariables {
  input: ProjectTokenGateInput;
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
  permalink: string;
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

export interface AcceptInviteMutation_invite_organization_users {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface AcceptInviteMutation_invite_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  users: AcceptInviteMutation_invite_organization_users[];
}

export interface AcceptInviteMutation_invite_project_organization_users {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface AcceptInviteMutation_invite_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  users: AcceptInviteMutation_invite_project_organization_users[];
}

export interface AcceptInviteMutation_invite_project {
  __typename: "Project";
  id: Scalar.UUID;
  name: string;
  organization: AcceptInviteMutation_invite_project_organization;
}

export interface AcceptInviteMutation_invite {
  __typename: "Invite";
  id: Scalar.UUID;
  organization: AcceptInviteMutation_invite_organization | null;
  project: AcceptInviteMutation_invite_project | null;
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
// GraphQL mutation operation: JoinProjectWithTokenMutation
// ====================================================

export interface JoinProjectWithTokenMutation_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
}

export interface JoinProjectWithTokenMutation {
  project: JoinProjectWithTokenMutation_project;
}

export interface JoinProjectWithTokenMutationVariables {
  projectId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreatePaymentMethodMutation
// ====================================================

export interface CreatePaymentMethodMutation_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreatePaymentMethodMutation_paymentMethod_project_paymentMethods_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreatePaymentMethodMutation_paymentMethod_project_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: CreatePaymentMethodMutation_paymentMethod_project_paymentMethods_network;
}

export interface CreatePaymentMethodMutation_paymentMethod_project {
  __typename: "Project";
  id: Scalar.UUID;
  paymentMethods: CreatePaymentMethodMutation_paymentMethod_project_paymentMethods[];
}

export interface CreatePaymentMethodMutation_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: CreatePaymentMethodMutation_paymentMethod_network;
  project: CreatePaymentMethodMutation_paymentMethod_project | null;
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
// GraphQL mutation operation: CreatePaymentTokenMutation
// ====================================================

export interface CreatePaymentTokenMutation_token_network_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreatePaymentTokenMutation_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
  tokens: CreatePaymentTokenMutation_token_network_tokens[];
}

export interface CreatePaymentTokenMutation_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: CreatePaymentTokenMutation_token_network;
}

export interface CreatePaymentTokenMutation {
  token: CreatePaymentTokenMutation_token;
}

export interface CreatePaymentTokenMutationVariables {
  input: CreatePaymentTokenInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdatePaymentMethodMutation
// ====================================================

export interface UpdatePaymentMethodMutation_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UpdatePaymentMethodMutation_paymentMethod_project_paymentMethods_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UpdatePaymentMethodMutation_paymentMethod_project_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: UpdatePaymentMethodMutation_paymentMethod_project_paymentMethods_network;
}

export interface UpdatePaymentMethodMutation_paymentMethod_project {
  __typename: "Project";
  id: Scalar.UUID;
  paymentMethods: UpdatePaymentMethodMutation_paymentMethod_project_paymentMethods[];
}

export interface UpdatePaymentMethodMutation_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: UpdatePaymentMethodMutation_paymentMethod_network;
  project: UpdatePaymentMethodMutation_paymentMethod_project | null;
}

export interface UpdatePaymentMethodMutation {
  paymentMethod: UpdatePaymentMethodMutation_paymentMethod;
}

export interface UpdatePaymentMethodMutationVariables {
  input: UpdatePaymentMethodInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateProjectIntegrationMutation
// ====================================================

export interface UpdateProjectIntegrationMutation_integration_project_integrations {
  __typename: "ProjectIntegration";
  id: Scalar.UUID;
  type: string;
  config: Scalar.JSONObject;
}

export interface UpdateProjectIntegrationMutation_integration_project {
  __typename: "Project";
  id: Scalar.UUID;
  integrations: UpdateProjectIntegrationMutation_integration_project_integrations[];
}

export interface UpdateProjectIntegrationMutation_integration {
  __typename: "ProjectIntegration";
  id: Scalar.UUID;
  type: string;
  config: Scalar.JSONObject;
  project: UpdateProjectIntegrationMutation_integration_project;
}

export interface UpdateProjectIntegrationMutation {
  integration: UpdateProjectIntegrationMutation_integration;
}

export interface UpdateProjectIntegrationMutationVariables {
  input: UpdateProjectIntegrationInput;
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
// GraphQL mutation operation: CreateTaskPaymentsMutation
// ====================================================

export interface CreateTaskPaymentsMutation_tasks_subtasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: CreateTaskPaymentsMutation_tasks_subtasks_reward_payments_payment_paymentMethod_network;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: CreateTaskPaymentsMutation_tasks_subtasks_reward_payments_payment_paymentMethod;
  network: CreateTaskPaymentsMutation_tasks_subtasks_reward_payments_payment_network;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: CreateTaskPaymentsMutation_tasks_subtasks_reward_payments_user;
  payment: CreateTaskPaymentsMutation_tasks_subtasks_reward_payments_payment;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: CreateTaskPaymentsMutation_tasks_subtasks_reward_token;
  payments: CreateTaskPaymentsMutation_tasks_subtasks_reward_payments[];
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
  description: string | null;
  priority: TaskPriority;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: CreateTaskPaymentsMutation_tasks_subtasks_subtasks[];
  tags: CreateTaskPaymentsMutation_tasks_subtasks_tags[];
  skills: CreateTaskPaymentsMutation_tasks_subtasks_skills[];
  assignees: CreateTaskPaymentsMutation_tasks_subtasks_assignees[];
  owners: CreateTaskPaymentsMutation_tasks_subtasks_owners[];
  reward: CreateTaskPaymentsMutation_tasks_subtasks_reward | null;
  applications: CreateTaskPaymentsMutation_tasks_subtasks_applications[];
  submissions: CreateTaskPaymentsMutation_tasks_subtasks_submissions[];
  review: CreateTaskPaymentsMutation_tasks_subtasks_review | null;
  reactions: CreateTaskPaymentsMutation_tasks_subtasks_reactions[];
}

export interface CreateTaskPaymentsMutation_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface CreateTaskPaymentsMutation_tasks_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface CreateTaskPaymentsMutation_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskPaymentsMutation_tasks_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskPaymentsMutation_tasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateTaskPaymentsMutation_tasks_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskPaymentsMutation_tasks_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskPaymentsMutation_tasks_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: CreateTaskPaymentsMutation_tasks_reward_payments_payment_paymentMethod_network;
}

export interface CreateTaskPaymentsMutation_tasks_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskPaymentsMutation_tasks_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: CreateTaskPaymentsMutation_tasks_reward_payments_payment_paymentMethod;
  network: CreateTaskPaymentsMutation_tasks_reward_payments_payment_network;
}

export interface CreateTaskPaymentsMutation_tasks_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: CreateTaskPaymentsMutation_tasks_reward_payments_user;
  payment: CreateTaskPaymentsMutation_tasks_reward_payments_payment;
}

export interface CreateTaskPaymentsMutation_tasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: CreateTaskPaymentsMutation_tasks_reward_token;
  payments: CreateTaskPaymentsMutation_tasks_reward_payments[];
}

export interface CreateTaskPaymentsMutation_tasks_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskPaymentsMutation_tasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  createdAt: Scalar.DateTime;
  discordThreadUrl: string | null;
  user: CreateTaskPaymentsMutation_tasks_applications_user;
}

export interface CreateTaskPaymentsMutation_tasks_submissions_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskPaymentsMutation_tasks_submissions_approver {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskPaymentsMutation_tasks_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
  createdAt: Scalar.DateTime;
  taskId: string;
  user: CreateTaskPaymentsMutation_tasks_submissions_user;
  approver: CreateTaskPaymentsMutation_tasks_submissions_approver | null;
}

export interface CreateTaskPaymentsMutation_tasks_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface CreateTaskPaymentsMutation_tasks_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface CreateTaskPaymentsMutation_tasks_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface CreateTaskPaymentsMutation_tasks_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  organization: CreateTaskPaymentsMutation_tasks_project_organization;
}

export interface CreateTaskPaymentsMutation_tasks_parentTask {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
}

export interface CreateTaskPaymentsMutation_tasks_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskPaymentsMutation_tasks_githubPullRequests {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatus;
  number: number;
  branchName: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface CreateTaskPaymentsMutation_tasks_githubBranches {
  __typename: "GithubBranch";
  id: Scalar.UUID;
  name: string;
  link: string;
  repo: string;
  organization: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
}

export interface CreateTaskPaymentsMutation_tasks_githubIssue {
  __typename: "GithubIssue";
  id: Scalar.UUID;
  number: number;
  link: string | null;
}

export interface CreateTaskPaymentsMutation_tasks_nfts_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskPaymentsMutation_tasks_nfts_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: CreateTaskPaymentsMutation_tasks_nfts_payment_paymentMethod_network;
}

export interface CreateTaskPaymentsMutation_tasks_nfts_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskPaymentsMutation_tasks_nfts_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: CreateTaskPaymentsMutation_tasks_nfts_payment_paymentMethod;
  network: CreateTaskPaymentsMutation_tasks_nfts_payment_network;
}

export interface CreateTaskPaymentsMutation_tasks_nfts {
  __typename: "TaskNFT";
  id: Scalar.UUID;
  tokenId: number;
  createdAt: Scalar.DateTime;
  contractAddress: string;
  explorerUrl: string;
  payment: CreateTaskPaymentsMutation_tasks_nfts_payment;
}

export interface CreateTaskPaymentsMutation_tasks_auditLog_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTaskPaymentsMutation_tasks_auditLog {
  __typename: "AuditLogEvent";
  id: Scalar.UUID;
  createdAt: Scalar.DateTime;
  user: CreateTaskPaymentsMutation_tasks_auditLog_user | null;
  sessionId: Scalar.UUID | null;
  diff: Scalar.JSONObject[];
}

export interface CreateTaskPaymentsMutation_tasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: CreateTaskPaymentsMutation_tasks_subtasks[];
  tags: CreateTaskPaymentsMutation_tasks_tags[];
  skills: CreateTaskPaymentsMutation_tasks_skills[];
  assignees: CreateTaskPaymentsMutation_tasks_assignees[];
  owners: CreateTaskPaymentsMutation_tasks_owners[];
  reward: CreateTaskPaymentsMutation_tasks_reward | null;
  applications: CreateTaskPaymentsMutation_tasks_applications[];
  submissions: CreateTaskPaymentsMutation_tasks_submissions[];
  review: CreateTaskPaymentsMutation_tasks_review | null;
  reactions: CreateTaskPaymentsMutation_tasks_reactions[];
  gitBranchName: string;
  permalink: string;
  project: CreateTaskPaymentsMutation_tasks_project;
  parentTask: CreateTaskPaymentsMutation_tasks_parentTask | null;
  creator: CreateTaskPaymentsMutation_tasks_creator | null;
  githubPullRequests: CreateTaskPaymentsMutation_tasks_githubPullRequests[];
  githubBranches: CreateTaskPaymentsMutation_tasks_githubBranches[];
  githubIssue: CreateTaskPaymentsMutation_tasks_githubIssue | null;
  nfts: CreateTaskPaymentsMutation_tasks_nfts[];
  auditLog: CreateTaskPaymentsMutation_tasks_auditLog[];
}

export interface CreateTaskPaymentsMutation {
  tasks: CreateTaskPaymentsMutation_tasks[];
}

export interface CreateTaskPaymentsMutationVariables {
  input: CreateTaskPaymentsInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ClearTaskPaymentsMutation
// ====================================================

export interface ClearTaskPaymentsMutation_tasks_subtasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface ClearTaskPaymentsMutation_tasks_subtasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface ClearTaskPaymentsMutation_tasks_subtasks_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface ClearTaskPaymentsMutation_tasks_subtasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface ClearTaskPaymentsMutation_tasks_subtasks_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface ClearTaskPaymentsMutation_tasks_subtasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface ClearTaskPaymentsMutation_tasks_subtasks_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface ClearTaskPaymentsMutation_tasks_subtasks_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface ClearTaskPaymentsMutation_tasks_subtasks_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: ClearTaskPaymentsMutation_tasks_subtasks_reward_payments_payment_paymentMethod_network;
}

export interface ClearTaskPaymentsMutation_tasks_subtasks_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface ClearTaskPaymentsMutation_tasks_subtasks_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: ClearTaskPaymentsMutation_tasks_subtasks_reward_payments_payment_paymentMethod;
  network: ClearTaskPaymentsMutation_tasks_subtasks_reward_payments_payment_network;
}

export interface ClearTaskPaymentsMutation_tasks_subtasks_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: ClearTaskPaymentsMutation_tasks_subtasks_reward_payments_user;
  payment: ClearTaskPaymentsMutation_tasks_subtasks_reward_payments_payment;
}

export interface ClearTaskPaymentsMutation_tasks_subtasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: ClearTaskPaymentsMutation_tasks_subtasks_reward_token;
  payments: ClearTaskPaymentsMutation_tasks_subtasks_reward_payments[];
}

export interface ClearTaskPaymentsMutation_tasks_subtasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface ClearTaskPaymentsMutation_tasks_subtasks_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface ClearTaskPaymentsMutation_tasks_subtasks_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface ClearTaskPaymentsMutation_tasks_subtasks_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface ClearTaskPaymentsMutation_tasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
  description: string | null;
  priority: TaskPriority;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: ClearTaskPaymentsMutation_tasks_subtasks_subtasks[];
  tags: ClearTaskPaymentsMutation_tasks_subtasks_tags[];
  skills: ClearTaskPaymentsMutation_tasks_subtasks_skills[];
  assignees: ClearTaskPaymentsMutation_tasks_subtasks_assignees[];
  owners: ClearTaskPaymentsMutation_tasks_subtasks_owners[];
  reward: ClearTaskPaymentsMutation_tasks_subtasks_reward | null;
  applications: ClearTaskPaymentsMutation_tasks_subtasks_applications[];
  submissions: ClearTaskPaymentsMutation_tasks_subtasks_submissions[];
  review: ClearTaskPaymentsMutation_tasks_subtasks_review | null;
  reactions: ClearTaskPaymentsMutation_tasks_subtasks_reactions[];
}

export interface ClearTaskPaymentsMutation_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface ClearTaskPaymentsMutation_tasks_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface ClearTaskPaymentsMutation_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface ClearTaskPaymentsMutation_tasks_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface ClearTaskPaymentsMutation_tasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface ClearTaskPaymentsMutation_tasks_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface ClearTaskPaymentsMutation_tasks_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface ClearTaskPaymentsMutation_tasks_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: ClearTaskPaymentsMutation_tasks_reward_payments_payment_paymentMethod_network;
}

export interface ClearTaskPaymentsMutation_tasks_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface ClearTaskPaymentsMutation_tasks_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: ClearTaskPaymentsMutation_tasks_reward_payments_payment_paymentMethod;
  network: ClearTaskPaymentsMutation_tasks_reward_payments_payment_network;
}

export interface ClearTaskPaymentsMutation_tasks_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: ClearTaskPaymentsMutation_tasks_reward_payments_user;
  payment: ClearTaskPaymentsMutation_tasks_reward_payments_payment;
}

export interface ClearTaskPaymentsMutation_tasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: ClearTaskPaymentsMutation_tasks_reward_token;
  payments: ClearTaskPaymentsMutation_tasks_reward_payments[];
}

export interface ClearTaskPaymentsMutation_tasks_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface ClearTaskPaymentsMutation_tasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  createdAt: Scalar.DateTime;
  discordThreadUrl: string | null;
  user: ClearTaskPaymentsMutation_tasks_applications_user;
}

export interface ClearTaskPaymentsMutation_tasks_submissions_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface ClearTaskPaymentsMutation_tasks_submissions_approver {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface ClearTaskPaymentsMutation_tasks_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
  createdAt: Scalar.DateTime;
  taskId: string;
  user: ClearTaskPaymentsMutation_tasks_submissions_user;
  approver: ClearTaskPaymentsMutation_tasks_submissions_approver | null;
}

export interface ClearTaskPaymentsMutation_tasks_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface ClearTaskPaymentsMutation_tasks_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface ClearTaskPaymentsMutation_tasks_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface ClearTaskPaymentsMutation_tasks_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  organization: ClearTaskPaymentsMutation_tasks_project_organization;
}

export interface ClearTaskPaymentsMutation_tasks_parentTask {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
}

export interface ClearTaskPaymentsMutation_tasks_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface ClearTaskPaymentsMutation_tasks_githubPullRequests {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatus;
  number: number;
  branchName: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface ClearTaskPaymentsMutation_tasks_githubBranches {
  __typename: "GithubBranch";
  id: Scalar.UUID;
  name: string;
  link: string;
  repo: string;
  organization: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
}

export interface ClearTaskPaymentsMutation_tasks_githubIssue {
  __typename: "GithubIssue";
  id: Scalar.UUID;
  number: number;
  link: string | null;
}

export interface ClearTaskPaymentsMutation_tasks_nfts_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface ClearTaskPaymentsMutation_tasks_nfts_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: ClearTaskPaymentsMutation_tasks_nfts_payment_paymentMethod_network;
}

export interface ClearTaskPaymentsMutation_tasks_nfts_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface ClearTaskPaymentsMutation_tasks_nfts_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: ClearTaskPaymentsMutation_tasks_nfts_payment_paymentMethod;
  network: ClearTaskPaymentsMutation_tasks_nfts_payment_network;
}

export interface ClearTaskPaymentsMutation_tasks_nfts {
  __typename: "TaskNFT";
  id: Scalar.UUID;
  tokenId: number;
  createdAt: Scalar.DateTime;
  contractAddress: string;
  explorerUrl: string;
  payment: ClearTaskPaymentsMutation_tasks_nfts_payment;
}

export interface ClearTaskPaymentsMutation_tasks_auditLog_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface ClearTaskPaymentsMutation_tasks_auditLog {
  __typename: "AuditLogEvent";
  id: Scalar.UUID;
  createdAt: Scalar.DateTime;
  user: ClearTaskPaymentsMutation_tasks_auditLog_user | null;
  sessionId: Scalar.UUID | null;
  diff: Scalar.JSONObject[];
}

export interface ClearTaskPaymentsMutation_tasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: ClearTaskPaymentsMutation_tasks_subtasks[];
  tags: ClearTaskPaymentsMutation_tasks_tags[];
  skills: ClearTaskPaymentsMutation_tasks_skills[];
  assignees: ClearTaskPaymentsMutation_tasks_assignees[];
  owners: ClearTaskPaymentsMutation_tasks_owners[];
  reward: ClearTaskPaymentsMutation_tasks_reward | null;
  applications: ClearTaskPaymentsMutation_tasks_applications[];
  submissions: ClearTaskPaymentsMutation_tasks_submissions[];
  review: ClearTaskPaymentsMutation_tasks_review | null;
  reactions: ClearTaskPaymentsMutation_tasks_reactions[];
  gitBranchName: string;
  permalink: string;
  project: ClearTaskPaymentsMutation_tasks_project;
  parentTask: ClearTaskPaymentsMutation_tasks_parentTask | null;
  creator: ClearTaskPaymentsMutation_tasks_creator | null;
  githubPullRequests: ClearTaskPaymentsMutation_tasks_githubPullRequests[];
  githubBranches: ClearTaskPaymentsMutation_tasks_githubBranches[];
  githubIssue: ClearTaskPaymentsMutation_tasks_githubIssue | null;
  nfts: ClearTaskPaymentsMutation_tasks_nfts[];
  auditLog: ClearTaskPaymentsMutation_tasks_auditLog[];
}

export interface ClearTaskPaymentsMutation {
  tasks: ClearTaskPaymentsMutation_tasks[];
}

export interface ClearTaskPaymentsMutationVariables {
  paymentId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: StartWalletConnectSessionMutation
// ====================================================

export interface StartWalletConnectSessionMutation {
  connectorUri: string;
}

export interface StartWalletConnectSessionMutationVariables {
  sessionId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CheckWalletConnectSessionMutation
// ====================================================

export interface CheckWalletConnectSessionMutation_threepid {
  __typename: "Threepid";
  id: string;
}

export interface CheckWalletConnectSessionMutation {
  threepid: CheckWalletConnectSessionMutation_threepid | null;
}

export interface CheckWalletConnectSessionMutationVariables {
  sessionId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTasksFromGithubIssuesMutation
// ====================================================

export interface CreateTasksFromGithubIssuesMutation_project_tasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: CreateTasksFromGithubIssuesMutation_project_tasks_reward_payments_payment_paymentMethod_network;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: CreateTasksFromGithubIssuesMutation_project_tasks_reward_payments_payment_paymentMethod;
  network: CreateTasksFromGithubIssuesMutation_project_tasks_reward_payments_payment_network;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: CreateTasksFromGithubIssuesMutation_project_tasks_reward_payments_user;
  payment: CreateTasksFromGithubIssuesMutation_project_tasks_reward_payments_payment;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: CreateTasksFromGithubIssuesMutation_project_tasks_reward_token;
  payments: CreateTasksFromGithubIssuesMutation_project_tasks_reward_payments[];
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: CreateTasksFromGithubIssuesMutation_project_tasks_subtasks[];
  tags: CreateTasksFromGithubIssuesMutation_project_tasks_tags[];
  skills: CreateTasksFromGithubIssuesMutation_project_tasks_skills[];
  assignees: CreateTasksFromGithubIssuesMutation_project_tasks_assignees[];
  owners: CreateTasksFromGithubIssuesMutation_project_tasks_owners[];
  reward: CreateTasksFromGithubIssuesMutation_project_tasks_reward | null;
  applications: CreateTasksFromGithubIssuesMutation_project_tasks_applications[];
  submissions: CreateTasksFromGithubIssuesMutation_project_tasks_submissions[];
  review: CreateTasksFromGithubIssuesMutation_project_tasks_review | null;
  reactions: CreateTasksFromGithubIssuesMutation_project_tasks_reactions[];
}

export interface CreateTasksFromGithubIssuesMutation_project {
  __typename: "Project";
  id: Scalar.UUID;
  tasks: CreateTasksFromGithubIssuesMutation_project_tasks[];
}

export interface CreateTasksFromGithubIssuesMutation {
  project: CreateTasksFromGithubIssuesMutation_project;
}

export interface CreateTasksFromGithubIssuesMutationVariables {
  projectId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PostFeedbackToDiscordMutation
// ====================================================

export interface PostFeedbackToDiscordMutation {
  messageSent: boolean;
}

export interface PostFeedbackToDiscordMutationVariables {
  feedbackContent: string;
  discordUsername?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTaskDiscordLinkMutation
// ====================================================

export interface CreateTaskDiscordLinkMutation {
  link: string;
}

export interface CreateTaskDiscordLinkMutationVariables {
  taskId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateProjectsFromNotionMutation
// ====================================================

export interface CreateProjectsFromNotionMutation_organization_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  taskCount: number;
  doneTaskCount: number;
  openBountyTaskCount: number;
}

export interface CreateProjectsFromNotionMutation_organization_workspaces {
  __typename: "Workspace";
  id: Scalar.UUID;
  name: string;
  sortKey: string;
}

export interface CreateProjectsFromNotionMutation_organization_tags {
  __typename: "OrganizationTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface CreateProjectsFromNotionMutation_organization_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface CreateProjectsFromNotionMutation_organization_projectTokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateProjectsFromNotionMutation_organization_projectTokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: CreateProjectsFromNotionMutation_organization_projectTokenGates_token_network;
}

export interface CreateProjectsFromNotionMutation_organization_projectTokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  token: CreateProjectsFromNotionMutation_organization_projectTokenGates_token;
}

export interface CreateProjectsFromNotionMutation_organization_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface CreateProjectsFromNotionMutation_organization_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface CreateProjectsFromNotionMutation_organization_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: CreateProjectsFromNotionMutation_organization_taskViews_filters[];
  sortBys: CreateProjectsFromNotionMutation_organization_taskViews_sortBys[];
}

export interface CreateProjectsFromNotionMutation_organization_fundingSessions_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateProjectsFromNotionMutation_organization_fundingSessions {
  __typename: "FundingSession";
  id: Scalar.UUID;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  closedAt: Scalar.DateTime | null;
  amount: string;
  permalink: string;
  organizationId: string;
  token: CreateProjectsFromNotionMutation_organization_fundingSessions_token;
}

export interface CreateProjectsFromNotionMutation_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
  description: string | null;
  projects: CreateProjectsFromNotionMutation_organization_projects[];
  workspaces: CreateProjectsFromNotionMutation_organization_workspaces[];
  tags: CreateProjectsFromNotionMutation_organization_tags[];
  details: CreateProjectsFromNotionMutation_organization_details[];
  projectTokenGates: CreateProjectsFromNotionMutation_organization_projectTokenGates[];
  taskViews: CreateProjectsFromNotionMutation_organization_taskViews[];
  fundingSessions: CreateProjectsFromNotionMutation_organization_fundingSessions[];
}

export interface CreateProjectsFromNotionMutation {
  organization: CreateProjectsFromNotionMutation_organization;
}

export interface CreateProjectsFromNotionMutationVariables {
  input: CreateProjectsFromNotionInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateProjectsFromTrelloMutation
// ====================================================

export interface CreateProjectsFromTrelloMutation_organization_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  taskCount: number;
  doneTaskCount: number;
  openBountyTaskCount: number;
}

export interface CreateProjectsFromTrelloMutation_organization_workspaces {
  __typename: "Workspace";
  id: Scalar.UUID;
  name: string;
  sortKey: string;
}

export interface CreateProjectsFromTrelloMutation_organization_tags {
  __typename: "OrganizationTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface CreateProjectsFromTrelloMutation_organization_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface CreateProjectsFromTrelloMutation_organization_projectTokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateProjectsFromTrelloMutation_organization_projectTokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: CreateProjectsFromTrelloMutation_organization_projectTokenGates_token_network;
}

export interface CreateProjectsFromTrelloMutation_organization_projectTokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  token: CreateProjectsFromTrelloMutation_organization_projectTokenGates_token;
}

export interface CreateProjectsFromTrelloMutation_organization_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface CreateProjectsFromTrelloMutation_organization_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface CreateProjectsFromTrelloMutation_organization_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: CreateProjectsFromTrelloMutation_organization_taskViews_filters[];
  sortBys: CreateProjectsFromTrelloMutation_organization_taskViews_sortBys[];
}

export interface CreateProjectsFromTrelloMutation_organization_fundingSessions_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateProjectsFromTrelloMutation_organization_fundingSessions {
  __typename: "FundingSession";
  id: Scalar.UUID;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  closedAt: Scalar.DateTime | null;
  amount: string;
  permalink: string;
  organizationId: string;
  token: CreateProjectsFromTrelloMutation_organization_fundingSessions_token;
}

export interface CreateProjectsFromTrelloMutation_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
  description: string | null;
  projects: CreateProjectsFromTrelloMutation_organization_projects[];
  workspaces: CreateProjectsFromTrelloMutation_organization_workspaces[];
  tags: CreateProjectsFromTrelloMutation_organization_tags[];
  details: CreateProjectsFromTrelloMutation_organization_details[];
  projectTokenGates: CreateProjectsFromTrelloMutation_organization_projectTokenGates[];
  taskViews: CreateProjectsFromTrelloMutation_organization_taskViews[];
  fundingSessions: CreateProjectsFromTrelloMutation_organization_fundingSessions[];
}

export interface CreateProjectsFromTrelloMutation {
  organization: CreateProjectsFromTrelloMutation_organization;
}

export interface CreateProjectsFromTrelloMutationVariables {
  input: CreateProjectsFromTrelloInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateProjectsFromGithubMutation
// ====================================================

export interface CreateProjectsFromGithubMutation_organization_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  taskCount: number;
  doneTaskCount: number;
  openBountyTaskCount: number;
}

export interface CreateProjectsFromGithubMutation_organization_workspaces {
  __typename: "Workspace";
  id: Scalar.UUID;
  name: string;
  sortKey: string;
}

export interface CreateProjectsFromGithubMutation_organization_tags {
  __typename: "OrganizationTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface CreateProjectsFromGithubMutation_organization_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface CreateProjectsFromGithubMutation_organization_projectTokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateProjectsFromGithubMutation_organization_projectTokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: CreateProjectsFromGithubMutation_organization_projectTokenGates_token_network;
}

export interface CreateProjectsFromGithubMutation_organization_projectTokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  token: CreateProjectsFromGithubMutation_organization_projectTokenGates_token;
}

export interface CreateProjectsFromGithubMutation_organization_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface CreateProjectsFromGithubMutation_organization_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface CreateProjectsFromGithubMutation_organization_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: CreateProjectsFromGithubMutation_organization_taskViews_filters[];
  sortBys: CreateProjectsFromGithubMutation_organization_taskViews_sortBys[];
}

export interface CreateProjectsFromGithubMutation_organization_fundingSessions_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateProjectsFromGithubMutation_organization_fundingSessions {
  __typename: "FundingSession";
  id: Scalar.UUID;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  closedAt: Scalar.DateTime | null;
  amount: string;
  permalink: string;
  organizationId: string;
  token: CreateProjectsFromGithubMutation_organization_fundingSessions_token;
}

export interface CreateProjectsFromGithubMutation_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
  description: string | null;
  projects: CreateProjectsFromGithubMutation_organization_projects[];
  workspaces: CreateProjectsFromGithubMutation_organization_workspaces[];
  tags: CreateProjectsFromGithubMutation_organization_tags[];
  details: CreateProjectsFromGithubMutation_organization_details[];
  projectTokenGates: CreateProjectsFromGithubMutation_organization_projectTokenGates[];
  taskViews: CreateProjectsFromGithubMutation_organization_taskViews[];
  fundingSessions: CreateProjectsFromGithubMutation_organization_fundingSessions[];
}

export interface CreateProjectsFromGithubMutation {
  organization: CreateProjectsFromGithubMutation_organization;
}

export interface CreateProjectsFromGithubMutationVariables {
  input: CreateProjectsFromGithubInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddUserToDiscordGuildMutation
// ====================================================

export interface AddUserToDiscordGuildMutation {
  added: boolean;
}

export interface AddUserToDiscordGuildMutationVariables {
  organizationId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateOrganizationRolesDiscordMutation
// ====================================================

export interface UpdateOrganizationRolesDiscordMutation_organization_roles_rules {
  __typename: "Rule";
  id: Scalar.UUID;
  permission: RulePermission;
  inverted: boolean;
  taskId: string | null;
  projectId: string | null;
  fundingSessionId: string | null;
}

export interface UpdateOrganizationRolesDiscordMutation_organization_roles {
  __typename: "Role";
  id: Scalar.UUID;
  name: string;
  color: string;
  source: RoleSource | null;
  fallback: boolean;
  userId: string | null;
  organizationId: string;
  rules: UpdateOrganizationRolesDiscordMutation_organization_roles_rules[];
}

export interface UpdateOrganizationRolesDiscordMutation_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  roles: UpdateOrganizationRolesDiscordMutation_organization_roles[];
}

export interface UpdateOrganizationRolesDiscordMutation {
  organization: UpdateOrganizationRolesDiscordMutation_organization;
}

export interface UpdateOrganizationRolesDiscordMutationVariables {
  organizationId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddRoleMutation
// ====================================================

export interface AddRoleMutation_addRole_roles {
  __typename: "Role";
  id: Scalar.UUID;
  name: string;
  color: string;
  source: RoleSource | null;
  fallback: boolean;
  userId: string | null;
  organizationId: string;
}

export interface AddRoleMutation_addRole {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
  roles: AddRoleMutation_addRole_roles[];
}

export interface AddRoleMutation {
  addRole: AddRoleMutation_addRole;
}

export interface AddRoleMutationVariables {
  roleId: Scalar.UUID;
  userId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveRoleMutation
// ====================================================

export interface RemoveRoleMutation_removeRole_roles {
  __typename: "Role";
  id: Scalar.UUID;
  name: string;
  color: string;
  source: RoleSource | null;
  fallback: boolean;
  userId: string | null;
  organizationId: string;
}

export interface RemoveRoleMutation_removeRole {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
  roles: RemoveRoleMutation_removeRole_roles[];
}

export interface RemoveRoleMutation {
  removeRole: RemoveRoleMutation_removeRole;
}

export interface RemoveRoleMutationVariables {
  roleId: Scalar.UUID;
  userId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateRoleMutation
// ====================================================

export interface CreateRoleMutation_role_rules {
  __typename: "Rule";
  id: Scalar.UUID;
  permission: RulePermission;
  inverted: boolean;
  taskId: string | null;
  projectId: string | null;
  fundingSessionId: string | null;
}

export interface CreateRoleMutation_role {
  __typename: "Role";
  id: Scalar.UUID;
  name: string;
  color: string;
  source: RoleSource | null;
  fallback: boolean;
  userId: string | null;
  organizationId: string;
  rules: CreateRoleMutation_role_rules[];
}

export interface CreateRoleMutation {
  role: CreateRoleMutation_role;
}

export interface CreateRoleMutationVariables {
  input: CreateRoleInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddTokenToOrganizationMutation
// ====================================================

export interface AddTokenToOrganizationMutation_organization_tokens_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface AddTokenToOrganizationMutation_organization_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: AddTokenToOrganizationMutation_organization_tokens_network;
}

export interface AddTokenToOrganizationMutation_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  tokens: AddTokenToOrganizationMutation_organization_tokens[];
}

export interface AddTokenToOrganizationMutation {
  organization: AddTokenToOrganizationMutation_organization;
}

export interface AddTokenToOrganizationMutationVariables {
  organizationId: Scalar.UUID;
  tokenId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveTokenFromOrganizationMutation
// ====================================================

export interface RemoveTokenFromOrganizationMutation_organization_tokens_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface RemoveTokenFromOrganizationMutation_organization_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: RemoveTokenFromOrganizationMutation_organization_tokens_network;
}

export interface RemoveTokenFromOrganizationMutation_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  tokens: RemoveTokenFromOrganizationMutation_organization_tokens[];
}

export interface RemoveTokenFromOrganizationMutation {
  organization: RemoveTokenFromOrganizationMutation_organization;
}

export interface RemoveTokenFromOrganizationMutationVariables {
  organizationId: Scalar.UUID;
  tokenId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateRuleMutation
// ====================================================

export interface CreateRuleMutation_rule_role_rules {
  __typename: "Rule";
  id: Scalar.UUID;
  permission: RulePermission;
  inverted: boolean;
  taskId: string | null;
  projectId: string | null;
  fundingSessionId: string | null;
}

export interface CreateRuleMutation_rule_role {
  __typename: "Role";
  id: Scalar.UUID;
  name: string;
  color: string;
  source: RoleSource | null;
  fallback: boolean;
  userId: string | null;
  organizationId: string;
  rules: CreateRuleMutation_rule_role_rules[];
}

export interface CreateRuleMutation_rule {
  __typename: "Rule";
  id: Scalar.UUID;
  permission: RulePermission;
  inverted: boolean;
  taskId: string | null;
  projectId: string | null;
  fundingSessionId: string | null;
  role: CreateRuleMutation_rule_role;
}

export interface CreateRuleMutation {
  rule: CreateRuleMutation_rule;
}

export interface CreateRuleMutationVariables {
  input: CreateRuleInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteRuleMutation
// ====================================================

export interface DeleteRuleMutation_role_rules {
  __typename: "Rule";
  id: Scalar.UUID;
  permission: RulePermission;
  inverted: boolean;
  taskId: string | null;
  projectId: string | null;
  fundingSessionId: string | null;
}

export interface DeleteRuleMutation_role {
  __typename: "Role";
  id: Scalar.UUID;
  name: string;
  color: string;
  source: RoleSource | null;
  fallback: boolean;
  userId: string | null;
  organizationId: string;
  rules: DeleteRuleMutation_role_rules[];
}

export interface DeleteRuleMutation {
  role: DeleteRuleMutation_role;
}

export interface DeleteRuleMutationVariables {
  id: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetTaskGatingDefault
// ====================================================

export interface SetTaskGatingDefault_setTaskGatingDefault_taskGatingDefaults_roles {
  __typename: "Role";
  id: Scalar.UUID;
}

export interface SetTaskGatingDefault_setTaskGatingDefault_taskGatingDefaults {
  __typename: "TaskGatingDefault";
  id: Scalar.UUID;
  userId: string;
  projectId: string;
  type: TaskGatingType;
  roles: SetTaskGatingDefault_setTaskGatingDefault_taskGatingDefaults_roles[];
}

export interface SetTaskGatingDefault_setTaskGatingDefault {
  __typename: "User";
  id: Scalar.UUID;
  taskGatingDefaults: SetTaskGatingDefault_setTaskGatingDefault_taskGatingDefaults[];
}

export interface SetTaskGatingDefault {
  setTaskGatingDefault: SetTaskGatingDefault_setTaskGatingDefault;
}

export interface SetTaskGatingDefaultVariables {
  input: TaskGatingDefaultInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateFundingSessionMutation
// ====================================================

export interface CreateFundingSessionMutation_session_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateFundingSessionMutation_session_organization_fundingSessions_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateFundingSessionMutation_session_organization_fundingSessions {
  __typename: "FundingSession";
  id: Scalar.UUID;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  closedAt: Scalar.DateTime | null;
  amount: string;
  permalink: string;
  organizationId: string;
  token: CreateFundingSessionMutation_session_organization_fundingSessions_token;
}

export interface CreateFundingSessionMutation_session_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  fundingSessions: CreateFundingSessionMutation_session_organization_fundingSessions[];
}

export interface CreateFundingSessionMutation_session {
  __typename: "FundingSession";
  id: Scalar.UUID;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  closedAt: Scalar.DateTime | null;
  amount: string;
  permalink: string;
  organizationId: string;
  token: CreateFundingSessionMutation_session_token;
  organization: CreateFundingSessionMutation_session_organization;
}

export interface CreateFundingSessionMutation {
  session: CreateFundingSessionMutation_session;
}

export interface CreateFundingSessionMutationVariables {
  input: CreateFundingSessionInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetFundingVoteMutation
// ====================================================

export interface SetFundingVoteMutation_vote_session_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface SetFundingVoteMutation_vote_session_votes {
  __typename: "FundingVote";
  id: Scalar.UUID;
  taskId: string;
  weight: number;
  userId: string;
}

export interface SetFundingVoteMutation_vote_session_voters {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface SetFundingVoteMutation_vote_session_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
}

export interface SetFundingVoteMutation_vote_session_rewards_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface SetFundingVoteMutation_vote_session_rewards_task_parentTask {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  permalink: string;
}

export interface SetFundingVoteMutation_vote_session_rewards_task {
  __typename: "Task";
  id: Scalar.UUID;
  parentTask: SetFundingVoteMutation_vote_session_rewards_task_parentTask | null;
}

export interface SetFundingVoteMutation_vote_session_rewards {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  token: SetFundingVoteMutation_vote_session_rewards_token;
  task: SetFundingVoteMutation_vote_session_rewards_task;
}

export interface SetFundingVoteMutation_vote_session {
  __typename: "FundingSession";
  id: Scalar.UUID;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  closedAt: Scalar.DateTime | null;
  amount: string;
  permalink: string;
  organizationId: string;
  token: SetFundingVoteMutation_vote_session_token;
  votes: SetFundingVoteMutation_vote_session_votes[];
  voters: SetFundingVoteMutation_vote_session_voters[];
  projects: SetFundingVoteMutation_vote_session_projects[];
  rewards: SetFundingVoteMutation_vote_session_rewards[];
}

export interface SetFundingVoteMutation_vote {
  __typename: "FundingVote";
  id: Scalar.UUID;
  taskId: string;
  weight: number;
  userId: string;
  session: SetFundingVoteMutation_vote_session;
}

export interface SetFundingVoteMutation {
  vote: SetFundingVoteMutation_vote;
}

export interface SetFundingVoteMutationVariables {
  input: FundingVoteInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CloseFundingSessionMutation
// ====================================================

export interface CloseFundingSessionMutation_session_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CloseFundingSessionMutation_session_votes {
  __typename: "FundingVote";
  id: Scalar.UUID;
  taskId: string;
  weight: number;
  userId: string;
}

export interface CloseFundingSessionMutation_session_voters {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface CloseFundingSessionMutation_session_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
}

export interface CloseFundingSessionMutation_session_rewards_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CloseFundingSessionMutation_session_rewards_task_parentTask {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  permalink: string;
}

export interface CloseFundingSessionMutation_session_rewards_task {
  __typename: "Task";
  id: Scalar.UUID;
  parentTask: CloseFundingSessionMutation_session_rewards_task_parentTask | null;
}

export interface CloseFundingSessionMutation_session_rewards {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  token: CloseFundingSessionMutation_session_rewards_token;
  task: CloseFundingSessionMutation_session_rewards_task;
}

export interface CloseFundingSessionMutation_session {
  __typename: "FundingSession";
  id: Scalar.UUID;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  closedAt: Scalar.DateTime | null;
  amount: string;
  permalink: string;
  organizationId: string;
  token: CloseFundingSessionMutation_session_token;
  votes: CloseFundingSessionMutation_session_votes[];
  voters: CloseFundingSessionMutation_session_voters[];
  projects: CloseFundingSessionMutation_session_projects[];
  rewards: CloseFundingSessionMutation_session_rewards[];
}

export interface CloseFundingSessionMutation {
  session: CloseFundingSessionMutation_session;
}

export interface CloseFundingSessionMutationVariables {
  id: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteOrganizationIntegrationMutation
// ====================================================

export interface DeleteOrganizationIntegrationMutation_deleteOrganizationIntegration_integrations {
  __typename: "OrganizationIntegration";
  id: Scalar.UUID;
  type: OrganizationIntegrationType;
  config: Scalar.JSONObject | null;
}

export interface DeleteOrganizationIntegrationMutation_deleteOrganizationIntegration {
  __typename: "Organization";
  id: Scalar.UUID;
  integrations: DeleteOrganizationIntegrationMutation_deleteOrganizationIntegration_integrations[];
}

export interface DeleteOrganizationIntegrationMutation {
  deleteOrganizationIntegration: DeleteOrganizationIntegrationMutation_deleteOrganizationIntegration;
}

export interface DeleteOrganizationIntegrationMutationVariables {
  input: DeleteOrganizationIntegrationInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ArchiveNotificationMutation
// ====================================================

export interface ArchiveNotificationMutation_archiveNotification_task_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface ArchiveNotificationMutation_archiveNotification_task_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  organization: ArchiveNotificationMutation_archiveNotification_task_project_organization;
}

export interface ArchiveNotificationMutation_archiveNotification_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  permalink: string;
  project: ArchiveNotificationMutation_archiveNotification_task_project;
}

export interface ArchiveNotificationMutation_archiveNotification_user {
  __typename: "User";
  id: Scalar.UUID;
  notificationUnreadCount: number;
}

export interface ArchiveNotificationMutation_archiveNotification {
  __typename: "Notification";
  id: Scalar.UUID;
  message: string;
  archivedAt: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  task: ArchiveNotificationMutation_archiveNotification_task;
  user: ArchiveNotificationMutation_archiveNotification_user;
}

export interface ArchiveNotificationMutation {
  archiveNotification: ArchiveNotificationMutation_archiveNotification;
}

export interface ArchiveNotificationMutationVariables {
  id: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MarkNotificationsReadMutation
// ====================================================

export interface MarkNotificationsReadMutation_markNotificationsRead {
  __typename: "User";
  id: Scalar.UUID;
  notificationUnreadCount: number;
}

export interface MarkNotificationsReadMutation {
  markNotificationsRead: MarkNotificationsReadMutation_markNotificationsRead;
}

export interface MarkNotificationsReadMutationVariables {
  readAt: Scalar.DateTime;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetUserSkillsMutation
// ====================================================

export interface SetUserSkillsMutation_setUserSkills_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface SetUserSkillsMutation_setUserSkills {
  __typename: "User";
  id: Scalar.UUID;
  skills: SetUserSkillsMutation_setUserSkills_skills[];
}

export interface SetUserSkillsMutation {
  setUserSkills: SetUserSkillsMutation_setUserSkills;
}

export interface SetUserSkillsMutationVariables {
  skillIds: Scalar.UUID[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTaskViewMutation
// ====================================================

export interface CreateTaskViewMutation_taskView_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface CreateTaskViewMutation_taskView_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface CreateTaskViewMutation_taskView_project_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface CreateTaskViewMutation_taskView_project_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface CreateTaskViewMutation_taskView_project_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: CreateTaskViewMutation_taskView_project_taskViews_filters[];
  sortBys: CreateTaskViewMutation_taskView_project_taskViews_sortBys[];
}

export interface CreateTaskViewMutation_taskView_project {
  __typename: "Project";
  id: Scalar.UUID;
  taskViews: CreateTaskViewMutation_taskView_project_taskViews[];
}

export interface CreateTaskViewMutation_taskView_user_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface CreateTaskViewMutation_taskView_user_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface CreateTaskViewMutation_taskView_user_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: CreateTaskViewMutation_taskView_user_taskViews_filters[];
  sortBys: CreateTaskViewMutation_taskView_user_taskViews_sortBys[];
}

export interface CreateTaskViewMutation_taskView_user {
  __typename: "User";
  id: Scalar.UUID;
  taskViews: CreateTaskViewMutation_taskView_user_taskViews[];
}

export interface CreateTaskViewMutation_taskView_organization_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface CreateTaskViewMutation_taskView_organization_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface CreateTaskViewMutation_taskView_organization_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: CreateTaskViewMutation_taskView_organization_taskViews_filters[];
  sortBys: CreateTaskViewMutation_taskView_organization_taskViews_sortBys[];
}

export interface CreateTaskViewMutation_taskView_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  taskViews: CreateTaskViewMutation_taskView_organization_taskViews[];
}

export interface CreateTaskViewMutation_taskView {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: CreateTaskViewMutation_taskView_filters[];
  sortBys: CreateTaskViewMutation_taskView_sortBys[];
  project: CreateTaskViewMutation_taskView_project | null;
  user: CreateTaskViewMutation_taskView_user | null;
  organization: CreateTaskViewMutation_taskView_organization | null;
}

export interface CreateTaskViewMutation {
  taskView: CreateTaskViewMutation_taskView;
}

export interface CreateTaskViewMutationVariables {
  input: CreateTaskViewInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateTaskViewMutation
// ====================================================

export interface UpdateTaskViewMutation_taskView_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface UpdateTaskViewMutation_taskView_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface UpdateTaskViewMutation_taskView_project_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface UpdateTaskViewMutation_taskView_project_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface UpdateTaskViewMutation_taskView_project_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: UpdateTaskViewMutation_taskView_project_taskViews_filters[];
  sortBys: UpdateTaskViewMutation_taskView_project_taskViews_sortBys[];
}

export interface UpdateTaskViewMutation_taskView_project {
  __typename: "Project";
  id: Scalar.UUID;
  taskViews: UpdateTaskViewMutation_taskView_project_taskViews[];
}

export interface UpdateTaskViewMutation_taskView_user_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface UpdateTaskViewMutation_taskView_user_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface UpdateTaskViewMutation_taskView_user_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: UpdateTaskViewMutation_taskView_user_taskViews_filters[];
  sortBys: UpdateTaskViewMutation_taskView_user_taskViews_sortBys[];
}

export interface UpdateTaskViewMutation_taskView_user {
  __typename: "User";
  id: Scalar.UUID;
  taskViews: UpdateTaskViewMutation_taskView_user_taskViews[];
}

export interface UpdateTaskViewMutation_taskView_organization_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface UpdateTaskViewMutation_taskView_organization_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface UpdateTaskViewMutation_taskView_organization_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: UpdateTaskViewMutation_taskView_organization_taskViews_filters[];
  sortBys: UpdateTaskViewMutation_taskView_organization_taskViews_sortBys[];
}

export interface UpdateTaskViewMutation_taskView_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  taskViews: UpdateTaskViewMutation_taskView_organization_taskViews[];
}

export interface UpdateTaskViewMutation_taskView {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: UpdateTaskViewMutation_taskView_filters[];
  sortBys: UpdateTaskViewMutation_taskView_sortBys[];
  project: UpdateTaskViewMutation_taskView_project | null;
  user: UpdateTaskViewMutation_taskView_user | null;
  organization: UpdateTaskViewMutation_taskView_organization | null;
}

export interface UpdateTaskViewMutation {
  taskView: UpdateTaskViewMutation_taskView;
}

export interface UpdateTaskViewMutationVariables {
  input: UpdateTaskViewInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteThreepidMutation
// ====================================================

export interface DeleteThreepidMutation_deleteThreepid_organizations {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface DeleteThreepidMutation_deleteThreepid_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface DeleteThreepidMutation_deleteThreepid_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface DeleteThreepidMutation_deleteThreepid_threepids {
  __typename: "Threepid";
  id: string;
  source: ThreepidSource;
  threepid: string;
}

export interface DeleteThreepidMutation_deleteThreepid_prompts {
  __typename: "UserPrompt";
  id: Scalar.UUID;
  type: string;
  createdAt: Scalar.DateTime;
  completedAt: Scalar.DateTime | null;
}

export interface DeleteThreepidMutation_deleteThreepid_taskGatingDefaults_roles {
  __typename: "Role";
  id: Scalar.UUID;
}

export interface DeleteThreepidMutation_deleteThreepid_taskGatingDefaults {
  __typename: "TaskGatingDefault";
  id: Scalar.UUID;
  userId: string;
  projectId: string;
  type: TaskGatingType;
  roles: DeleteThreepidMutation_deleteThreepid_taskGatingDefaults_roles[];
}

export interface DeleteThreepidMutation_deleteThreepid_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface DeleteThreepidMutation_deleteThreepid_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface DeleteThreepidMutation_deleteThreepid_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: DeleteThreepidMutation_deleteThreepid_taskViews_filters[];
  sortBys: DeleteThreepidMutation_deleteThreepid_taskViews_sortBys[];
}

export interface DeleteThreepidMutation_deleteThreepid {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
  bio: string | null;
  organizations: DeleteThreepidMutation_deleteThreepid_organizations[];
  details: DeleteThreepidMutation_deleteThreepid_details[];
  skills: DeleteThreepidMutation_deleteThreepid_skills[];
  threepids: DeleteThreepidMutation_deleteThreepid_threepids[];
  prompts: DeleteThreepidMutation_deleteThreepid_prompts[];
  taskGatingDefaults: DeleteThreepidMutation_deleteThreepid_taskGatingDefaults[];
  taskViews: DeleteThreepidMutation_deleteThreepid_taskViews[];
}

export interface DeleteThreepidMutation {
  deleteThreepid: DeleteThreepidMutation_deleteThreepid;
}

export interface DeleteThreepidMutationVariables {
  id: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateWorkspaceMutation
// ====================================================

export interface CreateWorkspaceMutation_workspace_organization_workspaces {
  __typename: "Workspace";
  id: Scalar.UUID;
  name: string;
  sortKey: string;
}

export interface CreateWorkspaceMutation_workspace_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  workspaces: CreateWorkspaceMutation_workspace_organization_workspaces[];
}

export interface CreateWorkspaceMutation_workspace {
  __typename: "Workspace";
  id: Scalar.UUID;
  name: string;
  sortKey: string;
  organization: CreateWorkspaceMutation_workspace_organization;
}

export interface CreateWorkspaceMutation {
  workspace: CreateWorkspaceMutation_workspace;
}

export interface CreateWorkspaceMutationVariables {
  input: CreateWorkspaceInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateWorkspaceMutation
// ====================================================

export interface UpdateWorkspaceMutation_workspace_organization_workspaces {
  __typename: "Workspace";
  id: Scalar.UUID;
  name: string;
  sortKey: string;
}

export interface UpdateWorkspaceMutation_workspace_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  workspaces: UpdateWorkspaceMutation_workspace_organization_workspaces[];
}

export interface UpdateWorkspaceMutation_workspace {
  __typename: "Workspace";
  id: Scalar.UUID;
  name: string;
  sortKey: string;
  organization: UpdateWorkspaceMutation_workspace_organization;
}

export interface UpdateWorkspaceMutation {
  workspace: UpdateWorkspaceMutation_workspace;
}

export interface UpdateWorkspaceMutationVariables {
  input: UpdateWorkspaceInput;
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
  tagline: string | null;
  permalink: string;
}

export interface MeQuery_me_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface MeQuery_me_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface MeQuery_me_threepids {
  __typename: "Threepid";
  id: string;
  source: ThreepidSource;
  threepid: string;
}

export interface MeQuery_me_prompts {
  __typename: "UserPrompt";
  id: Scalar.UUID;
  type: string;
  createdAt: Scalar.DateTime;
  completedAt: Scalar.DateTime | null;
}

export interface MeQuery_me_taskGatingDefaults_roles {
  __typename: "Role";
  id: Scalar.UUID;
}

export interface MeQuery_me_taskGatingDefaults {
  __typename: "TaskGatingDefault";
  id: Scalar.UUID;
  userId: string;
  projectId: string;
  type: TaskGatingType;
  roles: MeQuery_me_taskGatingDefaults_roles[];
}

export interface MeQuery_me_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface MeQuery_me_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface MeQuery_me_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: MeQuery_me_taskViews_filters[];
  sortBys: MeQuery_me_taskViews_sortBys[];
}

export interface MeQuery_me {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
  bio: string | null;
  organizations: MeQuery_me_organizations[];
  details: MeQuery_me_details[];
  skills: MeQuery_me_skills[];
  threepids: MeQuery_me_threepids[];
  prompts: MeQuery_me_prompts[];
  taskGatingDefaults: MeQuery_me_taskGatingDefaults[];
  taskViews: MeQuery_me_taskViews[];
}

export interface MeQuery {
  me: MeQuery_me;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserProfileByUsernameQuery
// ====================================================

export interface UserProfileByUsernameQuery_user_organizations {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface UserProfileByUsernameQuery_user_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface UserProfileByUsernameQuery_user_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface UserProfileByUsernameQuery_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
  bio: string | null;
  organizations: UserProfileByUsernameQuery_user_organizations[];
  details: UserProfileByUsernameQuery_user_details[];
  skills: UserProfileByUsernameQuery_user_skills[];
}

export interface UserProfileByUsernameQuery {
  user: UserProfileByUsernameQuery_user;
}

export interface UserProfileByUsernameQueryVariables {
  username: string;
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
  tagline: string | null;
  permalink: string;
}

export interface UserProfileQuery_user_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface UserProfileQuery_user_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface UserProfileQuery_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
  bio: string | null;
  organizations: UserProfileQuery_user_organizations[];
  details: UserProfileQuery_user_details[];
  skills: UserProfileQuery_user_skills[];
}

export interface UserProfileQuery {
  user: UserProfileQuery_user;
}

export interface UserProfileQueryVariables {
  id: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserRolesQuery
// ====================================================

export interface UserRolesQuery_user_roles {
  __typename: "Role";
  id: Scalar.UUID;
  name: string;
  color: string;
  source: RoleSource | null;
  fallback: boolean;
  userId: string | null;
  organizationId: string;
}

export interface UserRolesQuery_user_userRoles {
  __typename: "UserRole";
  roleId: string;
  hidden: boolean;
}

export interface UserRolesQuery_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
  roles: UserRolesQuery_user_roles[];
  userRoles: UserRolesQuery_user_userRoles[];
}

export interface UserRolesQuery {
  user: UserRolesQuery_user;
}

export interface UserRolesQueryVariables {
  userId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserTasksQuery
// ====================================================

export interface UserTasksQuery_user_tasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface UserTasksQuery_user_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface UserTasksQuery_user_tasks_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface UserTasksQuery_user_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface UserTasksQuery_user_tasks_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface UserTasksQuery_user_tasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface UserTasksQuery_user_tasks_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface UserTasksQuery_user_tasks_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UserTasksQuery_user_tasks_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: UserTasksQuery_user_tasks_reward_payments_payment_paymentMethod_network;
}

export interface UserTasksQuery_user_tasks_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UserTasksQuery_user_tasks_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: UserTasksQuery_user_tasks_reward_payments_payment_paymentMethod;
  network: UserTasksQuery_user_tasks_reward_payments_payment_network;
}

export interface UserTasksQuery_user_tasks_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: UserTasksQuery_user_tasks_reward_payments_user;
  payment: UserTasksQuery_user_tasks_reward_payments_payment;
}

export interface UserTasksQuery_user_tasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: UserTasksQuery_user_tasks_reward_token;
  payments: UserTasksQuery_user_tasks_reward_payments[];
}

export interface UserTasksQuery_user_tasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface UserTasksQuery_user_tasks_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface UserTasksQuery_user_tasks_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface UserTasksQuery_user_tasks_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface UserTasksQuery_user_tasks_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface UserTasksQuery_user_tasks_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  organization: UserTasksQuery_user_tasks_project_organization;
}

export interface UserTasksQuery_user_tasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: UserTasksQuery_user_tasks_subtasks[];
  tags: UserTasksQuery_user_tasks_tags[];
  skills: UserTasksQuery_user_tasks_skills[];
  assignees: UserTasksQuery_user_tasks_assignees[];
  owners: UserTasksQuery_user_tasks_owners[];
  reward: UserTasksQuery_user_tasks_reward | null;
  applications: UserTasksQuery_user_tasks_applications[];
  submissions: UserTasksQuery_user_tasks_submissions[];
  review: UserTasksQuery_user_tasks_review | null;
  reactions: UserTasksQuery_user_tasks_reactions[];
  project: UserTasksQuery_user_tasks_project;
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
  id: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserTaskViewsQuery
// ====================================================

export interface UserTaskViewsQuery_user_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface UserTaskViewsQuery_user_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface UserTaskViewsQuery_user_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: UserTaskViewsQuery_user_taskViews_filters[];
  sortBys: UserTaskViewsQuery_user_taskViews_sortBys[];
}

export interface UserTaskViewsQuery_user {
  __typename: "User";
  id: Scalar.UUID;
  taskViews: UserTaskViewsQuery_user_taskViews[];
}

export interface UserTaskViewsQuery {
  user: UserTaskViewsQuery_user;
}

export interface UserTaskViewsQueryVariables {
  id: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserAddressQuery
// ====================================================

export interface UserAddressQuery_user_threepids {
  __typename: "Threepid";
  source: ThreepidSource;
  address: string;
}

export interface UserAddressQuery_user {
  __typename: "User";
  id: Scalar.UUID;
  threepids: UserAddressQuery_user_threepids[];
}

export interface UserAddressQuery {
  user: UserAddressQuery_user;
}

export interface UserAddressQueryVariables {
  id: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PermissionsQuery
// ====================================================

export interface PermissionsQuery {
  permissions: Scalar.JSONObject[];
}

export interface PermissionsQueryVariables {
  organizationId?: Scalar.UUID | null;
  unauthed?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationQuery
// ====================================================

export interface GetOrganizationQuery_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
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
// GraphQL query operation: GetOrganizationDetailsQuery
// ====================================================

export interface GetOrganizationDetailsQuery_organization_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  taskCount: number;
  doneTaskCount: number;
  openBountyTaskCount: number;
}

export interface GetOrganizationDetailsQuery_organization_workspaces {
  __typename: "Workspace";
  id: Scalar.UUID;
  name: string;
  sortKey: string;
}

export interface GetOrganizationDetailsQuery_organization_tags {
  __typename: "OrganizationTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface GetOrganizationDetailsQuery_organization_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface GetOrganizationDetailsQuery_organization_projectTokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetOrganizationDetailsQuery_organization_projectTokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: GetOrganizationDetailsQuery_organization_projectTokenGates_token_network;
}

export interface GetOrganizationDetailsQuery_organization_projectTokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  token: GetOrganizationDetailsQuery_organization_projectTokenGates_token;
}

export interface GetOrganizationDetailsQuery_organization_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface GetOrganizationDetailsQuery_organization_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface GetOrganizationDetailsQuery_organization_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: GetOrganizationDetailsQuery_organization_taskViews_filters[];
  sortBys: GetOrganizationDetailsQuery_organization_taskViews_sortBys[];
}

export interface GetOrganizationDetailsQuery_organization_fundingSessions_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetOrganizationDetailsQuery_organization_fundingSessions {
  __typename: "FundingSession";
  id: Scalar.UUID;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  closedAt: Scalar.DateTime | null;
  amount: string;
  permalink: string;
  organizationId: string;
  token: GetOrganizationDetailsQuery_organization_fundingSessions_token;
}

export interface GetOrganizationDetailsQuery_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
  description: string | null;
  projects: GetOrganizationDetailsQuery_organization_projects[];
  workspaces: GetOrganizationDetailsQuery_organization_workspaces[];
  tags: GetOrganizationDetailsQuery_organization_tags[];
  details: GetOrganizationDetailsQuery_organization_details[];
  projectTokenGates: GetOrganizationDetailsQuery_organization_projectTokenGates[];
  taskViews: GetOrganizationDetailsQuery_organization_taskViews[];
  fundingSessions: GetOrganizationDetailsQuery_organization_fundingSessions[];
}

export interface GetOrganizationDetailsQuery {
  organization: GetOrganizationDetailsQuery_organization;
}

export interface GetOrganizationDetailsQueryVariables {
  organizationId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationTaskViewsQuery
// ====================================================

export interface GetOrganizationTaskViewsQuery_organization_projects_taskTags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface GetOrganizationTaskViewsQuery_organization_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  taskCount: number;
  doneTaskCount: number;
  openBountyTaskCount: number;
  taskTags: GetOrganizationTaskViewsQuery_organization_projects_taskTags[];
}

export interface GetOrganizationTaskViewsQuery_organization_workspaces {
  __typename: "Workspace";
  id: Scalar.UUID;
  name: string;
  sortKey: string;
}

export interface GetOrganizationTaskViewsQuery_organization_tags {
  __typename: "OrganizationTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface GetOrganizationTaskViewsQuery_organization_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface GetOrganizationTaskViewsQuery_organization_projectTokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetOrganizationTaskViewsQuery_organization_projectTokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: GetOrganizationTaskViewsQuery_organization_projectTokenGates_token_network;
}

export interface GetOrganizationTaskViewsQuery_organization_projectTokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  token: GetOrganizationTaskViewsQuery_organization_projectTokenGates_token;
}

export interface GetOrganizationTaskViewsQuery_organization_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface GetOrganizationTaskViewsQuery_organization_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface GetOrganizationTaskViewsQuery_organization_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: GetOrganizationTaskViewsQuery_organization_taskViews_filters[];
  sortBys: GetOrganizationTaskViewsQuery_organization_taskViews_sortBys[];
}

export interface GetOrganizationTaskViewsQuery_organization_fundingSessions_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetOrganizationTaskViewsQuery_organization_fundingSessions {
  __typename: "FundingSession";
  id: Scalar.UUID;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  closedAt: Scalar.DateTime | null;
  amount: string;
  permalink: string;
  organizationId: string;
  token: GetOrganizationTaskViewsQuery_organization_fundingSessions_token;
}

export interface GetOrganizationTaskViewsQuery_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
  description: string | null;
  projects: GetOrganizationTaskViewsQuery_organization_projects[];
  workspaces: GetOrganizationTaskViewsQuery_organization_workspaces[];
  tags: GetOrganizationTaskViewsQuery_organization_tags[];
  details: GetOrganizationTaskViewsQuery_organization_details[];
  projectTokenGates: GetOrganizationTaskViewsQuery_organization_projectTokenGates[];
  taskViews: GetOrganizationTaskViewsQuery_organization_taskViews[];
  fundingSessions: GetOrganizationTaskViewsQuery_organization_fundingSessions[];
}

export interface GetOrganizationTaskViewsQuery {
  organization: GetOrganizationTaskViewsQuery_organization;
}

export interface GetOrganizationTaskViewsQueryVariables {
  organizationId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationIntegrationsQuery
// ====================================================

export interface GetOrganizationIntegrationsQuery_organization_integrations {
  __typename: "OrganizationIntegration";
  id: Scalar.UUID;
  type: OrganizationIntegrationType;
  config: Scalar.JSONObject | null;
}

export interface GetOrganizationIntegrationsQuery_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  integrations: GetOrganizationIntegrationsQuery_organization_integrations[];
}

export interface GetOrganizationIntegrationsQuery {
  organization: GetOrganizationIntegrationsQuery_organization;
}

export interface GetOrganizationIntegrationsQueryVariables {
  organizationId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationBySlugQuery
// ====================================================

export interface GetOrganizationBySlugQuery_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface GetOrganizationBySlugQuery {
  organization: GetOrganizationBySlugQuery_organization;
}

export interface GetOrganizationBySlugQueryVariables {
  organizationSlug: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationUsersQuery
// ====================================================

export interface GetOrganizationUsersQuery_organization_users {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetOrganizationUsersQuery_organization_admins {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetOrganizationUsersQuery_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  users: GetOrganizationUsersQuery_organization_users[];
  admins: GetOrganizationUsersQuery_organization_admins[];
}

export interface GetOrganizationUsersQuery {
  organization: GetOrganizationUsersQuery_organization;
}

export interface GetOrganizationUsersQueryVariables {
  organizationId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationUsersWithRolesQuery
// ====================================================

export interface GetOrganizationUsersWithRolesQuery_organization_users_roles {
  __typename: "Role";
  id: Scalar.UUID;
  name: string;
  color: string;
  source: RoleSource | null;
  fallback: boolean;
  userId: string | null;
  organizationId: string;
}

export interface GetOrganizationUsersWithRolesQuery_organization_users {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
  roles: GetOrganizationUsersWithRolesQuery_organization_users_roles[];
}

export interface GetOrganizationUsersWithRolesQuery_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  users: GetOrganizationUsersWithRolesQuery_organization_users[];
}

export interface GetOrganizationUsersWithRolesQuery {
  organization: GetOrganizationUsersWithRolesQuery_organization;
}

export interface GetOrganizationUsersWithRolesQueryVariables {
  organizationId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationRolesQuery
// ====================================================

export interface GetOrganizationRolesQuery_organization_roles_rules {
  __typename: "Rule";
  id: Scalar.UUID;
  permission: RulePermission;
  inverted: boolean;
  taskId: string | null;
  projectId: string | null;
  fundingSessionId: string | null;
}

export interface GetOrganizationRolesQuery_organization_roles {
  __typename: "Role";
  id: Scalar.UUID;
  name: string;
  color: string;
  source: RoleSource | null;
  fallback: boolean;
  userId: string | null;
  organizationId: string;
  rules: GetOrganizationRolesQuery_organization_roles_rules[];
}

export interface GetOrganizationRolesQuery_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  roles: GetOrganizationRolesQuery_organization_roles[];
}

export interface GetOrganizationRolesQuery {
  organization: GetOrganizationRolesQuery_organization;
}

export interface GetOrganizationRolesQueryVariables {
  organizationId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetFeaturedOrganizationsQuery
// ====================================================

export interface GetFeaturedOrganizationsQuery_organizations_users {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetFeaturedOrganizationsQuery_organizations {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
  description: string | null;
  users: GetFeaturedOrganizationsQuery_organizations_users[];
}

export interface GetFeaturedOrganizationsQuery {
  organizations: GetFeaturedOrganizationsQuery_organizations[];
}

export interface GetFeaturedOrganizationsQueryVariables {
  limit: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPopularOrganizationsQuery
// ====================================================

export interface GetPopularOrganizationsQuery_organizations {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
  userCount: number;
}

export interface GetPopularOrganizationsQuery {
  organizations: GetPopularOrganizationsQuery_organizations[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationTokensQuery
// ====================================================

export interface GetOrganizationTokensQuery_organization_tokens_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetOrganizationTokensQuery_organization_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: GetOrganizationTokensQuery_organization_tokens_network;
}

export interface GetOrganizationTokensQuery_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  tokens: GetOrganizationTokensQuery_organization_tokens[];
}

export interface GetOrganizationTokensQuery {
  organization: GetOrganizationTokensQuery_organization;
}

export interface GetOrganizationTokensQueryVariables {
  organizationId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationsUserFollowsOnDiscordQuery
// ====================================================

export interface GetOrganizationsUserFollowsOnDiscordQuery_organizations {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface GetOrganizationsUserFollowsOnDiscordQuery {
  organizations: GetOrganizationsUserFollowsOnDiscordQuery_organizations[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationTagsQuery
// ====================================================

export interface GetOrganizationTagsQuery_organization_tags {
  __typename: "OrganizationTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface GetOrganizationTagsQuery_organization_allTags {
  __typename: "OrganizationTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface GetOrganizationTagsQuery_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  tags: GetOrganizationTagsQuery_organization_tags[];
  allTags: GetOrganizationTagsQuery_organization_allTags[];
}

export interface GetOrganizationTagsQuery {
  organization: GetOrganizationTagsQuery_organization;
}

export interface GetOrganizationTagsQueryVariables {
  organizationId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationTasksQuery
// ====================================================

export interface GetOrganizationTasksQuery_organization_tasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface GetOrganizationTasksQuery_organization_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface GetOrganizationTasksQuery_organization_tasks_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface GetOrganizationTasksQuery_organization_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetOrganizationTasksQuery_organization_tasks_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetOrganizationTasksQuery_organization_tasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetOrganizationTasksQuery_organization_tasks_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetOrganizationTasksQuery_organization_tasks_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetOrganizationTasksQuery_organization_tasks_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: GetOrganizationTasksQuery_organization_tasks_reward_payments_payment_paymentMethod_network;
}

export interface GetOrganizationTasksQuery_organization_tasks_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetOrganizationTasksQuery_organization_tasks_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: GetOrganizationTasksQuery_organization_tasks_reward_payments_payment_paymentMethod;
  network: GetOrganizationTasksQuery_organization_tasks_reward_payments_payment_network;
}

export interface GetOrganizationTasksQuery_organization_tasks_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: GetOrganizationTasksQuery_organization_tasks_reward_payments_user;
  payment: GetOrganizationTasksQuery_organization_tasks_reward_payments_payment;
}

export interface GetOrganizationTasksQuery_organization_tasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: GetOrganizationTasksQuery_organization_tasks_reward_token;
  payments: GetOrganizationTasksQuery_organization_tasks_reward_payments[];
}

export interface GetOrganizationTasksQuery_organization_tasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface GetOrganizationTasksQuery_organization_tasks_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface GetOrganizationTasksQuery_organization_tasks_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface GetOrganizationTasksQuery_organization_tasks_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface GetOrganizationTasksQuery_organization_tasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: GetOrganizationTasksQuery_organization_tasks_subtasks[];
  tags: GetOrganizationTasksQuery_organization_tasks_tags[];
  skills: GetOrganizationTasksQuery_organization_tasks_skills[];
  assignees: GetOrganizationTasksQuery_organization_tasks_assignees[];
  owners: GetOrganizationTasksQuery_organization_tasks_owners[];
  reward: GetOrganizationTasksQuery_organization_tasks_reward | null;
  applications: GetOrganizationTasksQuery_organization_tasks_applications[];
  submissions: GetOrganizationTasksQuery_organization_tasks_submissions[];
  review: GetOrganizationTasksQuery_organization_tasks_review | null;
  reactions: GetOrganizationTasksQuery_organization_tasks_reactions[];
}

export interface GetOrganizationTasksQuery_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  tasks: GetOrganizationTasksQuery_organization_tasks[];
}

export interface GetOrganizationTasksQuery {
  organization: GetOrganizationTasksQuery_organization;
}

export interface GetOrganizationTasksQueryVariables {
  organizationId: Scalar.UUID;
  filter?: TaskFilterInput | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationTaskTagsQuery
// ====================================================

export interface GetOrganizationTaskTagsQuery_organization_projects_taskTags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface GetOrganizationTaskTagsQuery_organization_projects {
  __typename: "Project";
  taskTags: GetOrganizationTaskTagsQuery_organization_projects_taskTags[];
}

export interface GetOrganizationTaskTagsQuery_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  projects: GetOrganizationTaskTagsQuery_organization_projects[];
}

export interface GetOrganizationTaskTagsQuery {
  organization: GetOrganizationTaskTagsQuery_organization;
}

export interface GetOrganizationTaskTagsQueryVariables {
  organizationId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProjectQuery
// ====================================================

export interface GetProjectQuery_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
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
// GraphQL query operation: GetProjectDetailsQuery
// ====================================================

export interface GetProjectDetailsQuery_project_options {
  __typename: "ProjectOptions";
  showBacklogColumn: boolean | null;
  showCommunitySuggestions: boolean | null;
}

export interface GetProjectDetailsQuery_project_tokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetProjectDetailsQuery_project_tokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: GetProjectDetailsQuery_project_tokenGates_token_network;
}

export interface GetProjectDetailsQuery_project_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  token: GetProjectDetailsQuery_project_tokenGates_token;
}

export interface GetProjectDetailsQuery_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface GetProjectDetailsQuery_project_taskSections {
  __typename: "TaskSection";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
  projectId: string;
}

export interface GetProjectDetailsQuery_project_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface GetProjectDetailsQuery_project_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface GetProjectDetailsQuery_project_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: GetProjectDetailsQuery_project_taskViews_filters[];
  sortBys: GetProjectDetailsQuery_project_taskViews_sortBys[];
}

export interface GetProjectDetailsQuery_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  options: GetProjectDetailsQuery_project_options | null;
  tokenGates: GetProjectDetailsQuery_project_tokenGates[];
  organization: GetProjectDetailsQuery_project_organization;
  taskSections: GetProjectDetailsQuery_project_taskSections[];
  taskViews: GetProjectDetailsQuery_project_taskViews[];
}

export interface GetProjectDetailsQuery {
  project: GetProjectDetailsQuery_project;
}

export interface GetProjectDetailsQueryVariables {
  projectId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProjectBySlugQuery
// ====================================================

export interface GetProjectBySlugQuery_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
}

export interface GetProjectBySlugQuery {
  project: GetProjectBySlugQuery_project;
}

export interface GetProjectBySlugQueryVariables {
  projectSlug: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProjectIdBySlugQuery
// ====================================================

export interface GetProjectIdBySlugQuery {
  projectId: Scalar.UUID;
}

export interface GetProjectIdBySlugQueryVariables {
  projectSlug: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProjectTasksQuery
// ====================================================

export interface GetProjectTasksQuery_project_tasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface GetProjectTasksQuery_project_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface GetProjectTasksQuery_project_tasks_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface GetProjectTasksQuery_project_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetProjectTasksQuery_project_tasks_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetProjectTasksQuery_project_tasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetProjectTasksQuery_project_tasks_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetProjectTasksQuery_project_tasks_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetProjectTasksQuery_project_tasks_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: GetProjectTasksQuery_project_tasks_reward_payments_payment_paymentMethod_network;
}

export interface GetProjectTasksQuery_project_tasks_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetProjectTasksQuery_project_tasks_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: GetProjectTasksQuery_project_tasks_reward_payments_payment_paymentMethod;
  network: GetProjectTasksQuery_project_tasks_reward_payments_payment_network;
}

export interface GetProjectTasksQuery_project_tasks_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: GetProjectTasksQuery_project_tasks_reward_payments_user;
  payment: GetProjectTasksQuery_project_tasks_reward_payments_payment;
}

export interface GetProjectTasksQuery_project_tasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: GetProjectTasksQuery_project_tasks_reward_token;
  payments: GetProjectTasksQuery_project_tasks_reward_payments[];
}

export interface GetProjectTasksQuery_project_tasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface GetProjectTasksQuery_project_tasks_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface GetProjectTasksQuery_project_tasks_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface GetProjectTasksQuery_project_tasks_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface GetProjectTasksQuery_project_tasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: GetProjectTasksQuery_project_tasks_subtasks[];
  tags: GetProjectTasksQuery_project_tasks_tags[];
  skills: GetProjectTasksQuery_project_tasks_skills[];
  assignees: GetProjectTasksQuery_project_tasks_assignees[];
  owners: GetProjectTasksQuery_project_tasks_owners[];
  reward: GetProjectTasksQuery_project_tasks_reward | null;
  applications: GetProjectTasksQuery_project_tasks_applications[];
  submissions: GetProjectTasksQuery_project_tasks_submissions[];
  review: GetProjectTasksQuery_project_tasks_review | null;
  reactions: GetProjectTasksQuery_project_tasks_reactions[];
}

export interface GetProjectTasksQuery_project {
  __typename: "Project";
  id: Scalar.UUID;
  tasks: GetProjectTasksQuery_project_tasks[];
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
// GraphQL query operation: GetProjectTasksExportQuery
// ====================================================

export interface GetProjectTasksExportQuery_project_tasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface GetProjectTasksExportQuery_project_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface GetProjectTasksExportQuery_project_tasks_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface GetProjectTasksExportQuery_project_tasks_assignees_threepids {
  __typename: "Threepid";
  source: ThreepidSource;
  address: string;
}

export interface GetProjectTasksExportQuery_project_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
  threepids: GetProjectTasksExportQuery_project_tasks_assignees_threepids[];
}

export interface GetProjectTasksExportQuery_project_tasks_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetProjectTasksExportQuery_project_tasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetProjectTasksExportQuery_project_tasks_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetProjectTasksExportQuery_project_tasks_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetProjectTasksExportQuery_project_tasks_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: GetProjectTasksExportQuery_project_tasks_reward_payments_payment_paymentMethod_network;
}

export interface GetProjectTasksExportQuery_project_tasks_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetProjectTasksExportQuery_project_tasks_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: GetProjectTasksExportQuery_project_tasks_reward_payments_payment_paymentMethod;
  network: GetProjectTasksExportQuery_project_tasks_reward_payments_payment_network;
}

export interface GetProjectTasksExportQuery_project_tasks_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: GetProjectTasksExportQuery_project_tasks_reward_payments_user;
  payment: GetProjectTasksExportQuery_project_tasks_reward_payments_payment;
}

export interface GetProjectTasksExportQuery_project_tasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: GetProjectTasksExportQuery_project_tasks_reward_token;
  payments: GetProjectTasksExportQuery_project_tasks_reward_payments[];
}

export interface GetProjectTasksExportQuery_project_tasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface GetProjectTasksExportQuery_project_tasks_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface GetProjectTasksExportQuery_project_tasks_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface GetProjectTasksExportQuery_project_tasks_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface GetProjectTasksExportQuery_project_tasks_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetProjectTasksExportQuery_project_tasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: GetProjectTasksExportQuery_project_tasks_subtasks[];
  tags: GetProjectTasksExportQuery_project_tasks_tags[];
  skills: GetProjectTasksExportQuery_project_tasks_skills[];
  assignees: GetProjectTasksExportQuery_project_tasks_assignees[];
  owners: GetProjectTasksExportQuery_project_tasks_owners[];
  reward: GetProjectTasksExportQuery_project_tasks_reward | null;
  applications: GetProjectTasksExportQuery_project_tasks_applications[];
  submissions: GetProjectTasksExportQuery_project_tasks_submissions[];
  review: GetProjectTasksExportQuery_project_tasks_review | null;
  reactions: GetProjectTasksExportQuery_project_tasks_reactions[];
  creator: GetProjectTasksExportQuery_project_tasks_creator | null;
}

export interface GetProjectTasksExportQuery_project {
  __typename: "Project";
  id: Scalar.UUID;
  tasks: GetProjectTasksExportQuery_project_tasks[];
}

export interface GetProjectTasksExportQuery {
  project: GetProjectTasksExportQuery_project;
}

export interface GetProjectTasksExportQueryVariables {
  projectId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProjectTaskTagsQuery
// ====================================================

export interface GetProjectTaskTagsQuery_project_taskTags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface GetProjectTaskTagsQuery_project {
  __typename: "Project";
  id: Scalar.UUID;
  taskTags: GetProjectTaskTagsQuery_project_taskTags[];
}

export interface GetProjectTaskTagsQuery {
  project: GetProjectTaskTagsQuery_project;
}

export interface GetProjectTaskTagsQueryVariables {
  projectId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTaskQuery
// ====================================================

export interface GetTaskQuery_task_subtasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface GetTaskQuery_task_subtasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface GetTaskQuery_task_subtasks_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface GetTaskQuery_task_subtasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetTaskQuery_task_subtasks_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetTaskQuery_task_subtasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetTaskQuery_task_subtasks_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetTaskQuery_task_subtasks_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetTaskQuery_task_subtasks_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: GetTaskQuery_task_subtasks_reward_payments_payment_paymentMethod_network;
}

export interface GetTaskQuery_task_subtasks_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetTaskQuery_task_subtasks_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: GetTaskQuery_task_subtasks_reward_payments_payment_paymentMethod;
  network: GetTaskQuery_task_subtasks_reward_payments_payment_network;
}

export interface GetTaskQuery_task_subtasks_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: GetTaskQuery_task_subtasks_reward_payments_user;
  payment: GetTaskQuery_task_subtasks_reward_payments_payment;
}

export interface GetTaskQuery_task_subtasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: GetTaskQuery_task_subtasks_reward_token;
  payments: GetTaskQuery_task_subtasks_reward_payments[];
}

export interface GetTaskQuery_task_subtasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface GetTaskQuery_task_subtasks_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface GetTaskQuery_task_subtasks_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface GetTaskQuery_task_subtasks_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface GetTaskQuery_task_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
  description: string | null;
  priority: TaskPriority;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: GetTaskQuery_task_subtasks_subtasks[];
  tags: GetTaskQuery_task_subtasks_tags[];
  skills: GetTaskQuery_task_subtasks_skills[];
  assignees: GetTaskQuery_task_subtasks_assignees[];
  owners: GetTaskQuery_task_subtasks_owners[];
  reward: GetTaskQuery_task_subtasks_reward | null;
  applications: GetTaskQuery_task_subtasks_applications[];
  submissions: GetTaskQuery_task_subtasks_submissions[];
  review: GetTaskQuery_task_subtasks_review | null;
  reactions: GetTaskQuery_task_subtasks_reactions[];
}

export interface GetTaskQuery_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface GetTaskQuery_task_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface GetTaskQuery_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetTaskQuery_task_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetTaskQuery_task_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetTaskQuery_task_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetTaskQuery_task_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetTaskQuery_task_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: GetTaskQuery_task_reward_payments_payment_paymentMethod_network;
}

export interface GetTaskQuery_task_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetTaskQuery_task_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: GetTaskQuery_task_reward_payments_payment_paymentMethod;
  network: GetTaskQuery_task_reward_payments_payment_network;
}

export interface GetTaskQuery_task_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: GetTaskQuery_task_reward_payments_user;
  payment: GetTaskQuery_task_reward_payments_payment;
}

export interface GetTaskQuery_task_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: GetTaskQuery_task_reward_token;
  payments: GetTaskQuery_task_reward_payments[];
}

export interface GetTaskQuery_task_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetTaskQuery_task_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  createdAt: Scalar.DateTime;
  discordThreadUrl: string | null;
  user: GetTaskQuery_task_applications_user;
}

export interface GetTaskQuery_task_submissions_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetTaskQuery_task_submissions_approver {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetTaskQuery_task_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
  createdAt: Scalar.DateTime;
  taskId: string;
  user: GetTaskQuery_task_submissions_user;
  approver: GetTaskQuery_task_submissions_approver | null;
}

export interface GetTaskQuery_task_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface GetTaskQuery_task_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface GetTaskQuery_task_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface GetTaskQuery_task_project_taskTags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface GetTaskQuery_task_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  organization: GetTaskQuery_task_project_organization;
  taskTags: GetTaskQuery_task_project_taskTags[];
}

export interface GetTaskQuery_task_parentTask {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
}

export interface GetTaskQuery_task_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetTaskQuery_task_githubPullRequests {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatus;
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
  repo: string;
  organization: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
}

export interface GetTaskQuery_task_githubIssue {
  __typename: "GithubIssue";
  id: Scalar.UUID;
  number: number;
  link: string | null;
}

export interface GetTaskQuery_task_nfts_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetTaskQuery_task_nfts_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: GetTaskQuery_task_nfts_payment_paymentMethod_network;
}

export interface GetTaskQuery_task_nfts_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetTaskQuery_task_nfts_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: GetTaskQuery_task_nfts_payment_paymentMethod;
  network: GetTaskQuery_task_nfts_payment_network;
}

export interface GetTaskQuery_task_nfts {
  __typename: "TaskNFT";
  id: Scalar.UUID;
  tokenId: number;
  createdAt: Scalar.DateTime;
  contractAddress: string;
  explorerUrl: string;
  payment: GetTaskQuery_task_nfts_payment;
}

export interface GetTaskQuery_task_auditLog_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetTaskQuery_task_auditLog {
  __typename: "AuditLogEvent";
  id: Scalar.UUID;
  createdAt: Scalar.DateTime;
  user: GetTaskQuery_task_auditLog_user | null;
  sessionId: Scalar.UUID | null;
  diff: Scalar.JSONObject[];
}

export interface GetTaskQuery_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: GetTaskQuery_task_subtasks[];
  tags: GetTaskQuery_task_tags[];
  skills: GetTaskQuery_task_skills[];
  assignees: GetTaskQuery_task_assignees[];
  owners: GetTaskQuery_task_owners[];
  reward: GetTaskQuery_task_reward | null;
  applications: GetTaskQuery_task_applications[];
  submissions: GetTaskQuery_task_submissions[];
  review: GetTaskQuery_task_review | null;
  reactions: GetTaskQuery_task_reactions[];
  gitBranchName: string;
  permalink: string;
  project: GetTaskQuery_task_project;
  parentTask: GetTaskQuery_task_parentTask | null;
  creator: GetTaskQuery_task_creator | null;
  githubPullRequests: GetTaskQuery_task_githubPullRequests[];
  githubBranches: GetTaskQuery_task_githubBranches[];
  githubIssue: GetTaskQuery_task_githubIssue | null;
  nfts: GetTaskQuery_task_nfts[];
  auditLog: GetTaskQuery_task_auditLog[];
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
// GraphQL query operation: GetTaskReactionUsersQuery
// ====================================================

export interface GetTaskReactionUsersQuery_task_reactions_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetTaskReactionUsersQuery_task_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
  user: GetTaskReactionUsersQuery_task_reactions_user;
}

export interface GetTaskReactionUsersQuery_task {
  __typename: "Task";
  id: Scalar.UUID;
  reactions: GetTaskReactionUsersQuery_task_reactions[];
}

export interface GetTaskReactionUsersQuery {
  task: GetTaskReactionUsersQuery_task;
}

export interface GetTaskReactionUsersQueryVariables {
  taskId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPaginatedTasksQuery
// ====================================================

export interface GetPaginatedTasksQuery_paginated_tasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface GetPaginatedTasksQuery_paginated_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface GetPaginatedTasksQuery_paginated_tasks_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface GetPaginatedTasksQuery_paginated_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetPaginatedTasksQuery_paginated_tasks_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetPaginatedTasksQuery_paginated_tasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetPaginatedTasksQuery_paginated_tasks_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetPaginatedTasksQuery_paginated_tasks_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetPaginatedTasksQuery_paginated_tasks_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: GetPaginatedTasksQuery_paginated_tasks_reward_payments_payment_paymentMethod_network;
}

export interface GetPaginatedTasksQuery_paginated_tasks_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetPaginatedTasksQuery_paginated_tasks_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: GetPaginatedTasksQuery_paginated_tasks_reward_payments_payment_paymentMethod;
  network: GetPaginatedTasksQuery_paginated_tasks_reward_payments_payment_network;
}

export interface GetPaginatedTasksQuery_paginated_tasks_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: GetPaginatedTasksQuery_paginated_tasks_reward_payments_user;
  payment: GetPaginatedTasksQuery_paginated_tasks_reward_payments_payment;
}

export interface GetPaginatedTasksQuery_paginated_tasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: GetPaginatedTasksQuery_paginated_tasks_reward_token;
  payments: GetPaginatedTasksQuery_paginated_tasks_reward_payments[];
}

export interface GetPaginatedTasksQuery_paginated_tasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface GetPaginatedTasksQuery_paginated_tasks_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface GetPaginatedTasksQuery_paginated_tasks_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface GetPaginatedTasksQuery_paginated_tasks_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface GetPaginatedTasksQuery_paginated_tasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: GetPaginatedTasksQuery_paginated_tasks_subtasks[];
  tags: GetPaginatedTasksQuery_paginated_tasks_tags[];
  skills: GetPaginatedTasksQuery_paginated_tasks_skills[];
  assignees: GetPaginatedTasksQuery_paginated_tasks_assignees[];
  owners: GetPaginatedTasksQuery_paginated_tasks_owners[];
  reward: GetPaginatedTasksQuery_paginated_tasks_reward | null;
  applications: GetPaginatedTasksQuery_paginated_tasks_applications[];
  submissions: GetPaginatedTasksQuery_paginated_tasks_submissions[];
  review: GetPaginatedTasksQuery_paginated_tasks_review | null;
  reactions: GetPaginatedTasksQuery_paginated_tasks_reactions[];
}

export interface GetPaginatedTasksQuery_paginated {
  __typename: "TaskSearchResponse";
  total: number;
  cursor: string | null;
  tasks: GetPaginatedTasksQuery_paginated_tasks[];
}

export interface GetPaginatedTasksQuery {
  paginated: GetPaginatedTasksQuery_paginated;
}

export interface GetPaginatedTasksQueryVariables {
  filter: SearchTasksInput;
  cursor?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPaginatedTasksWithOrganizationQuery
// ====================================================

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: GetPaginatedTasksWithOrganizationQuery_paginated_tasks_reward_payments_payment_paymentMethod_network;
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: GetPaginatedTasksWithOrganizationQuery_paginated_tasks_reward_payments_payment_paymentMethod;
  network: GetPaginatedTasksWithOrganizationQuery_paginated_tasks_reward_payments_payment_network;
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: GetPaginatedTasksWithOrganizationQuery_paginated_tasks_reward_payments_user;
  payment: GetPaginatedTasksWithOrganizationQuery_paginated_tasks_reward_payments_payment;
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: GetPaginatedTasksWithOrganizationQuery_paginated_tasks_reward_token;
  payments: GetPaginatedTasksWithOrganizationQuery_paginated_tasks_reward_payments[];
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  organization: GetPaginatedTasksWithOrganizationQuery_paginated_tasks_project_organization;
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated_tasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: GetPaginatedTasksWithOrganizationQuery_paginated_tasks_subtasks[];
  tags: GetPaginatedTasksWithOrganizationQuery_paginated_tasks_tags[];
  skills: GetPaginatedTasksWithOrganizationQuery_paginated_tasks_skills[];
  assignees: GetPaginatedTasksWithOrganizationQuery_paginated_tasks_assignees[];
  owners: GetPaginatedTasksWithOrganizationQuery_paginated_tasks_owners[];
  reward: GetPaginatedTasksWithOrganizationQuery_paginated_tasks_reward | null;
  applications: GetPaginatedTasksWithOrganizationQuery_paginated_tasks_applications[];
  submissions: GetPaginatedTasksWithOrganizationQuery_paginated_tasks_submissions[];
  review: GetPaginatedTasksWithOrganizationQuery_paginated_tasks_review | null;
  reactions: GetPaginatedTasksWithOrganizationQuery_paginated_tasks_reactions[];
  project: GetPaginatedTasksWithOrganizationQuery_paginated_tasks_project;
}

export interface GetPaginatedTasksWithOrganizationQuery_paginated {
  __typename: "TaskSearchResponse";
  total: number;
  cursor: string | null;
  tasks: GetPaginatedTasksWithOrganizationQuery_paginated_tasks[];
}

export interface GetPaginatedTasksWithOrganizationQuery {
  paginated: GetPaginatedTasksWithOrganizationQuery_paginated;
}

export interface GetPaginatedTasksWithOrganizationQueryVariables {
  filter: SearchTasksInput;
  cursor?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTasksToPayQuery
// ====================================================

export interface GetTasksToPayQuery_tasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface GetTasksToPayQuery_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface GetTasksToPayQuery_tasks_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface GetTasksToPayQuery_tasks_assignees_threepids {
  __typename: "Threepid";
  source: ThreepidSource;
  address: string;
}

export interface GetTasksToPayQuery_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
  threepids: GetTasksToPayQuery_tasks_assignees_threepids[];
}

export interface GetTasksToPayQuery_tasks_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetTasksToPayQuery_tasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetTasksToPayQuery_tasks_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetTasksToPayQuery_tasks_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetTasksToPayQuery_tasks_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: GetTasksToPayQuery_tasks_reward_payments_payment_paymentMethod_network;
}

export interface GetTasksToPayQuery_tasks_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetTasksToPayQuery_tasks_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: GetTasksToPayQuery_tasks_reward_payments_payment_paymentMethod;
  network: GetTasksToPayQuery_tasks_reward_payments_payment_network;
}

export interface GetTasksToPayQuery_tasks_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: GetTasksToPayQuery_tasks_reward_payments_user;
  payment: GetTasksToPayQuery_tasks_reward_payments_payment;
}

export interface GetTasksToPayQuery_tasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: GetTasksToPayQuery_tasks_reward_token;
  payments: GetTasksToPayQuery_tasks_reward_payments[];
}

export interface GetTasksToPayQuery_tasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface GetTasksToPayQuery_tasks_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface GetTasksToPayQuery_tasks_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface GetTasksToPayQuery_tasks_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface GetTasksToPayQuery_tasks_project_paymentMethods_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetTasksToPayQuery_tasks_project_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: GetTasksToPayQuery_tasks_project_paymentMethods_network;
}

export interface GetTasksToPayQuery_tasks_project {
  __typename: "Project";
  id: Scalar.UUID;
  paymentMethods: GetTasksToPayQuery_tasks_project_paymentMethods[];
}

export interface GetTasksToPayQuery_tasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: GetTasksToPayQuery_tasks_subtasks[];
  tags: GetTasksToPayQuery_tasks_tags[];
  skills: GetTasksToPayQuery_tasks_skills[];
  assignees: GetTasksToPayQuery_tasks_assignees[];
  owners: GetTasksToPayQuery_tasks_owners[];
  reward: GetTasksToPayQuery_tasks_reward | null;
  applications: GetTasksToPayQuery_tasks_applications[];
  submissions: GetTasksToPayQuery_tasks_submissions[];
  review: GetTasksToPayQuery_tasks_review | null;
  reactions: GetTasksToPayQuery_tasks_reactions[];
  project: GetTasksToPayQuery_tasks_project;
}

export interface GetTasksToPayQuery {
  tasks: GetTasksToPayQuery_tasks[];
}

export interface GetTasksToPayQueryVariables {
  input: GetTasksInput;
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
  type: string;
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
  permalink: string;
}

export interface GetInviteQuery_invite_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface GetInviteQuery_invite_project_tokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetInviteQuery_invite_project_tokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: GetInviteQuery_invite_project_tokenGates_token_network;
}

export interface GetInviteQuery_invite_project_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  token: GetInviteQuery_invite_project_tokenGates_token;
}

export interface GetInviteQuery_invite_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  tokenGates: GetInviteQuery_invite_project_tokenGates[];
}

export interface GetInviteQuery_invite_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  permalink: string;
}

export interface GetInviteQuery_invite {
  __typename: "Invite";
  id: Scalar.UUID;
  permalink: string;
  inviter: GetInviteQuery_invite_inviter;
  organization: GetInviteQuery_invite_organization | null;
  project: GetInviteQuery_invite_project | null;
  task: GetInviteQuery_invite_task | null;
  permission: RulePermission;
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
// GraphQL query operation: GetPaymentNetworksQuery
// ====================================================

export interface GetPaymentNetworksQuery_networks_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetPaymentNetworksQuery_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
  tokens: GetPaymentNetworksQuery_networks_tokens[];
}

export interface GetPaymentNetworksQuery {
  networks: GetPaymentNetworksQuery_networks[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationGithubReposQuery
// ====================================================

export interface GetOrganizationGithubReposQuery_repos {
  __typename: "GithubRepo";
  id: string;
  name: string;
  organization: string;
  integrationId: Scalar.UUID;
}

export interface GetOrganizationGithubReposQuery {
  repos: GetOrganizationGithubReposQuery_repos[] | null;
}

export interface GetOrganizationGithubReposQueryVariables {
  organizationId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationDiscordChannelsQuery
// ====================================================

export interface GetOrganizationDiscordChannelsQuery_channels {
  __typename: "DiscordIntegrationChannel";
  id: string;
  name: string;
  integrationId: Scalar.UUID;
  permissions: string[];
}

export interface GetOrganizationDiscordChannelsQuery {
  channels: GetOrganizationDiscordChannelsQuery_channels[] | null;
}

export interface GetOrganizationDiscordChannelsQueryVariables {
  organizationId: Scalar.UUID;
  discordParentChannelId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTrelloBoardsQuery
// ====================================================

export interface GetTrelloBoardsQuery_trelloBoards {
  __typename: "TrelloBoard";
  id: string;
  name: string;
}

export interface GetTrelloBoardsQuery {
  trelloBoards: GetTrelloBoardsQuery_trelloBoards[];
}

export interface GetTrelloBoardsQueryVariables {
  threepidId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNotionDatabasesQuery
// ====================================================

export interface GetNotionDatabasesQuery_notionDatabases {
  __typename: "NotionDatabase";
  id: string;
  name: string;
}

export interface GetNotionDatabasesQuery {
  notionDatabases: GetNotionDatabasesQuery_notionDatabases[];
}

export interface GetNotionDatabasesQueryVariables {
  threepidId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetDiscordGuildMembershipStateQuery
// ====================================================

export interface GetDiscordGuildMembershipStateQuery {
  state: DiscordGuildMembershipState;
}

export interface GetDiscordGuildMembershipStateQueryVariables {
  organizationId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetDiscordGuildRolesQuery
// ====================================================

export interface GetDiscordGuildRolesQuery_roles {
  __typename: "DiscordIntegrationRole";
  id: string;
  name: string;
}

export interface GetDiscordGuildRolesQuery {
  roles: GetDiscordGuildRolesQuery_roles[] | null;
}

export interface GetDiscordGuildRolesQueryVariables {
  organizationId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetFundingSessionQuery
// ====================================================

export interface GetFundingSessionQuery_session_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetFundingSessionQuery_session_votes {
  __typename: "FundingVote";
  id: Scalar.UUID;
  taskId: string;
  weight: number;
  userId: string;
}

export interface GetFundingSessionQuery_session_voters {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface GetFundingSessionQuery_session_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
}

export interface GetFundingSessionQuery_session_rewards_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetFundingSessionQuery_session_rewards_task_parentTask {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  permalink: string;
}

export interface GetFundingSessionQuery_session_rewards_task {
  __typename: "Task";
  id: Scalar.UUID;
  parentTask: GetFundingSessionQuery_session_rewards_task_parentTask | null;
}

export interface GetFundingSessionQuery_session_rewards {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  token: GetFundingSessionQuery_session_rewards_token;
  task: GetFundingSessionQuery_session_rewards_task;
}

export interface GetFundingSessionQuery_session {
  __typename: "FundingSession";
  id: Scalar.UUID;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  closedAt: Scalar.DateTime | null;
  amount: string;
  permalink: string;
  organizationId: string;
  token: GetFundingSessionQuery_session_token;
  votes: GetFundingSessionQuery_session_votes[];
  voters: GetFundingSessionQuery_session_voters[];
  projects: GetFundingSessionQuery_session_projects[];
  rewards: GetFundingSessionQuery_session_rewards[];
}

export interface GetFundingSessionQuery {
  session: GetFundingSessionQuery_session;
}

export interface GetFundingSessionQueryVariables {
  id: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyNotificationsQuery
// ====================================================

export interface MyNotificationsQuery_me_notificationReadMarker {
  __typename: "NotificationReadMarker";
  readAt: Scalar.DateTime;
}

export interface MyNotificationsQuery_me_notifications_task_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface MyNotificationsQuery_me_notifications_task_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  organization: MyNotificationsQuery_me_notifications_task_project_organization;
}

export interface MyNotificationsQuery_me_notifications_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  permalink: string;
  project: MyNotificationsQuery_me_notifications_task_project;
}

export interface MyNotificationsQuery_me_notifications {
  __typename: "Notification";
  id: Scalar.UUID;
  message: string;
  archivedAt: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  task: MyNotificationsQuery_me_notifications_task;
}

export interface MyNotificationsQuery_me {
  __typename: "User";
  id: Scalar.UUID;
  notificationUnreadCount: number;
  notificationReadMarker: MyNotificationsQuery_me_notificationReadMarker | null;
  notifications: MyNotificationsQuery_me_notifications[];
}

export interface MyNotificationsQuery {
  me: MyNotificationsQuery_me;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyNotificationUnreadCountQuery
// ====================================================

export interface MyNotificationUnreadCountQuery_me {
  __typename: "User";
  id: Scalar.UUID;
  notificationUnreadCount: number;
}

export interface MyNotificationUnreadCountQuery {
  me: MyNotificationUnreadCountQuery_me;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProjectPaymentMethodsQuery
// ====================================================

export interface GetProjectPaymentMethodsQuery_project_paymentMethods_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetProjectPaymentMethodsQuery_project_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: GetProjectPaymentMethodsQuery_project_paymentMethods_network;
}

export interface GetProjectPaymentMethodsQuery_project {
  __typename: "Project";
  id: Scalar.UUID;
  paymentMethods: GetProjectPaymentMethodsQuery_project_paymentMethods[];
}

export interface GetProjectPaymentMethodsQuery {
  project: GetProjectPaymentMethodsQuery_project;
}

export interface GetProjectPaymentMethodsQueryVariables {
  projectId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationPaymentMethodsQuery
// ====================================================

export interface GetOrganizationPaymentMethodsQuery_organization_projects_paymentMethods_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetOrganizationPaymentMethodsQuery_organization_projects_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: GetOrganizationPaymentMethodsQuery_organization_projects_paymentMethods_network;
}

export interface GetOrganizationPaymentMethodsQuery_organization_projects {
  __typename: "Project";
  id: Scalar.UUID;
  paymentMethods: GetOrganizationPaymentMethodsQuery_organization_projects_paymentMethods[];
}

export interface GetOrganizationPaymentMethodsQuery_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  projects: GetOrganizationPaymentMethodsQuery_organization_projects[];
}

export interface GetOrganizationPaymentMethodsQuery {
  organization: GetOrganizationPaymentMethodsQuery_organization;
}

export interface GetOrganizationPaymentMethodsQueryVariables {
  organizationId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSkillsQuery
// ====================================================

export interface GetSkillsQuery_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface GetSkillsQuery {
  skills: GetSkillsQuery_skills[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: TaskCreatedSubscription
// ====================================================

export interface TaskCreatedSubscription_task_subtasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface TaskCreatedSubscription_task_subtasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface TaskCreatedSubscription_task_subtasks_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface TaskCreatedSubscription_task_subtasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskCreatedSubscription_task_subtasks_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskCreatedSubscription_task_subtasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskCreatedSubscription_task_subtasks_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskCreatedSubscription_task_subtasks_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskCreatedSubscription_task_subtasks_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: TaskCreatedSubscription_task_subtasks_reward_payments_payment_paymentMethod_network;
}

export interface TaskCreatedSubscription_task_subtasks_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskCreatedSubscription_task_subtasks_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskCreatedSubscription_task_subtasks_reward_payments_payment_paymentMethod;
  network: TaskCreatedSubscription_task_subtasks_reward_payments_payment_network;
}

export interface TaskCreatedSubscription_task_subtasks_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: TaskCreatedSubscription_task_subtasks_reward_payments_user;
  payment: TaskCreatedSubscription_task_subtasks_reward_payments_payment;
}

export interface TaskCreatedSubscription_task_subtasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: TaskCreatedSubscription_task_subtasks_reward_token;
  payments: TaskCreatedSubscription_task_subtasks_reward_payments[];
}

export interface TaskCreatedSubscription_task_subtasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface TaskCreatedSubscription_task_subtasks_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface TaskCreatedSubscription_task_subtasks_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface TaskCreatedSubscription_task_subtasks_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface TaskCreatedSubscription_task_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
  description: string | null;
  priority: TaskPriority;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: TaskCreatedSubscription_task_subtasks_subtasks[];
  tags: TaskCreatedSubscription_task_subtasks_tags[];
  skills: TaskCreatedSubscription_task_subtasks_skills[];
  assignees: TaskCreatedSubscription_task_subtasks_assignees[];
  owners: TaskCreatedSubscription_task_subtasks_owners[];
  reward: TaskCreatedSubscription_task_subtasks_reward | null;
  applications: TaskCreatedSubscription_task_subtasks_applications[];
  submissions: TaskCreatedSubscription_task_subtasks_submissions[];
  review: TaskCreatedSubscription_task_subtasks_review | null;
  reactions: TaskCreatedSubscription_task_subtasks_reactions[];
}

export interface TaskCreatedSubscription_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface TaskCreatedSubscription_task_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface TaskCreatedSubscription_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskCreatedSubscription_task_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskCreatedSubscription_task_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskCreatedSubscription_task_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskCreatedSubscription_task_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskCreatedSubscription_task_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: TaskCreatedSubscription_task_reward_payments_payment_paymentMethod_network;
}

export interface TaskCreatedSubscription_task_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskCreatedSubscription_task_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskCreatedSubscription_task_reward_payments_payment_paymentMethod;
  network: TaskCreatedSubscription_task_reward_payments_payment_network;
}

export interface TaskCreatedSubscription_task_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: TaskCreatedSubscription_task_reward_payments_user;
  payment: TaskCreatedSubscription_task_reward_payments_payment;
}

export interface TaskCreatedSubscription_task_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: TaskCreatedSubscription_task_reward_token;
  payments: TaskCreatedSubscription_task_reward_payments[];
}

export interface TaskCreatedSubscription_task_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskCreatedSubscription_task_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  createdAt: Scalar.DateTime;
  discordThreadUrl: string | null;
  user: TaskCreatedSubscription_task_applications_user;
}

export interface TaskCreatedSubscription_task_submissions_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskCreatedSubscription_task_submissions_approver {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskCreatedSubscription_task_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
  createdAt: Scalar.DateTime;
  taskId: string;
  user: TaskCreatedSubscription_task_submissions_user;
  approver: TaskCreatedSubscription_task_submissions_approver | null;
}

export interface TaskCreatedSubscription_task_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface TaskCreatedSubscription_task_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface TaskCreatedSubscription_task_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface TaskCreatedSubscription_task_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  organization: TaskCreatedSubscription_task_project_organization;
}

export interface TaskCreatedSubscription_task_parentTask {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
}

export interface TaskCreatedSubscription_task_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskCreatedSubscription_task_githubPullRequests {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatus;
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
  repo: string;
  organization: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
}

export interface TaskCreatedSubscription_task_githubIssue {
  __typename: "GithubIssue";
  id: Scalar.UUID;
  number: number;
  link: string | null;
}

export interface TaskCreatedSubscription_task_nfts_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskCreatedSubscription_task_nfts_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: TaskCreatedSubscription_task_nfts_payment_paymentMethod_network;
}

export interface TaskCreatedSubscription_task_nfts_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskCreatedSubscription_task_nfts_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskCreatedSubscription_task_nfts_payment_paymentMethod;
  network: TaskCreatedSubscription_task_nfts_payment_network;
}

export interface TaskCreatedSubscription_task_nfts {
  __typename: "TaskNFT";
  id: Scalar.UUID;
  tokenId: number;
  createdAt: Scalar.DateTime;
  contractAddress: string;
  explorerUrl: string;
  payment: TaskCreatedSubscription_task_nfts_payment;
}

export interface TaskCreatedSubscription_task_auditLog_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskCreatedSubscription_task_auditLog {
  __typename: "AuditLogEvent";
  id: Scalar.UUID;
  createdAt: Scalar.DateTime;
  user: TaskCreatedSubscription_task_auditLog_user | null;
  sessionId: Scalar.UUID | null;
  diff: Scalar.JSONObject[];
}

export interface TaskCreatedSubscription_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: TaskCreatedSubscription_task_subtasks[];
  tags: TaskCreatedSubscription_task_tags[];
  skills: TaskCreatedSubscription_task_skills[];
  assignees: TaskCreatedSubscription_task_assignees[];
  owners: TaskCreatedSubscription_task_owners[];
  reward: TaskCreatedSubscription_task_reward | null;
  applications: TaskCreatedSubscription_task_applications[];
  submissions: TaskCreatedSubscription_task_submissions[];
  review: TaskCreatedSubscription_task_review | null;
  reactions: TaskCreatedSubscription_task_reactions[];
  gitBranchName: string;
  permalink: string;
  project: TaskCreatedSubscription_task_project;
  parentTask: TaskCreatedSubscription_task_parentTask | null;
  creator: TaskCreatedSubscription_task_creator | null;
  githubPullRequests: TaskCreatedSubscription_task_githubPullRequests[];
  githubBranches: TaskCreatedSubscription_task_githubBranches[];
  githubIssue: TaskCreatedSubscription_task_githubIssue | null;
  nfts: TaskCreatedSubscription_task_nfts[];
  auditLog: TaskCreatedSubscription_task_auditLog[];
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

export interface TaskUpdatedSubscription_task_subtasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface TaskUpdatedSubscription_task_subtasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface TaskUpdatedSubscription_task_subtasks_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface TaskUpdatedSubscription_task_subtasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskUpdatedSubscription_task_subtasks_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskUpdatedSubscription_task_subtasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskUpdatedSubscription_task_subtasks_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskUpdatedSubscription_task_subtasks_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskUpdatedSubscription_task_subtasks_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: TaskUpdatedSubscription_task_subtasks_reward_payments_payment_paymentMethod_network;
}

export interface TaskUpdatedSubscription_task_subtasks_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskUpdatedSubscription_task_subtasks_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskUpdatedSubscription_task_subtasks_reward_payments_payment_paymentMethod;
  network: TaskUpdatedSubscription_task_subtasks_reward_payments_payment_network;
}

export interface TaskUpdatedSubscription_task_subtasks_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: TaskUpdatedSubscription_task_subtasks_reward_payments_user;
  payment: TaskUpdatedSubscription_task_subtasks_reward_payments_payment;
}

export interface TaskUpdatedSubscription_task_subtasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: TaskUpdatedSubscription_task_subtasks_reward_token;
  payments: TaskUpdatedSubscription_task_subtasks_reward_payments[];
}

export interface TaskUpdatedSubscription_task_subtasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface TaskUpdatedSubscription_task_subtasks_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface TaskUpdatedSubscription_task_subtasks_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface TaskUpdatedSubscription_task_subtasks_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface TaskUpdatedSubscription_task_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
  description: string | null;
  priority: TaskPriority;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: TaskUpdatedSubscription_task_subtasks_subtasks[];
  tags: TaskUpdatedSubscription_task_subtasks_tags[];
  skills: TaskUpdatedSubscription_task_subtasks_skills[];
  assignees: TaskUpdatedSubscription_task_subtasks_assignees[];
  owners: TaskUpdatedSubscription_task_subtasks_owners[];
  reward: TaskUpdatedSubscription_task_subtasks_reward | null;
  applications: TaskUpdatedSubscription_task_subtasks_applications[];
  submissions: TaskUpdatedSubscription_task_subtasks_submissions[];
  review: TaskUpdatedSubscription_task_subtasks_review | null;
  reactions: TaskUpdatedSubscription_task_subtasks_reactions[];
}

export interface TaskUpdatedSubscription_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface TaskUpdatedSubscription_task_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface TaskUpdatedSubscription_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskUpdatedSubscription_task_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskUpdatedSubscription_task_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskUpdatedSubscription_task_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskUpdatedSubscription_task_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskUpdatedSubscription_task_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: TaskUpdatedSubscription_task_reward_payments_payment_paymentMethod_network;
}

export interface TaskUpdatedSubscription_task_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskUpdatedSubscription_task_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskUpdatedSubscription_task_reward_payments_payment_paymentMethod;
  network: TaskUpdatedSubscription_task_reward_payments_payment_network;
}

export interface TaskUpdatedSubscription_task_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: TaskUpdatedSubscription_task_reward_payments_user;
  payment: TaskUpdatedSubscription_task_reward_payments_payment;
}

export interface TaskUpdatedSubscription_task_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: TaskUpdatedSubscription_task_reward_token;
  payments: TaskUpdatedSubscription_task_reward_payments[];
}

export interface TaskUpdatedSubscription_task_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskUpdatedSubscription_task_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  createdAt: Scalar.DateTime;
  discordThreadUrl: string | null;
  user: TaskUpdatedSubscription_task_applications_user;
}

export interface TaskUpdatedSubscription_task_submissions_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskUpdatedSubscription_task_submissions_approver {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskUpdatedSubscription_task_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
  createdAt: Scalar.DateTime;
  taskId: string;
  user: TaskUpdatedSubscription_task_submissions_user;
  approver: TaskUpdatedSubscription_task_submissions_approver | null;
}

export interface TaskUpdatedSubscription_task_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface TaskUpdatedSubscription_task_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface TaskUpdatedSubscription_task_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface TaskUpdatedSubscription_task_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  organization: TaskUpdatedSubscription_task_project_organization;
}

export interface TaskUpdatedSubscription_task_parentTask {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
}

export interface TaskUpdatedSubscription_task_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskUpdatedSubscription_task_githubPullRequests {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatus;
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
  repo: string;
  organization: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
}

export interface TaskUpdatedSubscription_task_githubIssue {
  __typename: "GithubIssue";
  id: Scalar.UUID;
  number: number;
  link: string | null;
}

export interface TaskUpdatedSubscription_task_nfts_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskUpdatedSubscription_task_nfts_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: TaskUpdatedSubscription_task_nfts_payment_paymentMethod_network;
}

export interface TaskUpdatedSubscription_task_nfts_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskUpdatedSubscription_task_nfts_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskUpdatedSubscription_task_nfts_payment_paymentMethod;
  network: TaskUpdatedSubscription_task_nfts_payment_network;
}

export interface TaskUpdatedSubscription_task_nfts {
  __typename: "TaskNFT";
  id: Scalar.UUID;
  tokenId: number;
  createdAt: Scalar.DateTime;
  contractAddress: string;
  explorerUrl: string;
  payment: TaskUpdatedSubscription_task_nfts_payment;
}

export interface TaskUpdatedSubscription_task_auditLog_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskUpdatedSubscription_task_auditLog {
  __typename: "AuditLogEvent";
  id: Scalar.UUID;
  createdAt: Scalar.DateTime;
  user: TaskUpdatedSubscription_task_auditLog_user | null;
  sessionId: Scalar.UUID | null;
  diff: Scalar.JSONObject[];
}

export interface TaskUpdatedSubscription_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: TaskUpdatedSubscription_task_subtasks[];
  tags: TaskUpdatedSubscription_task_tags[];
  skills: TaskUpdatedSubscription_task_skills[];
  assignees: TaskUpdatedSubscription_task_assignees[];
  owners: TaskUpdatedSubscription_task_owners[];
  reward: TaskUpdatedSubscription_task_reward | null;
  applications: TaskUpdatedSubscription_task_applications[];
  submissions: TaskUpdatedSubscription_task_submissions[];
  review: TaskUpdatedSubscription_task_review | null;
  reactions: TaskUpdatedSubscription_task_reactions[];
  gitBranchName: string;
  permalink: string;
  project: TaskUpdatedSubscription_task_project;
  parentTask: TaskUpdatedSubscription_task_parentTask | null;
  creator: TaskUpdatedSubscription_task_creator | null;
  githubPullRequests: TaskUpdatedSubscription_task_githubPullRequests[];
  githubBranches: TaskUpdatedSubscription_task_githubBranches[];
  githubIssue: TaskUpdatedSubscription_task_githubIssue | null;
  nfts: TaskUpdatedSubscription_task_nfts[];
  auditLog: TaskUpdatedSubscription_task_auditLog[];
}

export interface TaskUpdatedSubscription {
  task: TaskUpdatedSubscription_task;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: PaymentUpdatedSubscription
// ====================================================

export interface PaymentUpdatedSubscription_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface PaymentUpdatedSubscription_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: PaymentUpdatedSubscription_payment_paymentMethod_network;
}

export interface PaymentUpdatedSubscription_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface PaymentUpdatedSubscription_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: PaymentUpdatedSubscription_payment_paymentMethod;
  network: PaymentUpdatedSubscription_payment_network;
}

export interface PaymentUpdatedSubscription {
  payment: PaymentUpdatedSubscription_payment;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: TaskRewardUpdatedSubscription
// ====================================================

export interface TaskRewardUpdatedSubscription_taskReward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskRewardUpdatedSubscription_taskReward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskRewardUpdatedSubscription_taskReward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskRewardUpdatedSubscription_taskReward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: TaskRewardUpdatedSubscription_taskReward_payments_payment_paymentMethod_network;
}

export interface TaskRewardUpdatedSubscription_taskReward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskRewardUpdatedSubscription_taskReward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskRewardUpdatedSubscription_taskReward_payments_payment_paymentMethod;
  network: TaskRewardUpdatedSubscription_taskReward_payments_payment_network;
}

export interface TaskRewardUpdatedSubscription_taskReward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: TaskRewardUpdatedSubscription_taskReward_payments_user;
  payment: TaskRewardUpdatedSubscription_taskReward_payments_payment;
}

export interface TaskRewardUpdatedSubscription_taskReward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: TaskRewardUpdatedSubscription_taskReward_token;
  payments: TaskRewardUpdatedSubscription_taskReward_payments[];
}

export interface TaskRewardUpdatedSubscription {
  taskReward: TaskRewardUpdatedSubscription_taskReward;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: EntityDetail
// ====================================================

export interface EntityDetail {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Rule
// ====================================================

export interface Rule {
  __typename: "Rule";
  id: Scalar.UUID;
  permission: RulePermission;
  inverted: boolean;
  taskId: string | null;
  projectId: string | null;
  fundingSessionId: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Role
// ====================================================

export interface Role {
  __typename: "Role";
  id: Scalar.UUID;
  name: string;
  color: string;
  source: RoleSource | null;
  fallback: boolean;
  userId: string | null;
  organizationId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Threepid
// ====================================================

export interface Threepid {
  __typename: "Threepid";
  source: ThreepidSource;
  threepid: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: RoleWithRules
// ====================================================

export interface RoleWithRules_rules {
  __typename: "Rule";
  id: Scalar.UUID;
  permission: RulePermission;
  inverted: boolean;
  taskId: string | null;
  projectId: string | null;
  fundingSessionId: string | null;
}

export interface RoleWithRules {
  __typename: "Role";
  id: Scalar.UUID;
  name: string;
  color: string;
  source: RoleSource | null;
  fallback: boolean;
  userId: string | null;
  organizationId: string;
  rules: RoleWithRules_rules[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserWithRoles
// ====================================================

export interface UserWithRoles_roles {
  __typename: "Role";
  id: Scalar.UUID;
  name: string;
  color: string;
  source: RoleSource | null;
  fallback: boolean;
  userId: string | null;
  organizationId: string;
}

export interface UserWithRoles {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
  roles: UserWithRoles_roles[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AuditLogEvent
// ====================================================

export interface AuditLogEvent_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface AuditLogEvent {
  __typename: "AuditLogEvent";
  id: Scalar.UUID;
  createdAt: Scalar.DateTime;
  user: AuditLogEvent_user | null;
  sessionId: Scalar.UUID | null;
  diff: Scalar.JSONObject[];
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
  tagline: string | null;
  permalink: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: OrganizationWithTokens
// ====================================================

export interface OrganizationWithTokens_tokens_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface OrganizationWithTokens_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: OrganizationWithTokens_tokens_network;
}

export interface OrganizationWithTokens {
  __typename: "Organization";
  id: Scalar.UUID;
  tokens: OrganizationWithTokens_tokens[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: OrganizationTag
// ====================================================

export interface OrganizationTag {
  __typename: "OrganizationTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TaskSection
// ====================================================

export interface TaskSection {
  __typename: "TaskSection";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
  projectId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: OrganizationIntegration
// ====================================================

export interface OrganizationIntegration {
  __typename: "OrganizationIntegration";
  id: Scalar.UUID;
  type: OrganizationIntegrationType;
  config: Scalar.JSONObject | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: OrganizationWithIntegrations
// ====================================================

export interface OrganizationWithIntegrations_integrations {
  __typename: "OrganizationIntegration";
  id: Scalar.UUID;
  type: OrganizationIntegrationType;
  config: Scalar.JSONObject | null;
}

export interface OrganizationWithIntegrations {
  __typename: "Organization";
  id: Scalar.UUID;
  integrations: OrganizationWithIntegrations_integrations[];
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
  type: string;
  config: Scalar.JSONObject;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProjectTokenGate
// ====================================================

export interface ProjectTokenGate_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface ProjectTokenGate_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: ProjectTokenGate_token_network;
}

export interface ProjectTokenGate {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  token: ProjectTokenGate_token;
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
  permalink: string;
}

export interface Invite_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface Invite_project_tokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface Invite_project_tokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: Invite_project_tokenGates_token_network;
}

export interface Invite_project_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  token: Invite_project_tokenGates_token;
}

export interface Invite_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  tokenGates: Invite_project_tokenGates[];
}

export interface Invite_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  permalink: string;
}

export interface Invite {
  __typename: "Invite";
  id: Scalar.UUID;
  permalink: string;
  inviter: Invite_inviter;
  organization: Invite_organization | null;
  project: Invite_project | null;
  task: Invite_task | null;
  permission: RulePermission;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProjectDetails
// ====================================================

export interface ProjectDetails_options {
  __typename: "ProjectOptions";
  showBacklogColumn: boolean | null;
  showCommunitySuggestions: boolean | null;
}

export interface ProjectDetails_tokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface ProjectDetails_tokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: ProjectDetails_tokenGates_token_network;
}

export interface ProjectDetails_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  token: ProjectDetails_tokenGates_token;
}

export interface ProjectDetails_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface ProjectDetails_taskSections {
  __typename: "TaskSection";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
  projectId: string;
}

export interface ProjectDetails_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface ProjectDetails_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface ProjectDetails_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: ProjectDetails_taskViews_filters[];
  sortBys: ProjectDetails_taskViews_sortBys[];
}

export interface ProjectDetails {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  options: ProjectDetails_options | null;
  tokenGates: ProjectDetails_tokenGates[];
  organization: ProjectDetails_organization;
  taskSections: ProjectDetails_taskSections[];
  taskViews: ProjectDetails_taskViews[];
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
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TaskReward
// ====================================================

export interface TaskReward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskReward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskReward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskReward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: TaskReward_payments_payment_paymentMethod_network;
}

export interface TaskReward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskReward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskReward_payments_payment_paymentMethod;
  network: TaskReward_payments_payment_network;
}

export interface TaskReward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: TaskReward_payments_user;
  payment: TaskReward_payments_payment;
}

export interface TaskReward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: TaskReward_token;
  payments: TaskReward_payments[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TaskReview
// ====================================================

export interface TaskReview {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
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
  status: GithubPullRequestStatus;
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
// GraphQL fragment: GithubIssue
// ====================================================

export interface GithubIssue {
  __typename: "GithubIssue";
  id: Scalar.UUID;
  number: number;
  link: string | null;
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
  repo: string;
  organization: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: GithubRepo
// ====================================================

export interface GithubRepo {
  __typename: "GithubRepo";
  id: string;
  name: string;
  organization: string;
  integrationId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: DiscordIntegrationChannel
// ====================================================

export interface DiscordIntegrationChannel {
  __typename: "DiscordIntegrationChannel";
  id: string;
  name: string;
  integrationId: Scalar.UUID;
  permissions: string[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: DiscordIntegrationRole
// ====================================================

export interface DiscordIntegrationRole {
  __typename: "DiscordIntegrationRole";
  id: string;
  name: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TaskApplication
// ====================================================

export interface TaskApplication_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskApplication {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  createdAt: Scalar.DateTime;
  userId: string;
  discordThreadUrl: string | null;
  user: TaskApplication_user;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TaskSubmission
// ====================================================

export interface TaskSubmission_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskSubmission_approver {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskSubmission {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  content: string;
  createdAt: Scalar.DateTime;
  taskId: string;
  userId: string;
  user: TaskSubmission_user;
  approver: TaskSubmission_approver | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TaskReaction
// ====================================================

export interface TaskReaction {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Task
// ====================================================

export interface Task_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface Task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface Task_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface Task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface Task_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface Task_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface Task_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface Task_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface Task_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: Task_reward_payments_payment_paymentMethod_network;
}

export interface Task_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface Task_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: Task_reward_payments_payment_paymentMethod;
  network: Task_reward_payments_payment_network;
}

export interface Task_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: Task_reward_payments_user;
  payment: Task_reward_payments_payment;
}

export interface Task_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: Task_reward_token;
  payments: Task_reward_payments[];
}

export interface Task_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface Task_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface Task_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface Task_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface Task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: Task_subtasks[];
  tags: Task_tags[];
  skills: Task_skills[];
  assignees: Task_assignees[];
  owners: Task_owners[];
  reward: Task_reward | null;
  applications: Task_applications[];
  submissions: Task_submissions[];
  review: Task_review | null;
  reactions: Task_reactions[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TaskWithOrganization
// ====================================================

export interface TaskWithOrganization_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface TaskWithOrganization_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface TaskWithOrganization_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface TaskWithOrganization_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskWithOrganization_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskWithOrganization_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskWithOrganization_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskWithOrganization_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskWithOrganization_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: TaskWithOrganization_reward_payments_payment_paymentMethod_network;
}

export interface TaskWithOrganization_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskWithOrganization_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskWithOrganization_reward_payments_payment_paymentMethod;
  network: TaskWithOrganization_reward_payments_payment_network;
}

export interface TaskWithOrganization_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: TaskWithOrganization_reward_payments_user;
  payment: TaskWithOrganization_reward_payments_payment;
}

export interface TaskWithOrganization_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: TaskWithOrganization_reward_token;
  payments: TaskWithOrganization_reward_payments[];
}

export interface TaskWithOrganization_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface TaskWithOrganization_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface TaskWithOrganization_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface TaskWithOrganization_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface TaskWithOrganization_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface TaskWithOrganization_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  organization: TaskWithOrganization_project_organization;
}

export interface TaskWithOrganization {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: TaskWithOrganization_subtasks[];
  tags: TaskWithOrganization_tags[];
  skills: TaskWithOrganization_skills[];
  assignees: TaskWithOrganization_assignees[];
  owners: TaskWithOrganization_owners[];
  reward: TaskWithOrganization_reward | null;
  applications: TaskWithOrganization_applications[];
  submissions: TaskWithOrganization_submissions[];
  review: TaskWithOrganization_review | null;
  reactions: TaskWithOrganization_reactions[];
  project: TaskWithOrganization_project;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TaskNFT
// ====================================================

export interface TaskNFT_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskNFT_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: TaskNFT_payment_paymentMethod_network;
}

export interface TaskNFT_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskNFT_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskNFT_payment_paymentMethod;
  network: TaskNFT_payment_network;
}

export interface TaskNFT {
  __typename: "TaskNFT";
  id: Scalar.UUID;
  tokenId: number;
  createdAt: Scalar.DateTime;
  contractAddress: string;
  explorerUrl: string;
  payment: TaskNFT_payment;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TaskDetails
// ====================================================

export interface TaskDetails_subtasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
}

export interface TaskDetails_subtasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface TaskDetails_subtasks_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface TaskDetails_subtasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskDetails_subtasks_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskDetails_subtasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskDetails_subtasks_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskDetails_subtasks_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskDetails_subtasks_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: TaskDetails_subtasks_reward_payments_payment_paymentMethod_network;
}

export interface TaskDetails_subtasks_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskDetails_subtasks_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskDetails_subtasks_reward_payments_payment_paymentMethod;
  network: TaskDetails_subtasks_reward_payments_payment_network;
}

export interface TaskDetails_subtasks_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: TaskDetails_subtasks_reward_payments_user;
  payment: TaskDetails_subtasks_reward_payments_payment;
}

export interface TaskDetails_subtasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: TaskDetails_subtasks_reward_token;
  payments: TaskDetails_subtasks_reward_payments[];
}

export interface TaskDetails_subtasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
}

export interface TaskDetails_subtasks_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
}

export interface TaskDetails_subtasks_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface TaskDetails_subtasks_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface TaskDetails_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
  description: string | null;
  priority: TaskPriority;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: TaskDetails_subtasks_subtasks[];
  tags: TaskDetails_subtasks_tags[];
  skills: TaskDetails_subtasks_skills[];
  assignees: TaskDetails_subtasks_assignees[];
  owners: TaskDetails_subtasks_owners[];
  reward: TaskDetails_subtasks_reward | null;
  applications: TaskDetails_subtasks_applications[];
  submissions: TaskDetails_subtasks_submissions[];
  review: TaskDetails_subtasks_review | null;
  reactions: TaskDetails_subtasks_reactions[];
}

export interface TaskDetails_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
}

export interface TaskDetails_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface TaskDetails_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskDetails_owners {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskDetails_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskDetails_reward_payments_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskDetails_reward_payments_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskDetails_reward_payments_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: TaskDetails_reward_payments_payment_paymentMethod_network;
}

export interface TaskDetails_reward_payments_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskDetails_reward_payments_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskDetails_reward_payments_payment_paymentMethod;
  network: TaskDetails_reward_payments_payment_network;
}

export interface TaskDetails_reward_payments {
  __typename: "TaskRewardPayment";
  id: Scalar.UUID;
  amount: string;
  user: TaskDetails_reward_payments_user;
  payment: TaskDetails_reward_payments_payment;
}

export interface TaskDetails_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  fundingSessionId: string | null;
  token: TaskDetails_reward_token;
  payments: TaskDetails_reward_payments[];
}

export interface TaskDetails_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskDetails_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  userId: string;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  createdAt: Scalar.DateTime;
  discordThreadUrl: string | null;
  user: TaskDetails_applications_user;
}

export interface TaskDetails_submissions_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskDetails_submissions_approver {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskDetails_submissions {
  __typename: "TaskSubmission";
  id: Scalar.UUID;
  userId: string;
  content: string;
  createdAt: Scalar.DateTime;
  taskId: string;
  user: TaskDetails_submissions_user;
  approver: TaskDetails_submissions_approver | null;
}

export interface TaskDetails_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface TaskDetails_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface TaskDetails_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface TaskDetails_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  organization: TaskDetails_project_organization;
}

export interface TaskDetails_parentTask {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
}

export interface TaskDetails_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskDetails_githubPullRequests {
  __typename: "GithubPullRequest";
  id: Scalar.UUID;
  title: string;
  link: string;
  status: GithubPullRequestStatus;
  number: number;
  branchName: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
}

export interface TaskDetails_githubBranches {
  __typename: "GithubBranch";
  id: Scalar.UUID;
  name: string;
  link: string;
  repo: string;
  organization: string;
  createdAt: Scalar.DateTime;
  updatedAt: Scalar.DateTime;
  deletedAt: Scalar.DateTime | null;
}

export interface TaskDetails_githubIssue {
  __typename: "GithubIssue";
  id: Scalar.UUID;
  number: number;
  link: string | null;
}

export interface TaskDetails_nfts_payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskDetails_nfts_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: TaskDetails_nfts_payment_paymentMethod_network;
}

export interface TaskDetails_nfts_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskDetails_nfts_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskDetails_nfts_payment_paymentMethod;
  network: TaskDetails_nfts_payment_network;
}

export interface TaskDetails_nfts {
  __typename: "TaskNFT";
  id: Scalar.UUID;
  tokenId: number;
  createdAt: Scalar.DateTime;
  contractAddress: string;
  explorerUrl: string;
  payment: TaskDetails_nfts_payment;
}

export interface TaskDetails_auditLog_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface TaskDetails_auditLog {
  __typename: "AuditLogEvent";
  id: Scalar.UUID;
  createdAt: Scalar.DateTime;
  user: TaskDetails_auditLog_user | null;
  sessionId: Scalar.UUID | null;
  diff: Scalar.JSONObject[];
}

export interface TaskDetails {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  sortKey: string;
  storyPoints: number | null;
  dueDate: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  doneAt: Scalar.DateTime | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  parentTaskId: string | null;
  sectionId: string | null;
  number: number;
  gating: TaskGatingType;
  subtasks: TaskDetails_subtasks[];
  tags: TaskDetails_tags[];
  skills: TaskDetails_skills[];
  assignees: TaskDetails_assignees[];
  owners: TaskDetails_owners[];
  reward: TaskDetails_reward | null;
  applications: TaskDetails_applications[];
  submissions: TaskDetails_submissions[];
  review: TaskDetails_review | null;
  reactions: TaskDetails_reactions[];
  gitBranchName: string;
  permalink: string;
  project: TaskDetails_project;
  parentTask: TaskDetails_parentTask | null;
  creator: TaskDetails_creator | null;
  githubPullRequests: TaskDetails_githubPullRequests[];
  githubBranches: TaskDetails_githubBranches[];
  githubIssue: TaskDetails_githubIssue | null;
  nfts: TaskDetails_nfts[];
  auditLog: TaskDetails_auditLog[];
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
  tagline: string | null;
  permalink: string;
}

export interface UserProfile_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface UserProfile_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface UserProfile {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
  bio: string | null;
  organizations: UserProfile_organizations[];
  details: UserProfile_details[];
  skills: UserProfile_skills[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserPrompt
// ====================================================

export interface UserPrompt {
  __typename: "UserPrompt";
  id: Scalar.UUID;
  type: string;
  createdAt: Scalar.DateTime;
  completedAt: Scalar.DateTime | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TaskGatingDefault
// ====================================================

export interface TaskGatingDefault_roles {
  __typename: "Role";
  id: Scalar.UUID;
}

export interface TaskGatingDefault {
  __typename: "TaskGatingDefault";
  id: Scalar.UUID;
  userId: string;
  projectId: string;
  type: TaskGatingType;
  roles: TaskGatingDefault_roles[];
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
  tagline: string | null;
  permalink: string;
}

export interface UserDetails_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface UserDetails_skills {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

export interface UserDetails_threepids {
  __typename: "Threepid";
  id: string;
  source: ThreepidSource;
  threepid: string;
}

export interface UserDetails_prompts {
  __typename: "UserPrompt";
  id: Scalar.UUID;
  type: string;
  createdAt: Scalar.DateTime;
  completedAt: Scalar.DateTime | null;
}

export interface UserDetails_taskGatingDefaults_roles {
  __typename: "Role";
  id: Scalar.UUID;
}

export interface UserDetails_taskGatingDefaults {
  __typename: "TaskGatingDefault";
  id: Scalar.UUID;
  userId: string;
  projectId: string;
  type: TaskGatingType;
  roles: UserDetails_taskGatingDefaults_roles[];
}

export interface UserDetails_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface UserDetails_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface UserDetails_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: UserDetails_taskViews_filters[];
  sortBys: UserDetails_taskViews_sortBys[];
}

export interface UserDetails {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
  bio: string | null;
  organizations: UserDetails_organizations[];
  details: UserDetails_details[];
  skills: UserDetails_skills[];
  threepids: UserDetails_threepids[];
  prompts: UserDetails_prompts[];
  taskGatingDefaults: UserDetails_taskGatingDefaults[];
  taskViews: UserDetails_taskViews[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: OrganizationDetails
// ====================================================

export interface OrganizationDetails_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  taskCount: number;
  doneTaskCount: number;
  openBountyTaskCount: number;
}

export interface OrganizationDetails_workspaces {
  __typename: "Workspace";
  id: Scalar.UUID;
  name: string;
  sortKey: string;
}

export interface OrganizationDetails_tags {
  __typename: "OrganizationTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface OrganizationDetails_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface OrganizationDetails_projectTokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface OrganizationDetails_projectTokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: OrganizationDetails_projectTokenGates_token_network;
}

export interface OrganizationDetails_projectTokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  token: OrganizationDetails_projectTokenGates_token;
}

export interface OrganizationDetails_taskViews_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface OrganizationDetails_taskViews_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface OrganizationDetails_taskViews {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: OrganizationDetails_taskViews_filters[];
  sortBys: OrganizationDetails_taskViews_sortBys[];
}

export interface OrganizationDetails_fundingSessions_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface OrganizationDetails_fundingSessions {
  __typename: "FundingSession";
  id: Scalar.UUID;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  closedAt: Scalar.DateTime | null;
  amount: string;
  permalink: string;
  organizationId: string;
  token: OrganizationDetails_fundingSessions_token;
}

export interface OrganizationDetails {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
  description: string | null;
  projects: OrganizationDetails_projects[];
  workspaces: OrganizationDetails_workspaces[];
  tags: OrganizationDetails_tags[];
  details: OrganizationDetails_details[];
  projectTokenGates: OrganizationDetails_projectTokenGates[];
  taskViews: OrganizationDetails_taskViews[];
  fundingSessions: OrganizationDetails_fundingSessions[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FundingVote
// ====================================================

export interface FundingVote {
  __typename: "FundingVote";
  id: Scalar.UUID;
  taskId: string;
  weight: number;
  userId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FundingSession
// ====================================================

export interface FundingSession_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface FundingSession {
  __typename: "FundingSession";
  id: Scalar.UUID;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  closedAt: Scalar.DateTime | null;
  amount: string;
  permalink: string;
  organizationId: string;
  token: FundingSession_token;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FundingSessionDetails
// ====================================================

export interface FundingSessionDetails_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface FundingSessionDetails_votes {
  __typename: "FundingVote";
  id: Scalar.UUID;
  taskId: string;
  weight: number;
  userId: string;
}

export interface FundingSessionDetails_voters {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  permalink: string;
}

export interface FundingSessionDetails_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
}

export interface FundingSessionDetails_rewards_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface FundingSessionDetails_rewards_task_parentTask {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  permalink: string;
}

export interface FundingSessionDetails_rewards_task {
  __typename: "Task";
  id: Scalar.UUID;
  parentTask: FundingSessionDetails_rewards_task_parentTask | null;
}

export interface FundingSessionDetails_rewards {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  peggedToUsd: boolean;
  token: FundingSessionDetails_rewards_token;
  task: FundingSessionDetails_rewards_task;
}

export interface FundingSessionDetails {
  __typename: "FundingSession";
  id: Scalar.UUID;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  closedAt: Scalar.DateTime | null;
  amount: string;
  permalink: string;
  organizationId: string;
  token: FundingSessionDetails_token;
  votes: FundingSessionDetails_votes[];
  voters: FundingSessionDetails_voters[];
  projects: FundingSessionDetails_projects[];
  rewards: FundingSessionDetails_rewards[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Notification
// ====================================================

export interface Notification_task_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  tagline: string | null;
  permalink: string;
}

export interface Notification_task_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
  organization: Notification_task_project_organization;
}

export interface Notification_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  permalink: string;
  project: Notification_task_project;
}

export interface Notification {
  __typename: "Notification";
  id: Scalar.UUID;
  message: string;
  archivedAt: Scalar.DateTime | null;
  createdAt: Scalar.DateTime;
  task: Notification_task;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PaymentNetwork
// ====================================================

export interface PaymentNetwork {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PaymentToken
// ====================================================

export interface PaymentToken {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  identifier: string | null;
  usdPrice: number | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PaymentMethod
// ====================================================

export interface PaymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface PaymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: PaymentMethod_network;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Payment
// ====================================================

export interface Payment_paymentMethod_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface Payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  network: Payment_paymentMethod_network;
}

export interface Payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: PaymentNetworkType;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface Payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: Payment_paymentMethod;
  network: Payment_network;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Project
// ====================================================

export interface Project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  workspaceId: string | null;
  sortKey: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Skill
// ====================================================

export interface Skill {
  __typename: "Skill";
  id: Scalar.UUID;
  name: string;
  emoji: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TaskViewFilter
// ====================================================

export interface TaskViewFilter {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TaskViewSortBy
// ====================================================

export interface TaskViewSortBy {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TaskView
// ====================================================

export interface TaskView_filters {
  __typename: "TaskViewFilter";
  type: TaskViewFilterType;
  tagIds: Scalar.UUID[] | null;
  roleIds: Scalar.UUID[] | null;
  ownerIds: Scalar.UUID[] | null;
  assigneeIds: (Scalar.UUID | null)[] | null;
  applicantIds: Scalar.UUID[] | null;
  statuses: TaskStatus[] | null;
  priorities: TaskPriority[] | null;
  skillIds: Scalar.UUID[] | null;
  subtasks: boolean | null;
}

export interface TaskView_sortBys {
  __typename: "TaskViewSortBy";
  field: TaskViewSortByField;
  direction: TaskViewSortByDirection;
}

export interface TaskView {
  __typename: "TaskView";
  id: Scalar.UUID;
  name: string;
  slug: string;
  type: TaskViewType;
  groupBy: TaskViewGroupBy;
  permalink: string;
  projectId: Scalar.UUID | null;
  organizationId: Scalar.UUID | null;
  userId: Scalar.UUID | null;
  fields: TaskViewField[];
  sortKey: string;
  filters: TaskView_filters[];
  sortBys: TaskView_sortBys[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Subtask
// ====================================================

export interface Subtask {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
  sortKey: string;
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
  permalink: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Workspace
// ====================================================

export interface Workspace {
  __typename: "Workspace";
  id: Scalar.UUID;
  name: string;
  sortKey: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum DiscordGuildMembershipState {
  HAS_SCOPE = "HAS_SCOPE",
  MEMBER = "MEMBER",
  MISSING_SCOPE = "MISSING_SCOPE",
}

export enum EntityDetailType {
  discord = "discord",
  github = "github",
  linkedin = "linkedin",
  location = "location",
  twitter = "twitter",
  website = "website",
}

export enum GithubPullRequestStatus {
  CLOSED = "CLOSED",
  DRAFT = "DRAFT",
  MERGED = "MERGED",
  OPEN = "OPEN",
}

export enum Language {
  CHINESE = "CHINESE",
  ENGLISH = "ENGLISH",
}

export enum OrganizationIntegrationType {
  COORDINAPE = "COORDINAPE",
  DISCORD = "DISCORD",
  GITHUB = "GITHUB",
}

export enum PaymentMethodType {
  GNOSIS_SAFE = "GNOSIS_SAFE",
  HIRO = "HIRO",
  METAMASK = "METAMASK",
  PHANTOM = "PHANTOM",
}

export enum PaymentNetworkType {
  ETHEREUM = "ETHEREUM",
  SOLANA = "SOLANA",
  STACKS = "STACKS",
}

export enum PaymentStatus {
  CONFIRMED = "CONFIRMED",
  FAILED = "FAILED",
  PROCESSING = "PROCESSING",
}

export enum PaymentTokenType {
  ERC1155 = "ERC1155",
  ERC20 = "ERC20",
  ERC721 = "ERC721",
  NATIVE = "NATIVE",
  SPL_TOKEN = "SPL_TOKEN",
  STACKS_TOKEN = "STACKS_TOKEN",
}

export enum PaymentTokenVisibility {
  ALWAYS = "ALWAYS",
  IF_HAS_BALANCE = "IF_HAS_BALANCE",
}

export enum ProjectIntegrationType {
  DISCORD = "DISCORD",
  DISCORD_ROLE_GATE = "DISCORD_ROLE_GATE",
  GITHUB = "GITHUB",
}

export enum ProjectRole {
  ADMIN = "ADMIN",
  CONTRIBUTOR = "CONTRIBUTOR",
}

export enum RoleSource {
  DISCORD = "DISCORD",
}

export enum RulePermission {
  MANAGE_FUNDING = "MANAGE_FUNDING",
  MANAGE_ORGANIZATION = "MANAGE_ORGANIZATION",
  MANAGE_PROJECTS = "MANAGE_PROJECTS",
  MANAGE_TASKS = "MANAGE_TASKS",
  VIEW_PROJECTS = "VIEW_PROJECTS",
}

export enum TaskGatingType {
  APPLICATION = "APPLICATION",
  ASSIGNEES = "ASSIGNEES",
  OPEN_SUBMISSION = "OPEN_SUBMISSION",
  ROLES = "ROLES",
}

export enum TaskPriority {
  HIGH = "HIGH",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  NONE = "NONE",
  URGENT = "URGENT",
}

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  COMMUNITY_SUGGESTIONS = "COMMUNITY_SUGGESTIONS",
  DONE = "DONE",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  TODO = "TODO",
}

export enum TaskViewField {
  assignees = "assignees",
  button = "button",
  createdAt = "createdAt",
  dueDate = "dueDate",
  gating = "gating",
  name = "name",
  number = "number",
  priority = "priority",
  reward = "reward",
  skills = "skills",
  status = "status",
  tags = "tags",
}

export enum TaskViewFilterType {
  APPLICANTS = "APPLICANTS",
  ASSIGNEES = "ASSIGNEES",
  OWNERS = "OWNERS",
  PRIORITIES = "PRIORITIES",
  ROLES = "ROLES",
  SKILLS = "SKILLS",
  STATUSES = "STATUSES",
  SUBTASKS = "SUBTASKS",
  TAGS = "TAGS",
}

export enum TaskViewGroupBy {
  status = "status",
}

export enum TaskViewSortByDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export enum TaskViewSortByField {
  createdAt = "createdAt",
  doneAt = "doneAt",
  dueDate = "dueDate",
  priority = "priority",
  reward = "reward",
  sortKey = "sortKey",
  votes = "votes",
}

export enum TaskViewType {
  BOARD = "BOARD",
  LIST = "LIST",
}

export enum ThreepidSource {
  discord = "discord",
  github = "github",
  hiro = "hiro",
  metamask = "metamask",
  notion = "notion",
  phantom = "phantom",
  trello = "trello",
}

export interface CreateFileUploadUrlInput {
  fileName: string;
  contentType: string;
}

export interface CreateFundingSessionInput {
  organizationId: Scalar.UUID;
  amount: string;
  tokenId: Scalar.UUID;
  projectIds: Scalar.UUID[];
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
}

export interface CreateHiroThreepidInput {
  mainnetAddress: string;
  testnetAddress: string;
}

export interface CreateInviteInput {
  organizationId?: Scalar.UUID | null;
  projectId?: Scalar.UUID | null;
  taskId?: Scalar.UUID | null;
  permission: RulePermission;
}

export interface CreateMetamaskThreepidInput {
  message: string;
  signature: string;
  address: string;
}

export interface CreateOrganizationInput {
  name: string;
  imageUrl?: string | null;
}

export interface CreateOrganizationIntegrationInput {
  type: OrganizationIntegrationType;
  config?: Scalar.JSONObject | null;
  organizationId: Scalar.UUID;
}

export interface CreateOrganizationTagInput {
  label: string;
  color: string;
  organizationId: Scalar.UUID;
}

export interface CreatePaymentMethodInput {
  type: PaymentMethodType;
  address: string;
  networkId: Scalar.UUID;
  projectId: Scalar.UUID;
}

export interface CreatePaymentTokenInput {
  type: PaymentTokenType;
  address: string;
  identifier?: string | null;
  name: string;
  symbol: string;
  exp: number;
  networkId: Scalar.UUID;
}

export interface CreatePhantomThreepidInput {
  message: string;
  signature: number[];
  address: string;
}

export interface CreateProjectInput {
  name: string;
  organizationId: Scalar.UUID;
  workspaceId?: Scalar.UUID | null;
  options?: ProjectOptionsInput | null;
}

export interface CreateProjectIntegrationInput {
  type: ProjectIntegrationType;
  config: Scalar.JSONObject;
  projectId: Scalar.UUID;
  organizationIntegrationId?: Scalar.UUID | null;
}

export interface CreateProjectsFromGithubInput {
  organizationId: Scalar.UUID;
  repoIds: string[];
}

export interface CreateProjectsFromNotionInput {
  organizationId: Scalar.UUID;
  threepidId: Scalar.UUID;
  databaseIds: string[];
}

export interface CreateProjectsFromTrelloInput {
  organizationId: Scalar.UUID;
  threepidId: Scalar.UUID;
  boardIds: string[];
}

export interface CreateRoleInput {
  name: string;
  color: string;
  organizationId: Scalar.UUID;
  userId?: Scalar.UUID | null;
}

export interface CreateRuleInput {
  permission: RulePermission;
  inverted?: boolean | null;
  roleId: Scalar.UUID;
  taskId?: Scalar.UUID | null;
  projectId?: Scalar.UUID | null;
  fundingSessionId?: Scalar.UUID | null;
}

export interface CreateTaskApplicationInput {
  taskId: Scalar.UUID;
  userId: Scalar.UUID;
  message?: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
}

export interface CreateTaskInput {
  name: string;
  description?: string | null;
  projectId: Scalar.UUID;
  parentTaskId?: Scalar.UUID | null;
  tagIds?: Scalar.UUID[] | null;
  skillIds?: Scalar.UUID[] | null;
  assigneeIds?: Scalar.UUID[] | null;
  ownerIds?: Scalar.UUID[] | null;
  storyPoints?: number | null;
  status: TaskStatus;
  priority?: TaskPriority | null;
  gating?: TaskGatingType | null;
  reward?: UpdateTaskRewardInput | null;
  dueDate?: Scalar.DateTime | null;
}

export interface CreateTaskPaymentsInput {
  payments: TaskRewardPaymentInput[];
  paymentMethodId: Scalar.UUID;
  networkId: Scalar.UUID;
  data?: Scalar.JSONObject | null;
}

export interface CreateTaskSectionInput {
  name: string;
  projectId: Scalar.UUID;
  status: TaskStatus;
}

export interface CreateTaskSubmissionInput {
  taskId: Scalar.UUID;
  content: string;
}

export interface CreateTaskTagInput {
  label: string;
  color: string;
  projectId: Scalar.UUID;
}

export interface CreateTaskViewInput {
  projectId?: Scalar.UUID | null;
  userId?: Scalar.UUID | null;
  organizationId?: Scalar.UUID | null;
  name: string;
  type: TaskViewType;
  groupBy?: TaskViewGroupBy | null;
  filters: TaskViewFilterInput[];
  sortBys: TaskViewSortByInput[];
  fields?: TaskViewField[] | null;
}

export interface CreateWorkspaceInput {
  name: string;
  organizationId: Scalar.UUID;
}

export interface DateRangeFilter {
  lt?: Scalar.DateTime | null;
  lte?: Scalar.DateTime | null;
  gt?: Scalar.DateTime | null;
  gte?: Scalar.DateTime | null;
}

export interface DeleteOrganizationIntegrationInput {
  type: OrganizationIntegrationType;
  organizationId: Scalar.UUID;
}

export interface DeleteTaskApplicationInput {
  taskId: Scalar.UUID;
  userId: Scalar.UUID;
}

export interface FundingVoteInput {
  sessionId: Scalar.UUID;
  taskId: Scalar.UUID;
  weight: number;
}

export interface GetTasksInput {
  doneAtAfter?: Scalar.DateTime | null;
  doneAtBefore?: Scalar.DateTime | null;
  statuses?: TaskStatus[] | null;
  limit?: number | null;
  userId?: Scalar.UUID | null;
  ids?: Scalar.UUID[] | null;
  rewardNotNull?: boolean | null;
}

export interface ProjectOptionsInput {
  showBacklogColumn?: boolean | null;
  showCommunitySuggestions?: boolean | null;
}

export interface ProjectTokenGateInput {
  projectId: Scalar.UUID;
  tokenId: Scalar.UUID;
  role: ProjectRole;
}

export interface SearchTasksInput {
  name?: string | null;
  languages?: Language[] | null;
  statuses?: TaskStatus[] | null;
  priorities?: TaskPriority[] | null;
  hasReward?: boolean | null;
  skillIds?: Scalar.UUID[] | null;
  roleIds?: Scalar.UUID[] | null;
  assigneeIds?: (Scalar.UUID | null)[] | null;
  ownerIds?: (Scalar.UUID | null)[] | null;
  tagIds?: Scalar.UUID[] | null;
  applicantIds?: Scalar.UUID[] | null;
  projectIds?: (Scalar.UUID | null)[] | null;
  parentTaskId?: Scalar.UUID | null;
  organizationIds?: Scalar.UUID[] | null;
  featured?: boolean | null;
  sortBy: TaskViewSortByInput;
  doneAt?: DateRangeFilter | null;
}

export interface SetOrganizationDetailInput {
  type: EntityDetailType;
  value?: string | null;
  organizationId: Scalar.UUID;
}

export interface SetUserDetailInput {
  type: EntityDetailType;
  value?: string | null;
}

export interface TaskFilterInput {
  doneAtAfter?: Scalar.DateTime | null;
  doneAtBefore?: Scalar.DateTime | null;
  statuses?: TaskStatus[] | null;
  limit?: number | null;
  userId?: Scalar.UUID | null;
}

export interface TaskGatingDefaultInput {
  projectId: Scalar.UUID;
  type?: TaskGatingType | null;
  roleIds?: Scalar.UUID[] | null;
}

export interface TaskReactionInput {
  reaction: string;
  taskId: Scalar.UUID;
}

export interface TaskRewardPaymentInput {
  userId: Scalar.UUID;
  rewardId: Scalar.UUID;
  tokenId: Scalar.UUID;
  amount: string;
}

export interface TaskViewFilterInput {
  type: TaskViewFilterType;
  subtasks?: boolean | null;
  tagIds?: Scalar.UUID[] | null;
  assigneeIds?: (Scalar.UUID | null)[] | null;
  ownerIds?: Scalar.UUID[] | null;
  applicantIds?: Scalar.UUID[] | null;
  roleIds?: Scalar.UUID[] | null;
  skillIds?: Scalar.UUID[] | null;
  statuses?: TaskStatus[] | null;
  priorities?: TaskPriority[] | null;
}

export interface TaskViewSortByInput {
  direction: TaskViewSortByDirection;
  field: TaskViewSortByField;
}

export interface UpdateOrganizationInput {
  id: Scalar.UUID;
  name?: string | null;
  tagline?: string | null;
  description?: string | null;
  tagIds?: Scalar.UUID[] | null;
  imageUrl?: string | null;
}

export interface UpdatePaymentMethodInput {
  id: Scalar.UUID;
  deletedAt: Scalar.DateTime;
}

export interface UpdateProjectInput {
  id: Scalar.UUID;
  name?: string | null;
  description?: string | null;
  workspaceId?: Scalar.UUID | null;
  options?: ProjectOptionsInput | null;
  deletedAt?: Scalar.DateTime | null;
  sortKey?: string | null;
}

export interface UpdateProjectIntegrationInput {
  id: Scalar.UUID;
  deletedAt?: Scalar.DateTime | null;
}

export interface UpdateTaskInput {
  id: Scalar.UUID;
  name?: string | null;
  description?: string | null;
  parentTaskId?: Scalar.UUID | null;
  sectionId?: Scalar.UUID | null;
  projectId?: Scalar.UUID | null;
  sortKey?: string | null;
  tagIds?: Scalar.UUID[] | null;
  skillIds?: Scalar.UUID[] | null;
  assigneeIds?: Scalar.UUID[] | null;
  ownerIds?: Scalar.UUID[] | null;
  storyPoints?: number | null;
  status?: TaskStatus | null;
  priority?: TaskPriority | null;
  gating?: TaskGatingType | null;
  reward?: UpdateTaskRewardInput | null;
  review?: UpdateTaskReviewInput | null;
  dueDate?: Scalar.DateTime | null;
}

export interface UpdateTaskReviewInput {
  message?: string | null;
  rating?: number | null;
  reviewerId?: Scalar.UUID | null;
}

export interface UpdateTaskRewardInput {
  amount: string;
  tokenId: Scalar.UUID;
  peggedToUsd?: boolean | null;
}

export interface UpdateTaskSectionInput {
  id: Scalar.UUID;
  projectId: Scalar.UUID;
  name?: string | null;
  sortKey?: string | null;
  deletedAt?: Scalar.DateTime | null;
}

export interface UpdateTaskSubmissionInput {
  taskId: Scalar.UUID;
  userId: Scalar.UUID;
  approverId?: Scalar.UUID | null;
  content?: string | null;
  deletedAt?: Scalar.DateTime | null;
}

export interface UpdateTaskTagInput {
  id: Scalar.UUID;
  projectId: Scalar.UUID;
  label?: string | null;
  color?: string | null;
  deletedAt?: Scalar.DateTime | null;
}

export interface UpdateTaskViewInput {
  id: Scalar.UUID;
  name?: string | null;
  type?: TaskViewType | null;
  groupBy?: TaskViewGroupBy | null;
  filters?: TaskViewFilterInput[] | null;
  sortBys?: TaskViewSortByInput[] | null;
  fields?: TaskViewField[] | null;
  sortKey?: string | null;
  deletedAt?: Scalar.DateTime | null;
}

export interface UpdateUserInput {
  username?: string | null;
  bio?: string | null;
  imageUrl?: string | null;
}

export interface UpdateUserPromptInput {
  type: string;
  completedAt?: Scalar.DateTime | null;
}

export interface UpdateUserRoleInput {
  userId: Scalar.UUID;
  roleId: Scalar.UUID;
  hidden?: boolean | null;
}

export interface UpdateWorkspaceInput {
  id: Scalar.UUID;
  organizationId: Scalar.UUID;
  name?: string | null;
  sortKey?: string | null;
  deletedAt?: Scalar.DateTime | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
