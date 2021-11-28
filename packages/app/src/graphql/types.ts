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
  username: string | null;
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
// GraphQL mutation operation: CreateOrganizationMutation
// ====================================================

export interface CreateOrganizationMutation_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
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
// GraphQL mutation operation: CreateProjectMutation
// ====================================================

export interface CreateProjectMutation_project_organization_projects {
  __typename: "Project";
  id: Scalar.UUID;
  name: string;
}

export interface CreateProjectMutation_project_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  projects: CreateProjectMutation_project_organization_projects[];
}

export interface CreateProjectMutation_project {
  __typename: "Project";
  id: Scalar.UUID;
  name: string;
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
// GraphQL mutation operation: CreateTaskMutation
// ====================================================

export interface CreateTaskMutation_task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface CreateTaskMutation_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatusEnum;
  sortKey: string;
  tags: CreateTaskMutation_task_tags[];
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
// GraphQL query operation: MeQuery
// ====================================================

export interface MeQuery_me_organizations {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
}

export interface MeQuery_me {
  __typename: "User";
  id: Scalar.UUID;
  username: string | null;
  imageUrl: string | null;
  organizations: MeQuery_me_organizations[];
}

export interface MeQuery {
  me: MeQuery_me;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationQuery
// ====================================================

export interface GetOrganizationQuery_organization_projects {
  __typename: "Project";
  id: Scalar.UUID;
  name: string;
}

export interface GetOrganizationQuery_organization {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  projects: GetOrganizationQuery_organization_projects[];
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
// GraphQL query operation: GetProjectQuery
// ====================================================

export interface GetProjectQuery_project_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface GetProjectQuery_project_tasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatusEnum;
  sortKey: string;
  tags: GetProjectQuery_project_tasks_tags[];
}

export interface GetProjectQuery_project_taskTags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface GetProjectQuery_project {
  __typename: "Project";
  id: Scalar.UUID;
  name: string;
  tasks: GetProjectQuery_project_tasks[];
  taskTags: GetProjectQuery_project_taskTags[];
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
// GraphQL fragment: User
// ====================================================

export interface User {
  __typename: "User";
  id: Scalar.UUID;
  username: string | null;
  imageUrl: string | null;
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
  name: string;
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
// GraphQL fragment: Task
// ====================================================

export interface Task_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface Task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatusEnum;
  sortKey: string;
  tags: Task_tags[];
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
}

export interface UserDetails {
  __typename: "User";
  id: Scalar.UUID;
  username: string | null;
  imageUrl: string | null;
  organizations: UserDetails_organizations[];
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
  name: string;
}

export interface OrganizationDetails {
  __typename: "Organization";
  id: Scalar.UUID;
  name: string;
  imageUrl: string | null;
  projects: OrganizationDetails_projects[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProjectDetails
// ====================================================

export interface ProjectDetails_tasks_tags {
  __typename: "TaskTag";
  id: Scalar.UUID;
  label: string;
  color: string;
}

export interface ProjectDetails_tasks {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  description: string | null;
  status: TaskStatusEnum;
  sortKey: string;
  tags: ProjectDetails_tasks_tags[];
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
  name: string;
  tasks: ProjectDetails_tasks[];
  taskTags: ProjectDetails_taskTags[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum TaskStatusEnum {
  DONE = "DONE",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  TODO = "TODO",
}

export interface CreateOrganizationInput {
  name: string;
  imageUrl?: string | null;
}

export interface CreateProjectInput {
  name: string;
  organizationId: Scalar.UUID;
}

export interface CreateTaskInput {
  name: string;
  description: string;
  projectId: Scalar.UUID;
  status: TaskStatusEnum;
}

export interface CreateTaskTagInput {
  label: string;
  color: string;
  projectId: Scalar.UUID;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
