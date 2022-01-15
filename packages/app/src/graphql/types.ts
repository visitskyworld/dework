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
  permalink: string;
}

export interface AuthWithThreepidMutation_authWithThreepid_user_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface AuthWithThreepidMutation_authWithThreepid_user_threepids {
  __typename: "Threepid";
  id: Scalar.UUID;
  source: ThreepidSource;
}

export interface AuthWithThreepidMutation_authWithThreepid_user_paymentMethods_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface AuthWithThreepidMutation_authWithThreepid_user_paymentMethods_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface AuthWithThreepidMutation_authWithThreepid_user_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: AuthWithThreepidMutation_authWithThreepid_user_paymentMethods_networks[];
  tokens: AuthWithThreepidMutation_authWithThreepid_user_paymentMethods_tokens[];
}

export interface AuthWithThreepidMutation_authWithThreepid_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  bio: string | null;
  organizations: AuthWithThreepidMutation_authWithThreepid_user_organizations[];
  details: AuthWithThreepidMutation_authWithThreepid_user_details[];
  threepids: AuthWithThreepidMutation_authWithThreepid_user_threepids[];
  paymentMethods: AuthWithThreepidMutation_authWithThreepid_user_paymentMethods[];
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
  id: Scalar.UUID;
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
// GraphQL mutation operation: UpdateUserMutation
// ====================================================

export interface UpdateUserMutation_user_organizations {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  permalink: string;
}

export interface UpdateUserMutation_user_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface UpdateUserMutation_user_threepids {
  __typename: "Threepid";
  id: Scalar.UUID;
  source: ThreepidSource;
}

export interface UpdateUserMutation_user_paymentMethods_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UpdateUserMutation_user_paymentMethods_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface UpdateUserMutation_user_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: UpdateUserMutation_user_paymentMethods_networks[];
  tokens: UpdateUserMutation_user_paymentMethods_tokens[];
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
  paymentMethods: UpdateUserMutation_user_paymentMethods[];
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

export interface UpdateOrganizationMutation_organization_projects_options {
  __typename: "ProjectOptions";
  showBacklogColumn: boolean | null;
}

export interface UpdateOrganizationMutation_organization_projects_members_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface UpdateOrganizationMutation_organization_projects_members {
  __typename: "ProjectMember";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  userId: string;
  user: UpdateOrganizationMutation_organization_projects_members_user;
}

export interface UpdateOrganizationMutation_organization_projects_paymentMethods_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UpdateOrganizationMutation_organization_projects_paymentMethods_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface UpdateOrganizationMutation_organization_projects_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: UpdateOrganizationMutation_organization_projects_paymentMethods_networks[];
  tokens: UpdateOrganizationMutation_organization_projects_paymentMethods_tokens[];
}

export interface UpdateOrganizationMutation_organization_projects_integrations {
  __typename: "ProjectIntegration";
  id: Scalar.UUID;
  type: string;
  config: Scalar.JSONObject;
}

export interface UpdateOrganizationMutation_organization_projects_tokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UpdateOrganizationMutation_organization_projects_tokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: UpdateOrganizationMutation_organization_projects_tokenGates_token_network;
}

export interface UpdateOrganizationMutation_organization_projects_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  projectId: string;
  token: UpdateOrganizationMutation_organization_projects_tokenGates_token;
}

export interface UpdateOrganizationMutation_organization_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  taskCount: number;
  options: UpdateOrganizationMutation_organization_projects_options | null;
  doneTaskCount: number;
  openBountyTaskCount: number;
  members: UpdateOrganizationMutation_organization_projects_members[];
  paymentMethods: UpdateOrganizationMutation_organization_projects_paymentMethods[];
  integrations: UpdateOrganizationMutation_organization_projects_integrations[];
  tokenGates: UpdateOrganizationMutation_organization_projects_tokenGates[];
}

export interface UpdateOrganizationMutation_organization_members_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface UpdateOrganizationMutation_organization_members {
  __typename: "OrganizationMember";
  id: Scalar.UUID;
  role: OrganizationRole;
  organizationId: string;
  userId: string;
  user: UpdateOrganizationMutation_organization_members_user;
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

export interface UpdateOrganizationMutation_organization_integrations {
  __typename: "OrganizationIntegration";
  id: Scalar.UUID;
  type: OrganizationIntegrationType;
  config: Scalar.JSONObject;
}

export interface UpdateOrganizationMutation_organization_projectTokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
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
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: UpdateOrganizationMutation_organization_projectTokenGates_token_network;
}

export interface UpdateOrganizationMutation_organization_projectTokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  projectId: string;
  token: UpdateOrganizationMutation_organization_projectTokenGates_token;
}

export interface UpdateOrganizationMutation_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  permalink: string;
  tagline: string | null;
  description: string | null;
  projects: UpdateOrganizationMutation_organization_projects[];
  members: UpdateOrganizationMutation_organization_members[];
  tags: UpdateOrganizationMutation_organization_tags[];
  details: UpdateOrganizationMutation_organization_details[];
  integrations: UpdateOrganizationMutation_organization_integrations[];
  projectTokenGates: UpdateOrganizationMutation_organization_projectTokenGates[];
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
// GraphQL mutation operation: UpdateProjectMemberMutation
// ====================================================

export interface UpdateProjectMemberMutation_member_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface UpdateProjectMemberMutation_member {
  __typename: "ProjectMember";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  userId: string;
  user: UpdateProjectMemberMutation_member_user;
}

export interface UpdateProjectMemberMutation {
  member: UpdateProjectMemberMutation_member;
}

export interface UpdateProjectMemberMutationVariables {
  input: UpdateProjectMemberInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveProjectMemberMutation
// ====================================================

export interface RemoveProjectMemberMutation_project_members_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface RemoveProjectMemberMutation_project_members {
  __typename: "ProjectMember";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  userId: string;
  user: RemoveProjectMemberMutation_project_members_user;
}

export interface RemoveProjectMemberMutation_project {
  __typename: "Project";
  id: Scalar.UUID;
  members: RemoveProjectMemberMutation_project_members[];
}

export interface RemoveProjectMemberMutation {
  project: RemoveProjectMemberMutation_project;
}

export interface RemoveProjectMemberMutationVariables {
  input: RemoveProjectMemberInput;
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
}

export interface CreateProjectMutation_project_members_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface CreateProjectMutation_project_members {
  __typename: "ProjectMember";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  userId: string;
  user: CreateProjectMutation_project_members_user;
}

export interface CreateProjectMutation_project_paymentMethods_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateProjectMutation_project_paymentMethods_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateProjectMutation_project_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: CreateProjectMutation_project_paymentMethods_networks[];
  tokens: CreateProjectMutation_project_paymentMethods_tokens[];
}

export interface CreateProjectMutation_project_integrations {
  __typename: "ProjectIntegration";
  id: Scalar.UUID;
  type: string;
  config: Scalar.JSONObject;
}

export interface CreateProjectMutation_project_tokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
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
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: CreateProjectMutation_project_tokenGates_token_network;
}

export interface CreateProjectMutation_project_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  projectId: string;
  token: CreateProjectMutation_project_tokenGates_token;
}

export interface CreateProjectMutation_project_organization_projects_options {
  __typename: "ProjectOptions";
  showBacklogColumn: boolean | null;
}

export interface CreateProjectMutation_project_organization_projects_members_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface CreateProjectMutation_project_organization_projects_members {
  __typename: "ProjectMember";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  userId: string;
  user: CreateProjectMutation_project_organization_projects_members_user;
}

export interface CreateProjectMutation_project_organization_projects_paymentMethods_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateProjectMutation_project_organization_projects_paymentMethods_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateProjectMutation_project_organization_projects_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: CreateProjectMutation_project_organization_projects_paymentMethods_networks[];
  tokens: CreateProjectMutation_project_organization_projects_paymentMethods_tokens[];
}

export interface CreateProjectMutation_project_organization_projects_integrations {
  __typename: "ProjectIntegration";
  id: Scalar.UUID;
  type: string;
  config: Scalar.JSONObject;
}

export interface CreateProjectMutation_project_organization_projects_tokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateProjectMutation_project_organization_projects_tokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: CreateProjectMutation_project_organization_projects_tokenGates_token_network;
}

export interface CreateProjectMutation_project_organization_projects_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  projectId: string;
  token: CreateProjectMutation_project_organization_projects_tokenGates_token;
}

export interface CreateProjectMutation_project_organization_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  taskCount: number;
  options: CreateProjectMutation_project_organization_projects_options | null;
  doneTaskCount: number;
  openBountyTaskCount: number;
  members: CreateProjectMutation_project_organization_projects_members[];
  paymentMethods: CreateProjectMutation_project_organization_projects_paymentMethods[];
  integrations: CreateProjectMutation_project_organization_projects_integrations[];
  tokenGates: CreateProjectMutation_project_organization_projects_tokenGates[];
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

export interface CreateProjectMutation_project_organization_integrations {
  __typename: "OrganizationIntegration";
  id: Scalar.UUID;
  type: OrganizationIntegrationType;
  config: Scalar.JSONObject;
}

export interface CreateProjectMutation_project_organization_projectTokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
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
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: CreateProjectMutation_project_organization_projectTokenGates_token_network;
}

export interface CreateProjectMutation_project_organization_projectTokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  projectId: string;
  token: CreateProjectMutation_project_organization_projectTokenGates_token;
}

export interface CreateProjectMutation_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  permalink: string;
  tagline: string | null;
  description: string | null;
  projects: CreateProjectMutation_project_organization_projects[];
  members: CreateProjectMutation_project_organization_members[];
  tags: CreateProjectMutation_project_organization_tags[];
  details: CreateProjectMutation_project_organization_details[];
  integrations: CreateProjectMutation_project_organization_integrations[];
  projectTokenGates: CreateProjectMutation_project_organization_projectTokenGates[];
}

export interface CreateProjectMutation_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  taskCount: number;
  options: CreateProjectMutation_project_options | null;
  doneTaskCount: number;
  openBountyTaskCount: number;
  members: CreateProjectMutation_project_members[];
  paymentMethods: CreateProjectMutation_project_paymentMethods[];
  integrations: CreateProjectMutation_project_integrations[];
  tokenGates: CreateProjectMutation_project_tokenGates[];
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

export interface UpdateProjectMutation_project_options {
  __typename: "ProjectOptions";
  showBacklogColumn: boolean | null;
}

export interface UpdateProjectMutation_project_members_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface UpdateProjectMutation_project_members {
  __typename: "ProjectMember";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  userId: string;
  user: UpdateProjectMutation_project_members_user;
}

export interface UpdateProjectMutation_project_paymentMethods_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UpdateProjectMutation_project_paymentMethods_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface UpdateProjectMutation_project_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: UpdateProjectMutation_project_paymentMethods_networks[];
  tokens: UpdateProjectMutation_project_paymentMethods_tokens[];
}

export interface UpdateProjectMutation_project_integrations {
  __typename: "ProjectIntegration";
  id: Scalar.UUID;
  type: string;
  config: Scalar.JSONObject;
}

export interface UpdateProjectMutation_project_tokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
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
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: UpdateProjectMutation_project_tokenGates_token_network;
}

export interface UpdateProjectMutation_project_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  projectId: string;
  token: UpdateProjectMutation_project_tokenGates_token;
}

export interface UpdateProjectMutation_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  taskCount: number;
  options: UpdateProjectMutation_project_options | null;
  doneTaskCount: number;
  openBountyTaskCount: number;
  members: UpdateProjectMutation_project_members[];
  paymentMethods: UpdateProjectMutation_project_paymentMethods[];
  integrations: UpdateProjectMutation_project_integrations[];
  tokenGates: UpdateProjectMutation_project_tokenGates[];
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

export interface CreateTaskMutation_task_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
}

export interface CreateTaskMutation_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface CreateTaskMutation_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface CreateTaskMutation_task_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateTaskMutation_task_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskMutation_task_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateTaskMutation_task_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: CreateTaskMutation_task_reward_payment_paymentMethod_networks[];
  tokens: CreateTaskMutation_task_reward_payment_paymentMethod_tokens[];
}

export interface CreateTaskMutation_task_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskMutation_task_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: CreateTaskMutation_task_reward_payment_paymentMethod;
  network: CreateTaskMutation_task_reward_payment_network;
}

export interface CreateTaskMutation_task_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: CreateTaskMutation_task_reward_token;
  payment: CreateTaskMutation_task_reward_payment | null;
}

export interface CreateTaskMutation_task_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface CreateTaskMutation_task_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: CreateTaskMutation_task_applications_user;
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

export interface CreateTaskMutation_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  submission: string | null;
  status: TaskStatus;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: CreateTaskMutation_task_subtasks[];
  tags: CreateTaskMutation_task_tags[];
  assignees: CreateTaskMutation_task_assignees[];
  reward: CreateTaskMutation_task_reward | null;
  applications: CreateTaskMutation_task_applications[];
  review: CreateTaskMutation_task_review | null;
  reactions: CreateTaskMutation_task_reactions[];
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
}

export interface UpdateTaskMutation_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface UpdateTaskMutation_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface UpdateTaskMutation_task_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface UpdateTaskMutation_task_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UpdateTaskMutation_task_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface UpdateTaskMutation_task_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: UpdateTaskMutation_task_reward_payment_paymentMethod_networks[];
  tokens: UpdateTaskMutation_task_reward_payment_paymentMethod_tokens[];
}

export interface UpdateTaskMutation_task_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UpdateTaskMutation_task_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: UpdateTaskMutation_task_reward_payment_paymentMethod;
  network: UpdateTaskMutation_task_reward_payment_network;
}

export interface UpdateTaskMutation_task_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: UpdateTaskMutation_task_reward_token;
  payment: UpdateTaskMutation_task_reward_payment | null;
}

export interface UpdateTaskMutation_task_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface UpdateTaskMutation_task_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: UpdateTaskMutation_task_applications_user;
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
  submission: string | null;
  status: TaskStatus;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: UpdateTaskMutation_task_subtasks[];
  tags: UpdateTaskMutation_task_tags[];
  assignees: UpdateTaskMutation_task_assignees[];
  reward: UpdateTaskMutation_task_reward | null;
  applications: UpdateTaskMutation_task_applications[];
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

export interface CreateTaskApplicationMutation_application_task_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
}

export interface CreateTaskApplicationMutation_application_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface CreateTaskApplicationMutation_application_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface CreateTaskApplicationMutation_application_task_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateTaskApplicationMutation_application_task_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskApplicationMutation_application_task_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateTaskApplicationMutation_application_task_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: CreateTaskApplicationMutation_application_task_reward_payment_paymentMethod_networks[];
  tokens: CreateTaskApplicationMutation_application_task_reward_payment_paymentMethod_tokens[];
}

export interface CreateTaskApplicationMutation_application_task_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskApplicationMutation_application_task_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: CreateTaskApplicationMutation_application_task_reward_payment_paymentMethod;
  network: CreateTaskApplicationMutation_application_task_reward_payment_network;
}

export interface CreateTaskApplicationMutation_application_task_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: CreateTaskApplicationMutation_application_task_reward_token;
  payment: CreateTaskApplicationMutation_application_task_reward_payment | null;
}

export interface CreateTaskApplicationMutation_application_task_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface CreateTaskApplicationMutation_application_task_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: CreateTaskApplicationMutation_application_task_applications_user;
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
  submission: string | null;
  status: TaskStatus;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: CreateTaskApplicationMutation_application_task_subtasks[];
  tags: CreateTaskApplicationMutation_application_task_tags[];
  assignees: CreateTaskApplicationMutation_application_task_assignees[];
  reward: CreateTaskApplicationMutation_application_task_reward | null;
  applications: CreateTaskApplicationMutation_application_task_applications[];
  review: CreateTaskApplicationMutation_application_task_review | null;
  reactions: CreateTaskApplicationMutation_application_task_reactions[];
}

export interface CreateTaskApplicationMutation_application {
  __typename: "TaskApplication";
  id: Scalar.UUID;
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
}

export interface DeleteTaskApplicationMutation_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface DeleteTaskApplicationMutation_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface DeleteTaskApplicationMutation_task_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface DeleteTaskApplicationMutation_task_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface DeleteTaskApplicationMutation_task_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface DeleteTaskApplicationMutation_task_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: DeleteTaskApplicationMutation_task_reward_payment_paymentMethod_networks[];
  tokens: DeleteTaskApplicationMutation_task_reward_payment_paymentMethod_tokens[];
}

export interface DeleteTaskApplicationMutation_task_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface DeleteTaskApplicationMutation_task_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: DeleteTaskApplicationMutation_task_reward_payment_paymentMethod;
  network: DeleteTaskApplicationMutation_task_reward_payment_network;
}

export interface DeleteTaskApplicationMutation_task_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: DeleteTaskApplicationMutation_task_reward_token;
  payment: DeleteTaskApplicationMutation_task_reward_payment | null;
}

export interface DeleteTaskApplicationMutation_task_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface DeleteTaskApplicationMutation_task_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: DeleteTaskApplicationMutation_task_applications_user;
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
  submission: string | null;
  status: TaskStatus;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: DeleteTaskApplicationMutation_task_subtasks[];
  tags: DeleteTaskApplicationMutation_task_tags[];
  assignees: DeleteTaskApplicationMutation_task_assignees[];
  reward: DeleteTaskApplicationMutation_task_reward | null;
  applications: DeleteTaskApplicationMutation_task_applications[];
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
  type: string;
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
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: CreateProjectTokenGateMutation_tokenGate_project_tokenGates_token_network;
}

export interface CreateProjectTokenGateMutation_tokenGate_project_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
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
  type: string;
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
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: DeleteProjectTokenGateMutation_tokenGate_tokenGates_token_network;
}

export interface DeleteProjectTokenGateMutation_tokenGate_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
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
// GraphQL mutation operation: CreateOrganizationInviteMutation
// ====================================================

export interface CreateOrganizationInviteMutation_invite {
  __typename: "Invite";
  id: Scalar.UUID;
}

export interface CreateOrganizationInviteMutation {
  invite: CreateOrganizationInviteMutation_invite;
}

export interface CreateOrganizationInviteMutationVariables {
  input: OrganizationInviteInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateProjectInviteMutation
// ====================================================

export interface CreateProjectInviteMutation_invite_project {
  __typename: "Project";
  id: Scalar.UUID;
}

export interface CreateProjectInviteMutation_invite {
  __typename: "Invite";
  id: Scalar.UUID;
  project: CreateProjectInviteMutation_invite_project | null;
}

export interface CreateProjectInviteMutation {
  invite: CreateProjectInviteMutation_invite;
}

export interface CreateProjectInviteMutationVariables {
  input: ProjectInviteInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AcceptInviteMutation
// ====================================================

export interface AcceptInviteMutation_invite_organization_members_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface AcceptInviteMutation_invite_organization_members {
  __typename: "OrganizationMember";
  id: Scalar.UUID;
  role: OrganizationRole;
  organizationId: string;
  userId: string;
  user: AcceptInviteMutation_invite_organization_members_user;
}

export interface AcceptInviteMutation_invite_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  members: AcceptInviteMutation_invite_organization_members[];
}

export interface AcceptInviteMutation_invite_project_members_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface AcceptInviteMutation_invite_project_members {
  __typename: "ProjectMember";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  userId: string;
  user: AcceptInviteMutation_invite_project_members_user;
}

export interface AcceptInviteMutation_invite_project_organization_members_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface AcceptInviteMutation_invite_project_organization_members {
  __typename: "OrganizationMember";
  id: Scalar.UUID;
  role: OrganizationRole;
  organizationId: string;
  userId: string;
  user: AcceptInviteMutation_invite_project_organization_members_user;
}

export interface AcceptInviteMutation_invite_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  members: AcceptInviteMutation_invite_project_organization_members[];
}

export interface AcceptInviteMutation_invite_project {
  __typename: "Project";
  id: Scalar.UUID;
  name: string;
  members: AcceptInviteMutation_invite_project_members[];
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

export interface JoinProjectWithTokenMutation_member_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
}

export interface JoinProjectWithTokenMutation_member {
  __typename: "ProjectMember";
  id: Scalar.UUID;
  project: JoinProjectWithTokenMutation_member_project;
}

export interface JoinProjectWithTokenMutation {
  member: JoinProjectWithTokenMutation_member;
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

export interface CreatePaymentMethodMutation_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreatePaymentMethodMutation_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreatePaymentMethodMutation_paymentMethod_project_paymentMethods_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreatePaymentMethodMutation_paymentMethod_project_paymentMethods_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreatePaymentMethodMutation_paymentMethod_project_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: CreatePaymentMethodMutation_paymentMethod_project_paymentMethods_networks[];
  tokens: CreatePaymentMethodMutation_paymentMethod_project_paymentMethods_tokens[];
}

export interface CreatePaymentMethodMutation_paymentMethod_project {
  __typename: "Project";
  id: Scalar.UUID;
  paymentMethods: CreatePaymentMethodMutation_paymentMethod_project_paymentMethods[];
}

export interface CreatePaymentMethodMutation_paymentMethod_user_paymentMethods_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreatePaymentMethodMutation_paymentMethod_user_paymentMethods_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreatePaymentMethodMutation_paymentMethod_user_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: CreatePaymentMethodMutation_paymentMethod_user_paymentMethods_networks[];
  tokens: CreatePaymentMethodMutation_paymentMethod_user_paymentMethods_tokens[];
}

export interface CreatePaymentMethodMutation_paymentMethod_user {
  __typename: "User";
  id: Scalar.UUID;
  paymentMethods: CreatePaymentMethodMutation_paymentMethod_user_paymentMethods[];
}

export interface CreatePaymentMethodMutation_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: CreatePaymentMethodMutation_paymentMethod_networks[];
  tokens: CreatePaymentMethodMutation_paymentMethod_tokens[];
  project: CreatePaymentMethodMutation_paymentMethod_project | null;
  user: CreatePaymentMethodMutation_paymentMethod_user | null;
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
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreatePaymentTokenMutation_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
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

export interface UpdatePaymentMethodMutation_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UpdatePaymentMethodMutation_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface UpdatePaymentMethodMutation_paymentMethod_project_paymentMethods_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UpdatePaymentMethodMutation_paymentMethod_project_paymentMethods_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface UpdatePaymentMethodMutation_paymentMethod_project_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: UpdatePaymentMethodMutation_paymentMethod_project_paymentMethods_networks[];
  tokens: UpdatePaymentMethodMutation_paymentMethod_project_paymentMethods_tokens[];
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
  networks: UpdatePaymentMethodMutation_paymentMethod_networks[];
  tokens: UpdatePaymentMethodMutation_paymentMethod_tokens[];
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
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: CreateTaskPaymentsMutation_tasks_subtasks_reward_payment_paymentMethod_networks[];
  tokens: CreateTaskPaymentsMutation_tasks_subtasks_reward_payment_paymentMethod_tokens[];
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: CreateTaskPaymentsMutation_tasks_subtasks_reward_payment_paymentMethod;
  network: CreateTaskPaymentsMutation_tasks_subtasks_reward_payment_network;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: CreateTaskPaymentsMutation_tasks_subtasks_reward_token;
  payment: CreateTaskPaymentsMutation_tasks_subtasks_reward_payment | null;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface CreateTaskPaymentsMutation_tasks_subtasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: CreateTaskPaymentsMutation_tasks_subtasks_applications_user;
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
  description: string | null;
  submission: string | null;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: CreateTaskPaymentsMutation_tasks_subtasks_subtasks[];
  tags: CreateTaskPaymentsMutation_tasks_subtasks_tags[];
  assignees: CreateTaskPaymentsMutation_tasks_subtasks_assignees[];
  reward: CreateTaskPaymentsMutation_tasks_subtasks_reward | null;
  applications: CreateTaskPaymentsMutation_tasks_subtasks_applications[];
  review: CreateTaskPaymentsMutation_tasks_subtasks_review | null;
  reactions: CreateTaskPaymentsMutation_tasks_subtasks_reactions[];
}

export interface CreateTaskPaymentsMutation_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface CreateTaskPaymentsMutation_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface CreateTaskPaymentsMutation_tasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateTaskPaymentsMutation_tasks_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskPaymentsMutation_tasks_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateTaskPaymentsMutation_tasks_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: CreateTaskPaymentsMutation_tasks_reward_payment_paymentMethod_networks[];
  tokens: CreateTaskPaymentsMutation_tasks_reward_payment_paymentMethod_tokens[];
}

export interface CreateTaskPaymentsMutation_tasks_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTaskPaymentsMutation_tasks_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: CreateTaskPaymentsMutation_tasks_reward_payment_paymentMethod;
  network: CreateTaskPaymentsMutation_tasks_reward_payment_network;
}

export interface CreateTaskPaymentsMutation_tasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: CreateTaskPaymentsMutation_tasks_reward_token;
  payment: CreateTaskPaymentsMutation_tasks_reward_payment | null;
}

export interface CreateTaskPaymentsMutation_tasks_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface CreateTaskPaymentsMutation_tasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: CreateTaskPaymentsMutation_tasks_applications_user;
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

export interface CreateTaskPaymentsMutation_tasks_owner {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface CreateTaskPaymentsMutation_tasks_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface CreateTaskPaymentsMutation_tasks_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
}

export interface CreateTaskPaymentsMutation_tasks_discordChannel {
  __typename: "DiscordChannel";
  id: Scalar.UUID;
  link: string;
  name: string;
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

export interface CreateTaskPaymentsMutation_tasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  submission: string | null;
  status: TaskStatus;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: CreateTaskPaymentsMutation_tasks_subtasks[];
  tags: CreateTaskPaymentsMutation_tasks_tags[];
  assignees: CreateTaskPaymentsMutation_tasks_assignees[];
  reward: CreateTaskPaymentsMutation_tasks_reward | null;
  applications: CreateTaskPaymentsMutation_tasks_applications[];
  review: CreateTaskPaymentsMutation_tasks_review | null;
  reactions: CreateTaskPaymentsMutation_tasks_reactions[];
  gitBranchName: string;
  createdAt: Scalar.DateTime;
  permalink: string;
  owner: CreateTaskPaymentsMutation_tasks_owner | null;
  creator: CreateTaskPaymentsMutation_tasks_creator | null;
  project: CreateTaskPaymentsMutation_tasks_project;
  discordChannel: CreateTaskPaymentsMutation_tasks_discordChannel | null;
  githubPullRequests: CreateTaskPaymentsMutation_tasks_githubPullRequests[];
  githubBranches: CreateTaskPaymentsMutation_tasks_githubBranches[];
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
  id: Scalar.UUID;
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
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: CreateTasksFromGithubIssuesMutation_project_tasks_reward_payment_paymentMethod_networks[];
  tokens: CreateTasksFromGithubIssuesMutation_project_tasks_reward_payment_paymentMethod_tokens[];
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: CreateTasksFromGithubIssuesMutation_project_tasks_reward_payment_paymentMethod;
  network: CreateTasksFromGithubIssuesMutation_project_tasks_reward_payment_network;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: CreateTasksFromGithubIssuesMutation_project_tasks_reward_token;
  payment: CreateTasksFromGithubIssuesMutation_project_tasks_reward_payment | null;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface CreateTasksFromGithubIssuesMutation_project_tasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: CreateTasksFromGithubIssuesMutation_project_tasks_applications_user;
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
  submission: string | null;
  status: TaskStatus;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: CreateTasksFromGithubIssuesMutation_project_tasks_subtasks[];
  tags: CreateTasksFromGithubIssuesMutation_project_tasks_tags[];
  assignees: CreateTasksFromGithubIssuesMutation_project_tasks_assignees[];
  reward: CreateTasksFromGithubIssuesMutation_project_tasks_reward | null;
  applications: CreateTasksFromGithubIssuesMutation_project_tasks_applications[];
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
// GraphQL query operation: MeQuery
// ====================================================

export interface MeQuery_me_organizations {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  permalink: string;
}

export interface MeQuery_me_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface MeQuery_me_threepids {
  __typename: "Threepid";
  id: Scalar.UUID;
  source: ThreepidSource;
}

export interface MeQuery_me_paymentMethods_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface MeQuery_me_paymentMethods_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface MeQuery_me_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: MeQuery_me_paymentMethods_networks[];
  tokens: MeQuery_me_paymentMethods_tokens[];
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
  paymentMethods: MeQuery_me_paymentMethods[];
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
  permalink: string;
}

export interface UserProfileQuery_user_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
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

export interface UserTasksQuery_user_tasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
}

export interface UserTasksQuery_user_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface UserTasksQuery_user_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface UserTasksQuery_user_tasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface UserTasksQuery_user_tasks_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UserTasksQuery_user_tasks_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface UserTasksQuery_user_tasks_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: UserTasksQuery_user_tasks_reward_payment_paymentMethod_networks[];
  tokens: UserTasksQuery_user_tasks_reward_payment_paymentMethod_tokens[];
}

export interface UserTasksQuery_user_tasks_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UserTasksQuery_user_tasks_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: UserTasksQuery_user_tasks_reward_payment_paymentMethod;
  network: UserTasksQuery_user_tasks_reward_payment_network;
}

export interface UserTasksQuery_user_tasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: UserTasksQuery_user_tasks_reward_token;
  payment: UserTasksQuery_user_tasks_reward_payment | null;
}

export interface UserTasksQuery_user_tasks_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface UserTasksQuery_user_tasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: UserTasksQuery_user_tasks_applications_user;
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
  permalink: string;
}

export interface UserTasksQuery_user_tasks_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  organization: UserTasksQuery_user_tasks_project_organization;
}

export interface UserTasksQuery_user_tasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  submission: string | null;
  status: TaskStatus;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: UserTasksQuery_user_tasks_subtasks[];
  tags: UserTasksQuery_user_tasks_tags[];
  assignees: UserTasksQuery_user_tasks_assignees[];
  reward: UserTasksQuery_user_tasks_reward | null;
  applications: UserTasksQuery_user_tasks_applications[];
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
  userId: Scalar.UUID;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserPaymentMethodQuery
// ====================================================

export interface UserPaymentMethodQuery_user_paymentMethods_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UserPaymentMethodQuery_user_paymentMethods_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface UserPaymentMethodQuery_user_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: UserPaymentMethodQuery_user_paymentMethods_networks[];
  tokens: UserPaymentMethodQuery_user_paymentMethods_tokens[];
}

export interface UserPaymentMethodQuery_user {
  __typename: "User";
  id: Scalar.UUID;
  paymentMethods: UserPaymentMethodQuery_user_paymentMethods[];
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

export interface PermissionsQuery {
  permissions: Scalar.JSONObject[];
}

export interface PermissionsQueryVariables {
  input: GetUserPermissionsInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationQuery
// ====================================================

export interface GetOrganizationQuery_organization_projects_options {
  __typename: "ProjectOptions";
  showBacklogColumn: boolean | null;
}

export interface GetOrganizationQuery_organization_projects_members_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetOrganizationQuery_organization_projects_members {
  __typename: "ProjectMember";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  userId: string;
  user: GetOrganizationQuery_organization_projects_members_user;
}

export interface GetOrganizationQuery_organization_projects_paymentMethods_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetOrganizationQuery_organization_projects_paymentMethods_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetOrganizationQuery_organization_projects_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: GetOrganizationQuery_organization_projects_paymentMethods_networks[];
  tokens: GetOrganizationQuery_organization_projects_paymentMethods_tokens[];
}

export interface GetOrganizationQuery_organization_projects_integrations {
  __typename: "ProjectIntegration";
  id: Scalar.UUID;
  type: string;
  config: Scalar.JSONObject;
}

export interface GetOrganizationQuery_organization_projects_tokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetOrganizationQuery_organization_projects_tokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: GetOrganizationQuery_organization_projects_tokenGates_token_network;
}

export interface GetOrganizationQuery_organization_projects_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  projectId: string;
  token: GetOrganizationQuery_organization_projects_tokenGates_token;
}

export interface GetOrganizationQuery_organization_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  taskCount: number;
  options: GetOrganizationQuery_organization_projects_options | null;
  doneTaskCount: number;
  openBountyTaskCount: number;
  members: GetOrganizationQuery_organization_projects_members[];
  paymentMethods: GetOrganizationQuery_organization_projects_paymentMethods[];
  integrations: GetOrganizationQuery_organization_projects_integrations[];
  tokenGates: GetOrganizationQuery_organization_projects_tokenGates[];
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

export interface GetOrganizationQuery_organization_tags {
  __typename: "OrganizationTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface GetOrganizationQuery_organization_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface GetOrganizationQuery_organization_integrations {
  __typename: "OrganizationIntegration";
  id: Scalar.UUID;
  type: OrganizationIntegrationType;
  config: Scalar.JSONObject;
}

export interface GetOrganizationQuery_organization_projectTokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetOrganizationQuery_organization_projectTokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: GetOrganizationQuery_organization_projectTokenGates_token_network;
}

export interface GetOrganizationQuery_organization_projectTokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  projectId: string;
  token: GetOrganizationQuery_organization_projectTokenGates_token;
}

export interface GetOrganizationQuery_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  permalink: string;
  tagline: string | null;
  description: string | null;
  projects: GetOrganizationQuery_organization_projects[];
  members: GetOrganizationQuery_organization_members[];
  tags: GetOrganizationQuery_organization_tags[];
  details: GetOrganizationQuery_organization_details[];
  integrations: GetOrganizationQuery_organization_integrations[];
  projectTokenGates: GetOrganizationQuery_organization_projectTokenGates[];
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

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_projects_options {
  __typename: "ProjectOptions";
  showBacklogColumn: boolean | null;
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_projects_members_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_projects_members {
  __typename: "ProjectMember";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  userId: string;
  user: GetFeaturedOrganizationsQuery_featuredOrganizations_projects_members_user;
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_projects_paymentMethods_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_projects_paymentMethods_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_projects_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: GetFeaturedOrganizationsQuery_featuredOrganizations_projects_paymentMethods_networks[];
  tokens: GetFeaturedOrganizationsQuery_featuredOrganizations_projects_paymentMethods_tokens[];
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_projects_integrations {
  __typename: "ProjectIntegration";
  id: Scalar.UUID;
  type: string;
  config: Scalar.JSONObject;
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_projects_tokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_projects_tokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: GetFeaturedOrganizationsQuery_featuredOrganizations_projects_tokenGates_token_network;
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_projects_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  projectId: string;
  token: GetFeaturedOrganizationsQuery_featuredOrganizations_projects_tokenGates_token;
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  taskCount: number;
  options: GetFeaturedOrganizationsQuery_featuredOrganizations_projects_options | null;
  doneTaskCount: number;
  openBountyTaskCount: number;
  members: GetFeaturedOrganizationsQuery_featuredOrganizations_projects_members[];
  paymentMethods: GetFeaturedOrganizationsQuery_featuredOrganizations_projects_paymentMethods[];
  integrations: GetFeaturedOrganizationsQuery_featuredOrganizations_projects_integrations[];
  tokenGates: GetFeaturedOrganizationsQuery_featuredOrganizations_projects_tokenGates[];
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

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_tags {
  __typename: "OrganizationTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_integrations {
  __typename: "OrganizationIntegration";
  id: Scalar.UUID;
  type: OrganizationIntegrationType;
  config: Scalar.JSONObject;
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_projectTokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_projectTokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: GetFeaturedOrganizationsQuery_featuredOrganizations_projectTokenGates_token_network;
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations_projectTokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  projectId: string;
  token: GetFeaturedOrganizationsQuery_featuredOrganizations_projectTokenGates_token;
}

export interface GetFeaturedOrganizationsQuery_featuredOrganizations {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  permalink: string;
  tagline: string | null;
  description: string | null;
  projects: GetFeaturedOrganizationsQuery_featuredOrganizations_projects[];
  members: GetFeaturedOrganizationsQuery_featuredOrganizations_members[];
  tags: GetFeaturedOrganizationsQuery_featuredOrganizations_tags[];
  details: GetFeaturedOrganizationsQuery_featuredOrganizations_details[];
  integrations: GetFeaturedOrganizationsQuery_featuredOrganizations_integrations[];
  projectTokenGates: GetFeaturedOrganizationsQuery_featuredOrganizations_projectTokenGates[];
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
}

export interface GetOrganizationTasksQuery_organization_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface GetOrganizationTasksQuery_organization_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetOrganizationTasksQuery_organization_tasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetOrganizationTasksQuery_organization_tasks_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetOrganizationTasksQuery_organization_tasks_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetOrganizationTasksQuery_organization_tasks_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: GetOrganizationTasksQuery_organization_tasks_reward_payment_paymentMethod_networks[];
  tokens: GetOrganizationTasksQuery_organization_tasks_reward_payment_paymentMethod_tokens[];
}

export interface GetOrganizationTasksQuery_organization_tasks_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetOrganizationTasksQuery_organization_tasks_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: GetOrganizationTasksQuery_organization_tasks_reward_payment_paymentMethod;
  network: GetOrganizationTasksQuery_organization_tasks_reward_payment_network;
}

export interface GetOrganizationTasksQuery_organization_tasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: GetOrganizationTasksQuery_organization_tasks_reward_token;
  payment: GetOrganizationTasksQuery_organization_tasks_reward_payment | null;
}

export interface GetOrganizationTasksQuery_organization_tasks_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetOrganizationTasksQuery_organization_tasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: GetOrganizationTasksQuery_organization_tasks_applications_user;
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
  submission: string | null;
  status: TaskStatus;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: GetOrganizationTasksQuery_organization_tasks_subtasks[];
  tags: GetOrganizationTasksQuery_organization_tasks_tags[];
  assignees: GetOrganizationTasksQuery_organization_tasks_assignees[];
  reward: GetOrganizationTasksQuery_organization_tasks_reward | null;
  applications: GetOrganizationTasksQuery_organization_tasks_applications[];
  review: GetOrganizationTasksQuery_organization_tasks_review | null;
  reactions: GetOrganizationTasksQuery_organization_tasks_reactions[];
}

export interface GetOrganizationTasksQuery_organization_projects_taskTags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
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

export interface GetProjectQuery_project_options {
  __typename: "ProjectOptions";
  showBacklogColumn: boolean | null;
}

export interface GetProjectQuery_project_members_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetProjectQuery_project_members {
  __typename: "ProjectMember";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  userId: string;
  user: GetProjectQuery_project_members_user;
}

export interface GetProjectQuery_project_paymentMethods_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetProjectQuery_project_paymentMethods_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetProjectQuery_project_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: GetProjectQuery_project_paymentMethods_networks[];
  tokens: GetProjectQuery_project_paymentMethods_tokens[];
}

export interface GetProjectQuery_project_integrations {
  __typename: "ProjectIntegration";
  id: Scalar.UUID;
  type: string;
  config: Scalar.JSONObject;
}

export interface GetProjectQuery_project_tokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetProjectQuery_project_tokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: GetProjectQuery_project_tokenGates_token_network;
}

export interface GetProjectQuery_project_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  projectId: string;
  token: GetProjectQuery_project_tokenGates_token;
}

export interface GetProjectQuery_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  taskCount: number;
  options: GetProjectQuery_project_options | null;
  doneTaskCount: number;
  openBountyTaskCount: number;
  members: GetProjectQuery_project_members[];
  paymentMethods: GetProjectQuery_project_paymentMethods[];
  integrations: GetProjectQuery_project_integrations[];
  tokenGates: GetProjectQuery_project_tokenGates[];
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

export interface GetProjectTasksQuery_project_tasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
}

export interface GetProjectTasksQuery_project_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface GetProjectTasksQuery_project_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetProjectTasksQuery_project_tasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetProjectTasksQuery_project_tasks_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetProjectTasksQuery_project_tasks_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetProjectTasksQuery_project_tasks_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: GetProjectTasksQuery_project_tasks_reward_payment_paymentMethod_networks[];
  tokens: GetProjectTasksQuery_project_tasks_reward_payment_paymentMethod_tokens[];
}

export interface GetProjectTasksQuery_project_tasks_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetProjectTasksQuery_project_tasks_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: GetProjectTasksQuery_project_tasks_reward_payment_paymentMethod;
  network: GetProjectTasksQuery_project_tasks_reward_payment_network;
}

export interface GetProjectTasksQuery_project_tasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: GetProjectTasksQuery_project_tasks_reward_token;
  payment: GetProjectTasksQuery_project_tasks_reward_payment | null;
}

export interface GetProjectTasksQuery_project_tasks_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetProjectTasksQuery_project_tasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: GetProjectTasksQuery_project_tasks_applications_user;
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
  submission: string | null;
  status: TaskStatus;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: GetProjectTasksQuery_project_tasks_subtasks[];
  tags: GetProjectTasksQuery_project_tasks_tags[];
  assignees: GetProjectTasksQuery_project_tasks_assignees[];
  reward: GetProjectTasksQuery_project_tasks_reward | null;
  applications: GetProjectTasksQuery_project_tasks_applications[];
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
// GraphQL query operation: GetProjectTaskTagsQuery
// ====================================================

export interface GetProjectTaskTagsQuery_project_taskTags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
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
}

export interface GetTaskQuery_task_subtasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface GetTaskQuery_task_subtasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetTaskQuery_task_subtasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetTaskQuery_task_subtasks_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetTaskQuery_task_subtasks_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetTaskQuery_task_subtasks_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: GetTaskQuery_task_subtasks_reward_payment_paymentMethod_networks[];
  tokens: GetTaskQuery_task_subtasks_reward_payment_paymentMethod_tokens[];
}

export interface GetTaskQuery_task_subtasks_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetTaskQuery_task_subtasks_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: GetTaskQuery_task_subtasks_reward_payment_paymentMethod;
  network: GetTaskQuery_task_subtasks_reward_payment_network;
}

export interface GetTaskQuery_task_subtasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: GetTaskQuery_task_subtasks_reward_token;
  payment: GetTaskQuery_task_subtasks_reward_payment | null;
}

export interface GetTaskQuery_task_subtasks_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetTaskQuery_task_subtasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: GetTaskQuery_task_subtasks_applications_user;
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
  description: string | null;
  submission: string | null;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: GetTaskQuery_task_subtasks_subtasks[];
  tags: GetTaskQuery_task_subtasks_tags[];
  assignees: GetTaskQuery_task_subtasks_assignees[];
  reward: GetTaskQuery_task_subtasks_reward | null;
  applications: GetTaskQuery_task_subtasks_applications[];
  review: GetTaskQuery_task_subtasks_review | null;
  reactions: GetTaskQuery_task_subtasks_reactions[];
}

export interface GetTaskQuery_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface GetTaskQuery_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetTaskQuery_task_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetTaskQuery_task_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetTaskQuery_task_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetTaskQuery_task_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: GetTaskQuery_task_reward_payment_paymentMethod_networks[];
  tokens: GetTaskQuery_task_reward_payment_paymentMethod_tokens[];
}

export interface GetTaskQuery_task_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetTaskQuery_task_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: GetTaskQuery_task_reward_payment_paymentMethod;
  network: GetTaskQuery_task_reward_payment_network;
}

export interface GetTaskQuery_task_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: GetTaskQuery_task_reward_token;
  payment: GetTaskQuery_task_reward_payment | null;
}

export interface GetTaskQuery_task_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetTaskQuery_task_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: GetTaskQuery_task_applications_user;
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

export interface GetTaskQuery_task_project_taskTags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface GetTaskQuery_task_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  taskTags: GetTaskQuery_task_project_taskTags[];
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

export interface GetTaskQuery_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  submission: string | null;
  status: TaskStatus;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: GetTaskQuery_task_subtasks[];
  tags: GetTaskQuery_task_tags[];
  assignees: GetTaskQuery_task_assignees[];
  reward: GetTaskQuery_task_reward | null;
  applications: GetTaskQuery_task_applications[];
  review: GetTaskQuery_task_review | null;
  reactions: GetTaskQuery_task_reactions[];
  gitBranchName: string;
  createdAt: Scalar.DateTime;
  permalink: string;
  owner: GetTaskQuery_task_owner | null;
  creator: GetTaskQuery_task_creator | null;
  project: GetTaskQuery_task_project;
  discordChannel: GetTaskQuery_task_discordChannel | null;
  githubPullRequests: GetTaskQuery_task_githubPullRequests[];
  githubBranches: GetTaskQuery_task_githubBranches[];
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
// GraphQL query operation: GetTasksQuery
// ====================================================

export interface GetTasksQuery_tasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
}

export interface GetTasksQuery_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface GetTasksQuery_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetTasksQuery_tasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetTasksQuery_tasks_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetTasksQuery_tasks_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetTasksQuery_tasks_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: GetTasksQuery_tasks_reward_payment_paymentMethod_networks[];
  tokens: GetTasksQuery_tasks_reward_payment_paymentMethod_tokens[];
}

export interface GetTasksQuery_tasks_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetTasksQuery_tasks_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: GetTasksQuery_tasks_reward_payment_paymentMethod;
  network: GetTasksQuery_tasks_reward_payment_network;
}

export interface GetTasksQuery_tasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: GetTasksQuery_tasks_reward_token;
  payment: GetTasksQuery_tasks_reward_payment | null;
}

export interface GetTasksQuery_tasks_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetTasksQuery_tasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: GetTasksQuery_tasks_applications_user;
}

export interface GetTasksQuery_tasks_review {
  __typename: "TaskReview";
  id: Scalar.UUID;
  message: string | null;
  rating: number | null;
}

export interface GetTasksQuery_tasks_reactions {
  __typename: "TaskReaction";
  id: Scalar.UUID;
  userId: string;
  reaction: string;
}

export interface GetTasksQuery_tasks_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  permalink: string;
}

export interface GetTasksQuery_tasks_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  organization: GetTasksQuery_tasks_project_organization;
}

export interface GetTasksQuery_tasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  submission: string | null;
  status: TaskStatus;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: GetTasksQuery_tasks_subtasks[];
  tags: GetTasksQuery_tasks_tags[];
  assignees: GetTasksQuery_tasks_assignees[];
  reward: GetTasksQuery_tasks_reward | null;
  applications: GetTasksQuery_tasks_applications[];
  review: GetTasksQuery_tasks_review | null;
  reactions: GetTasksQuery_tasks_reactions[];
  project: GetTasksQuery_tasks_project;
}

export interface GetTasksQuery {
  tasks: GetTasksQuery_tasks[];
}

export interface GetTasksQueryVariables {
  input: GetTasksInput;
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
}

export interface GetTasksToPayQuery_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface GetTasksToPayQuery_tasks_assignees_paymentMethods_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetTasksToPayQuery_tasks_assignees_paymentMethods_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetTasksToPayQuery_tasks_assignees_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: GetTasksToPayQuery_tasks_assignees_paymentMethods_networks[];
  tokens: GetTasksToPayQuery_tasks_assignees_paymentMethods_tokens[];
}

export interface GetTasksToPayQuery_tasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
  paymentMethods: GetTasksToPayQuery_tasks_assignees_paymentMethods[];
}

export interface GetTasksToPayQuery_tasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetTasksToPayQuery_tasks_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetTasksToPayQuery_tasks_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetTasksToPayQuery_tasks_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: GetTasksToPayQuery_tasks_reward_payment_paymentMethod_networks[];
  tokens: GetTasksToPayQuery_tasks_reward_payment_paymentMethod_tokens[];
}

export interface GetTasksToPayQuery_tasks_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetTasksToPayQuery_tasks_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: GetTasksToPayQuery_tasks_reward_payment_paymentMethod;
  network: GetTasksToPayQuery_tasks_reward_payment_network;
}

export interface GetTasksToPayQuery_tasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: GetTasksToPayQuery_tasks_reward_token;
  payment: GetTasksToPayQuery_tasks_reward_payment | null;
}

export interface GetTasksToPayQuery_tasks_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface GetTasksToPayQuery_tasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: GetTasksToPayQuery_tasks_applications_user;
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

export interface GetTasksToPayQuery_tasks_project_paymentMethods_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface GetTasksToPayQuery_tasks_project_paymentMethods_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetTasksToPayQuery_tasks_project_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: GetTasksToPayQuery_tasks_project_paymentMethods_networks[];
  tokens: GetTasksToPayQuery_tasks_project_paymentMethods_tokens[];
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
  submission: string | null;
  status: TaskStatus;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: GetTasksToPayQuery_tasks_subtasks[];
  tags: GetTasksToPayQuery_tasks_tags[];
  assignees: GetTasksToPayQuery_tasks_assignees[];
  reward: GetTasksToPayQuery_tasks_reward | null;
  applications: GetTasksToPayQuery_tasks_applications[];
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
}

export interface GetInviteQuery_invite_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  permalink: string;
}

export interface GetInviteQuery_invite_project_tokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
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
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: GetInviteQuery_invite_project_tokenGates_token_network;
}

export interface GetInviteQuery_invite_project_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  projectId: string;
  token: GetInviteQuery_invite_project_tokenGates_token;
}

export interface GetInviteQuery_invite_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  tokenGates: GetInviteQuery_invite_project_tokenGates[];
}

export interface GetInviteQuery_invite {
  __typename: "Invite";
  id: Scalar.UUID;
  inviter: GetInviteQuery_invite_inviter;
  organizationRole: OrganizationRole | null;
  organization: GetInviteQuery_invite_organization | null;
  projectRole: ProjectRole | null;
  project: GetInviteQuery_invite_project | null;
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
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface GetPaymentNetworksQuery_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
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
  hasAccess: boolean;
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
// GraphQL subscription operation: TaskCreatedSubscription
// ====================================================

export interface TaskCreatedSubscription_task_subtasks_subtasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  status: TaskStatus;
}

export interface TaskCreatedSubscription_task_subtasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface TaskCreatedSubscription_task_subtasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskCreatedSubscription_task_subtasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskCreatedSubscription_task_subtasks_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskCreatedSubscription_task_subtasks_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskCreatedSubscription_task_subtasks_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: TaskCreatedSubscription_task_subtasks_reward_payment_paymentMethod_networks[];
  tokens: TaskCreatedSubscription_task_subtasks_reward_payment_paymentMethod_tokens[];
}

export interface TaskCreatedSubscription_task_subtasks_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskCreatedSubscription_task_subtasks_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskCreatedSubscription_task_subtasks_reward_payment_paymentMethod;
  network: TaskCreatedSubscription_task_subtasks_reward_payment_network;
}

export interface TaskCreatedSubscription_task_subtasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: TaskCreatedSubscription_task_subtasks_reward_token;
  payment: TaskCreatedSubscription_task_subtasks_reward_payment | null;
}

export interface TaskCreatedSubscription_task_subtasks_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskCreatedSubscription_task_subtasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: TaskCreatedSubscription_task_subtasks_applications_user;
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
  description: string | null;
  submission: string | null;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: TaskCreatedSubscription_task_subtasks_subtasks[];
  tags: TaskCreatedSubscription_task_subtasks_tags[];
  assignees: TaskCreatedSubscription_task_subtasks_assignees[];
  reward: TaskCreatedSubscription_task_subtasks_reward | null;
  applications: TaskCreatedSubscription_task_subtasks_applications[];
  review: TaskCreatedSubscription_task_subtasks_review | null;
  reactions: TaskCreatedSubscription_task_subtasks_reactions[];
}

export interface TaskCreatedSubscription_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface TaskCreatedSubscription_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskCreatedSubscription_task_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskCreatedSubscription_task_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskCreatedSubscription_task_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskCreatedSubscription_task_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: TaskCreatedSubscription_task_reward_payment_paymentMethod_networks[];
  tokens: TaskCreatedSubscription_task_reward_payment_paymentMethod_tokens[];
}

export interface TaskCreatedSubscription_task_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskCreatedSubscription_task_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskCreatedSubscription_task_reward_payment_paymentMethod;
  network: TaskCreatedSubscription_task_reward_payment_network;
}

export interface TaskCreatedSubscription_task_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: TaskCreatedSubscription_task_reward_token;
  payment: TaskCreatedSubscription_task_reward_payment | null;
}

export interface TaskCreatedSubscription_task_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskCreatedSubscription_task_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: TaskCreatedSubscription_task_applications_user;
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

export interface TaskCreatedSubscription_task_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
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

export interface TaskCreatedSubscription_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  submission: string | null;
  status: TaskStatus;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: TaskCreatedSubscription_task_subtasks[];
  tags: TaskCreatedSubscription_task_tags[];
  assignees: TaskCreatedSubscription_task_assignees[];
  reward: TaskCreatedSubscription_task_reward | null;
  applications: TaskCreatedSubscription_task_applications[];
  review: TaskCreatedSubscription_task_review | null;
  reactions: TaskCreatedSubscription_task_reactions[];
  gitBranchName: string;
  createdAt: Scalar.DateTime;
  permalink: string;
  owner: TaskCreatedSubscription_task_owner | null;
  creator: TaskCreatedSubscription_task_creator | null;
  project: TaskCreatedSubscription_task_project;
  discordChannel: TaskCreatedSubscription_task_discordChannel | null;
  githubPullRequests: TaskCreatedSubscription_task_githubPullRequests[];
  githubBranches: TaskCreatedSubscription_task_githubBranches[];
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
}

export interface TaskUpdatedSubscription_task_subtasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface TaskUpdatedSubscription_task_subtasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskUpdatedSubscription_task_subtasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskUpdatedSubscription_task_subtasks_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskUpdatedSubscription_task_subtasks_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskUpdatedSubscription_task_subtasks_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: TaskUpdatedSubscription_task_subtasks_reward_payment_paymentMethod_networks[];
  tokens: TaskUpdatedSubscription_task_subtasks_reward_payment_paymentMethod_tokens[];
}

export interface TaskUpdatedSubscription_task_subtasks_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskUpdatedSubscription_task_subtasks_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskUpdatedSubscription_task_subtasks_reward_payment_paymentMethod;
  network: TaskUpdatedSubscription_task_subtasks_reward_payment_network;
}

export interface TaskUpdatedSubscription_task_subtasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: TaskUpdatedSubscription_task_subtasks_reward_token;
  payment: TaskUpdatedSubscription_task_subtasks_reward_payment | null;
}

export interface TaskUpdatedSubscription_task_subtasks_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskUpdatedSubscription_task_subtasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: TaskUpdatedSubscription_task_subtasks_applications_user;
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
  description: string | null;
  submission: string | null;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: TaskUpdatedSubscription_task_subtasks_subtasks[];
  tags: TaskUpdatedSubscription_task_subtasks_tags[];
  assignees: TaskUpdatedSubscription_task_subtasks_assignees[];
  reward: TaskUpdatedSubscription_task_subtasks_reward | null;
  applications: TaskUpdatedSubscription_task_subtasks_applications[];
  review: TaskUpdatedSubscription_task_subtasks_review | null;
  reactions: TaskUpdatedSubscription_task_subtasks_reactions[];
}

export interface TaskUpdatedSubscription_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface TaskUpdatedSubscription_task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskUpdatedSubscription_task_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskUpdatedSubscription_task_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskUpdatedSubscription_task_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskUpdatedSubscription_task_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: TaskUpdatedSubscription_task_reward_payment_paymentMethod_networks[];
  tokens: TaskUpdatedSubscription_task_reward_payment_paymentMethod_tokens[];
}

export interface TaskUpdatedSubscription_task_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskUpdatedSubscription_task_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskUpdatedSubscription_task_reward_payment_paymentMethod;
  network: TaskUpdatedSubscription_task_reward_payment_network;
}

export interface TaskUpdatedSubscription_task_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: TaskUpdatedSubscription_task_reward_token;
  payment: TaskUpdatedSubscription_task_reward_payment | null;
}

export interface TaskUpdatedSubscription_task_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskUpdatedSubscription_task_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: TaskUpdatedSubscription_task_applications_user;
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

export interface TaskUpdatedSubscription_task_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
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

export interface TaskUpdatedSubscription_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  submission: string | null;
  status: TaskStatus;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: TaskUpdatedSubscription_task_subtasks[];
  tags: TaskUpdatedSubscription_task_tags[];
  assignees: TaskUpdatedSubscription_task_assignees[];
  reward: TaskUpdatedSubscription_task_reward | null;
  applications: TaskUpdatedSubscription_task_applications[];
  review: TaskUpdatedSubscription_task_review | null;
  reactions: TaskUpdatedSubscription_task_reactions[];
  gitBranchName: string;
  createdAt: Scalar.DateTime;
  permalink: string;
  owner: TaskUpdatedSubscription_task_owner | null;
  creator: TaskUpdatedSubscription_task_creator | null;
  project: TaskUpdatedSubscription_task_project;
  discordChannel: TaskUpdatedSubscription_task_discordChannel | null;
  githubPullRequests: TaskUpdatedSubscription_task_githubPullRequests[];
  githubBranches: TaskUpdatedSubscription_task_githubBranches[];
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

export interface PaymentUpdatedSubscription_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface PaymentUpdatedSubscription_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface PaymentUpdatedSubscription_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: PaymentUpdatedSubscription_payment_paymentMethod_networks[];
  tokens: PaymentUpdatedSubscription_payment_paymentMethod_tokens[];
}

export interface PaymentUpdatedSubscription_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
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
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskRewardUpdatedSubscription_taskReward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskRewardUpdatedSubscription_taskReward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskRewardUpdatedSubscription_taskReward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: TaskRewardUpdatedSubscription_taskReward_payment_paymentMethod_networks[];
  tokens: TaskRewardUpdatedSubscription_taskReward_payment_paymentMethod_tokens[];
}

export interface TaskRewardUpdatedSubscription_taskReward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskRewardUpdatedSubscription_taskReward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskRewardUpdatedSubscription_taskReward_payment_paymentMethod;
  network: TaskRewardUpdatedSubscription_taskReward_payment_network;
}

export interface TaskRewardUpdatedSubscription_taskReward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: TaskRewardUpdatedSubscription_taskReward_token;
  payment: TaskRewardUpdatedSubscription_taskReward_payment | null;
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
// GraphQL fragment: PaymentNetwork
// ====================================================

export interface PaymentNetwork {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
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

export interface PaymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface PaymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface PaymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: PaymentMethod_networks[];
  tokens: PaymentMethod_tokens[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Payment
// ====================================================

export interface Payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface Payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface Payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: Payment_paymentMethod_networks[];
  tokens: Payment_paymentMethod_tokens[];
}

export interface Payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
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
// GraphQL fragment: Organization
// ====================================================

export interface Organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  permalink: string;
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
// GraphQL fragment: ProjectMember
// ====================================================

export interface ProjectMember_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface ProjectMember {
  __typename: "ProjectMember";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  userId: string;
  user: ProjectMember_user;
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
  config: Scalar.JSONObject;
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
// GraphQL fragment: Project
// ====================================================

export interface Project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
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
  type: string;
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
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: ProjectTokenGate_token_network;
}

export interface ProjectTokenGate {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
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
}

export interface Invite_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  permalink: string;
}

export interface Invite_project_tokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
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
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: Invite_project_tokenGates_token_network;
}

export interface Invite_project_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  projectId: string;
  token: Invite_project_tokenGates_token;
}

export interface Invite_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  tokenGates: Invite_project_tokenGates[];
}

export interface Invite {
  __typename: "Invite";
  id: Scalar.UUID;
  inviter: Invite_inviter;
  organizationRole: OrganizationRole | null;
  organization: Invite_organization | null;
  projectRole: ProjectRole | null;
  project: Invite_project | null;
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
}

export interface ProjectDetails_members_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface ProjectDetails_members {
  __typename: "ProjectMember";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  userId: string;
  user: ProjectDetails_members_user;
}

export interface ProjectDetails_paymentMethods_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface ProjectDetails_paymentMethods_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface ProjectDetails_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: ProjectDetails_paymentMethods_networks[];
  tokens: ProjectDetails_paymentMethods_tokens[];
}

export interface ProjectDetails_integrations {
  __typename: "ProjectIntegration";
  id: Scalar.UUID;
  type: string;
  config: Scalar.JSONObject;
}

export interface ProjectDetails_tokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
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
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: ProjectDetails_tokenGates_token_network;
}

export interface ProjectDetails_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  projectId: string;
  token: ProjectDetails_tokenGates_token;
}

export interface ProjectDetails {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  taskCount: number;
  options: ProjectDetails_options | null;
  doneTaskCount: number;
  openBountyTaskCount: number;
  members: ProjectDetails_members[];
  paymentMethods: ProjectDetails_paymentMethods[];
  integrations: ProjectDetails_integrations[];
  tokenGates: ProjectDetails_tokenGates[];
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
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskReward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskReward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskReward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: TaskReward_payment_paymentMethod_networks[];
  tokens: TaskReward_payment_paymentMethod_tokens[];
}

export interface TaskReward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskReward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskReward_payment_paymentMethod;
  network: TaskReward_payment_network;
}

export interface TaskReward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: TaskReward_token;
  payment: TaskReward_payment | null;
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
// GraphQL fragment: DiscordIntegrationChannel
// ====================================================

export interface DiscordIntegrationChannel {
  __typename: "DiscordIntegrationChannel";
  id: string;
  name: string;
  integrationId: Scalar.UUID;
  hasAccess: boolean;
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
}

export interface TaskApplication {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: TaskApplication_user;
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
}

export interface Task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface Task_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface Task_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface Task_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface Task_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface Task_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: Task_reward_payment_paymentMethod_networks[];
  tokens: Task_reward_payment_paymentMethod_tokens[];
}

export interface Task_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface Task_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: Task_reward_payment_paymentMethod;
  network: Task_reward_payment_network;
}

export interface Task_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: Task_reward_token;
  payment: Task_reward_payment | null;
}

export interface Task_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface Task_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: Task_applications_user;
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
  submission: string | null;
  status: TaskStatus;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: Task_subtasks[];
  tags: Task_tags[];
  assignees: Task_assignees[];
  reward: Task_reward | null;
  applications: Task_applications[];
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
}

export interface TaskWithOrganization_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface TaskWithOrganization_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskWithOrganization_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskWithOrganization_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskWithOrganization_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskWithOrganization_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: TaskWithOrganization_reward_payment_paymentMethod_networks[];
  tokens: TaskWithOrganization_reward_payment_paymentMethod_tokens[];
}

export interface TaskWithOrganization_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskWithOrganization_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskWithOrganization_reward_payment_paymentMethod;
  network: TaskWithOrganization_reward_payment_network;
}

export interface TaskWithOrganization_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: TaskWithOrganization_reward_token;
  payment: TaskWithOrganization_reward_payment | null;
}

export interface TaskWithOrganization_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskWithOrganization_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: TaskWithOrganization_applications_user;
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
  permalink: string;
}

export interface TaskWithOrganization_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  organization: TaskWithOrganization_project_organization;
}

export interface TaskWithOrganization {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  submission: string | null;
  status: TaskStatus;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: TaskWithOrganization_subtasks[];
  tags: TaskWithOrganization_tags[];
  assignees: TaskWithOrganization_assignees[];
  reward: TaskWithOrganization_reward | null;
  applications: TaskWithOrganization_applications[];
  review: TaskWithOrganization_review | null;
  reactions: TaskWithOrganization_reactions[];
  project: TaskWithOrganization_project;
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
}

export interface TaskDetails_subtasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface TaskDetails_subtasks_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskDetails_subtasks_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskDetails_subtasks_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskDetails_subtasks_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskDetails_subtasks_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: TaskDetails_subtasks_reward_payment_paymentMethod_networks[];
  tokens: TaskDetails_subtasks_reward_payment_paymentMethod_tokens[];
}

export interface TaskDetails_subtasks_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskDetails_subtasks_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskDetails_subtasks_reward_payment_paymentMethod;
  network: TaskDetails_subtasks_reward_payment_network;
}

export interface TaskDetails_subtasks_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: TaskDetails_subtasks_reward_token;
  payment: TaskDetails_subtasks_reward_payment | null;
}

export interface TaskDetails_subtasks_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskDetails_subtasks_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: TaskDetails_subtasks_applications_user;
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
  description: string | null;
  submission: string | null;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: TaskDetails_subtasks_subtasks[];
  tags: TaskDetails_subtasks_tags[];
  assignees: TaskDetails_subtasks_assignees[];
  reward: TaskDetails_subtasks_reward | null;
  applications: TaskDetails_subtasks_applications[];
  review: TaskDetails_subtasks_review | null;
  reactions: TaskDetails_subtasks_reactions[];
}

export interface TaskDetails_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
  createdAt: Scalar.DateTime;
}

export interface TaskDetails_assignees {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskDetails_reward_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskDetails_reward_payment_paymentMethod_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskDetails_reward_payment_paymentMethod_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface TaskDetails_reward_payment_paymentMethod {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: TaskDetails_reward_payment_paymentMethod_networks[];
  tokens: TaskDetails_reward_payment_paymentMethod_tokens[];
}

export interface TaskDetails_reward_payment_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface TaskDetails_reward_payment {
  __typename: "Payment";
  id: Scalar.UUID;
  status: PaymentStatus;
  data: Scalar.JSONObject | null;
  paymentMethod: TaskDetails_reward_payment_paymentMethod;
  network: TaskDetails_reward_payment_network;
}

export interface TaskDetails_reward {
  __typename: "TaskReward";
  id: Scalar.UUID;
  amount: string;
  trigger: TaskRewardTrigger;
  token: TaskDetails_reward_token;
  payment: TaskDetails_reward_payment | null;
}

export interface TaskDetails_applications_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskDetails_applications {
  __typename: "TaskApplication";
  id: Scalar.UUID;
  message: string | null;
  startDate: Scalar.DateTime;
  endDate: Scalar.DateTime;
  userId: string;
  user: TaskDetails_applications_user;
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

export interface TaskDetails_owner {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskDetails_creator {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface TaskDetails_project {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
}

export interface TaskDetails_discordChannel {
  __typename: "DiscordChannel";
  id: Scalar.UUID;
  link: string;
  name: string;
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

export interface TaskDetails {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  submission: string | null;
  status: TaskStatus;
  sortKey: string;
  storyPoints: number | null;
  deletedAt: Scalar.DateTime | null;
  projectId: string;
  ownerId: string | null;
  number: number;
  subtasks: TaskDetails_subtasks[];
  tags: TaskDetails_tags[];
  assignees: TaskDetails_assignees[];
  reward: TaskDetails_reward | null;
  applications: TaskDetails_applications[];
  review: TaskDetails_review | null;
  reactions: TaskDetails_reactions[];
  gitBranchName: string;
  createdAt: Scalar.DateTime;
  permalink: string;
  owner: TaskDetails_owner | null;
  creator: TaskDetails_creator | null;
  project: TaskDetails_project;
  discordChannel: TaskDetails_discordChannel | null;
  githubPullRequests: TaskDetails_githubPullRequests[];
  githubBranches: TaskDetails_githubBranches[];
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
  permalink: string;
}

export interface UserProfile_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
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
  permalink: string;
}

export interface UserDetails_details {
  __typename: "EntityDetail";
  id: Scalar.UUID;
  type: EntityDetailType;
  value: string;
}

export interface UserDetails_threepids {
  __typename: "Threepid";
  id: Scalar.UUID;
  source: ThreepidSource;
}

export interface UserDetails_paymentMethods_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface UserDetails_paymentMethods_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface UserDetails_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: UserDetails_paymentMethods_networks[];
  tokens: UserDetails_paymentMethods_tokens[];
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
  paymentMethods: UserDetails_paymentMethods[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: OrganizationDetails
// ====================================================

export interface OrganizationDetails_projects_options {
  __typename: "ProjectOptions";
  showBacklogColumn: boolean | null;
}

export interface OrganizationDetails_projects_members_user {
  __typename: "User";
  id: Scalar.UUID;
  username: string;
  imageUrl: string | null;
}

export interface OrganizationDetails_projects_members {
  __typename: "ProjectMember";
  id: Scalar.UUID;
  role: ProjectRole;
  projectId: string;
  userId: string;
  user: OrganizationDetails_projects_members_user;
}

export interface OrganizationDetails_projects_paymentMethods_networks {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface OrganizationDetails_projects_paymentMethods_tokens {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
}

export interface OrganizationDetails_projects_paymentMethods {
  __typename: "PaymentMethod";
  id: Scalar.UUID;
  type: PaymentMethodType;
  address: string;
  networks: OrganizationDetails_projects_paymentMethods_networks[];
  tokens: OrganizationDetails_projects_paymentMethods_tokens[];
}

export interface OrganizationDetails_projects_integrations {
  __typename: "ProjectIntegration";
  id: Scalar.UUID;
  type: string;
  config: Scalar.JSONObject;
}

export interface OrganizationDetails_projects_tokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
  config: Scalar.JSONObject;
  sortKey: string;
}

export interface OrganizationDetails_projects_tokenGates_token {
  __typename: "PaymentToken";
  id: Scalar.UUID;
  exp: number;
  type: PaymentTokenType;
  name: string;
  symbol: string;
  address: string | null;
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: OrganizationDetails_projects_tokenGates_token_network;
}

export interface OrganizationDetails_projects_tokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  projectId: string;
  token: OrganizationDetails_projects_tokenGates_token;
}

export interface OrganizationDetails_projects {
  __typename: "Project";
  id: Scalar.UUID;
  slug: string;
  name: string;
  description: string | null;
  visibility: ProjectVisibility;
  deletedAt: Scalar.DateTime | null;
  organizationId: string;
  permalink: string;
  taskCount: number;
  options: OrganizationDetails_projects_options | null;
  doneTaskCount: number;
  openBountyTaskCount: number;
  members: OrganizationDetails_projects_members[];
  paymentMethods: OrganizationDetails_projects_paymentMethods[];
  integrations: OrganizationDetails_projects_integrations[];
  tokenGates: OrganizationDetails_projects_tokenGates[];
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

export interface OrganizationDetails_integrations {
  __typename: "OrganizationIntegration";
  id: Scalar.UUID;
  type: OrganizationIntegrationType;
  config: Scalar.JSONObject;
}

export interface OrganizationDetails_projectTokenGates_token_network {
  __typename: "PaymentNetwork";
  id: Scalar.UUID;
  slug: string;
  name: string;
  type: string;
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
  networkId: string;
  visibility: PaymentTokenVisibility;
  network: OrganizationDetails_projectTokenGates_token_network;
}

export interface OrganizationDetails_projectTokenGates {
  __typename: "ProjectTokenGate";
  id: Scalar.UUID;
  projectId: string;
  token: OrganizationDetails_projectTokenGates_token;
}

export interface OrganizationDetails {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  slug: string;
  permalink: string;
  tagline: string | null;
  description: string | null;
  projects: OrganizationDetails_projects[];
  members: OrganizationDetails_members[];
  tags: OrganizationDetails_tags[];
  details: OrganizationDetails_details[];
  integrations: OrganizationDetails_integrations[];
  projectTokenGates: OrganizationDetails_projectTokenGates[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

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

export enum OrganizationIntegrationType {
  DISCORD = "DISCORD",
  GITHUB = "GITHUB",
}

export enum OrganizationRole {
  ADMIN = "ADMIN",
  FOLLOWER = "FOLLOWER",
  OWNER = "OWNER",
}

export enum PaymentMethodType {
  GNOSIS_SAFE = "GNOSIS_SAFE",
  METAMASK = "METAMASK",
  PHANTOM = "PHANTOM",
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
}

export enum PaymentTokenVisibility {
  ALWAYS = "ALWAYS",
  IF_HAS_BALANCE = "IF_HAS_BALANCE",
}

export enum ProjectIntegrationType {
  DISCORD = "DISCORD",
  GITHUB = "GITHUB",
}

export enum ProjectRole {
  ADMIN = "ADMIN",
  CONTRIBUTOR = "CONTRIBUTOR",
}

export enum ProjectVisibility {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}

export enum TaskRewardTrigger {
  CORE_TEAM_APPROVAL = "CORE_TEAM_APPROVAL",
  PULL_REQUEST_MERGED = "PULL_REQUEST_MERGED",
}

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  DONE = "DONE",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  TODO = "TODO",
}

export enum ThreepidSource {
  discord = "discord",
  github = "github",
  metamask = "metamask",
}

export interface CreateFileUploadUrlInput {
  fileName: string;
  contentType: string;
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

export interface CreateOrganizationTagInput {
  label: string;
  color: string;
  organizationId: Scalar.UUID;
}

export interface CreatePaymentMethodInput {
  type: PaymentMethodType;
  address: string;
  networkIds: Scalar.UUID[];
  tokenIds?: Scalar.UUID[] | null;
  projectId?: Scalar.UUID | null;
  userId?: Scalar.UUID | null;
}

export interface CreatePaymentTokenInput {
  type: PaymentTokenType;
  address: string;
  name: string;
  symbol: string;
  exp: number;
  networkId: Scalar.UUID;
}

export interface CreateProjectInput {
  name: string;
  organizationId: Scalar.UUID;
  visibility?: ProjectVisibility | null;
  options?: ProjectOptionsInput | null;
}

export interface CreateProjectIntegrationInput {
  type: ProjectIntegrationType;
  config: Scalar.JSONObject;
  projectId: Scalar.UUID;
  organizationIntegrationId?: Scalar.UUID | null;
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
  assigneeIds?: Scalar.UUID[] | null;
  ownerId?: Scalar.UUID | null;
  storyPoints?: number | null;
  status: TaskStatus;
  reward?: UpdateTaskRewardInput | null;
}

export interface CreateTaskPaymentsInput {
  taskRewardIds: Scalar.UUID[];
  paymentMethodId: Scalar.UUID;
  networkId: Scalar.UUID;
  data?: Scalar.JSONObject | null;
}

export interface CreateTaskTagInput {
  label: string;
  color: string;
  projectId: Scalar.UUID;
}

export interface DeleteTaskApplicationInput {
  taskId: Scalar.UUID;
  userId: Scalar.UUID;
}

export interface GetTasksInput {
  ids?: Scalar.UUID[] | null;
  organizationIds?: Scalar.UUID[] | null;
  statuses?: TaskStatus[] | null;
  limit?: number | null;
}

export interface GetUserPermissionsInput {
  organizationId?: Scalar.UUID | null;
  projectId?: Scalar.UUID | null;
  taskId?: Scalar.UUID | null;
}

export interface OrganizationInviteInput {
  organizationId: Scalar.UUID;
  role: OrganizationRole;
}

export interface ProjectInviteInput {
  projectId: Scalar.UUID;
  role: ProjectRole;
}

export interface ProjectOptionsInput {
  showBacklogColumn?: boolean | null;
}

export interface ProjectTokenGateInput {
  projectId: Scalar.UUID;
  tokenId: Scalar.UUID;
}

export interface RemoveOrganizationMemberInput {
  organizationId: Scalar.UUID;
  userId: Scalar.UUID;
}

export interface RemoveProjectMemberInput {
  projectId: Scalar.UUID;
  userId: Scalar.UUID;
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

export interface TaskReactionInput {
  reaction: string;
  taskId: Scalar.UUID;
}

export interface UpdateOrganizationInput {
  id: Scalar.UUID;
  name?: string | null;
  tagline?: string | null;
  description?: string | null;
  tagIds?: Scalar.UUID[] | null;
  imageUrl?: string | null;
  deletedAt?: Scalar.DateTime | null;
}

export interface UpdateOrganizationMemberInput {
  organizationId: Scalar.UUID;
  userId: Scalar.UUID;
  role?: OrganizationRole | null;
  sortKey?: string | null;
}

export interface UpdatePaymentMethodInput {
  id: Scalar.UUID;
  deletedAt: Scalar.DateTime;
}

export interface UpdateProjectInput {
  id: Scalar.UUID;
  name?: string | null;
  description?: string | null;
  visibility?: ProjectVisibility | null;
  options?: ProjectOptionsInput | null;
  deletedAt?: Scalar.DateTime | null;
}

export interface UpdateProjectIntegrationInput {
  id: Scalar.UUID;
  deletedAt?: Scalar.DateTime | null;
}

export interface UpdateProjectMemberInput {
  projectId: Scalar.UUID;
  userId: Scalar.UUID;
  role: ProjectRole;
}

export interface UpdateTaskInput {
  id: Scalar.UUID;
  name?: string | null;
  description?: string | null;
  parentTaskId?: Scalar.UUID | null;
  submission?: string | null;
  sortKey?: string | null;
  tagIds?: Scalar.UUID[] | null;
  assigneeIds?: Scalar.UUID[] | null;
  ownerId?: Scalar.UUID | null;
  storyPoints?: number | null;
  status?: TaskStatus | null;
  reward?: UpdateTaskRewardInput | null;
  review?: UpdateTaskReviewInput | null;
}

export interface UpdateTaskReviewInput {
  message?: string | null;
  rating?: number | null;
  reviewerId?: Scalar.UUID | null;
}

export interface UpdateTaskRewardInput {
  amount: string;
  tokenId: Scalar.UUID;
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
