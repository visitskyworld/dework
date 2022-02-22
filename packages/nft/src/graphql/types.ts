/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTaskNFTMetadataQuery
// ====================================================

export interface GetTaskNFTMetadataQuery_nft_assignee_threepids {
  __typename: "Threepid";
  source: ThreepidSource;
  threepid: string;
}

export interface GetTaskNFTMetadataQuery_nft_assignee_paymentMethods {
  __typename: "PaymentMethod";
  type: PaymentMethodType;
  address: string;
}

export interface GetTaskNFTMetadataQuery_nft_assignee {
  __typename: "User";
  username: string;
  imageUrl: string | null;
  threepids: GetTaskNFTMetadataQuery_nft_assignee_threepids[];
  paymentMethods: GetTaskNFTMetadataQuery_nft_assignee_paymentMethods[];
}

export interface GetTaskNFTMetadataQuery_nft_owner_threepids {
  __typename: "Threepid";
  source: ThreepidSource;
  threepid: string;
}

export interface GetTaskNFTMetadataQuery_nft_owner_paymentMethods {
  __typename: "PaymentMethod";
  type: PaymentMethodType;
  address: string;
}

export interface GetTaskNFTMetadataQuery_nft_owner {
  __typename: "User";
  username: string;
  imageUrl: string | null;
  threepids: GetTaskNFTMetadataQuery_nft_owner_threepids[];
  paymentMethods: GetTaskNFTMetadataQuery_nft_owner_paymentMethods[];
}

export interface GetTaskNFTMetadataQuery_nft_task_project_organization {
  __typename: "Organization";
  name: string;
  permalink: string;
  imageUrl: string | null;
}

export interface GetTaskNFTMetadataQuery_nft_task_project {
  __typename: "Project";
  organization: GetTaskNFTMetadataQuery_nft_task_project_organization;
}

export interface GetTaskNFTMetadataQuery_nft_task {
  __typename: "Task";
  id: Scalar.UUID;
  name: string;
  doneAt: Scalar.DateTime | null;
  project: GetTaskNFTMetadataQuery_nft_task_project;
}

export interface GetTaskNFTMetadataQuery_nft {
  __typename: "TaskNFT";
  id: Scalar.UUID;
  tokenId: number;
  permalink: string;
  assignee: GetTaskNFTMetadataQuery_nft_assignee;
  owner: GetTaskNFTMetadataQuery_nft_owner | null;
  task: GetTaskNFTMetadataQuery_nft_task;
}

export interface GetTaskNFTMetadataQuery {
  nft: GetTaskNFTMetadataQuery_nft;
}

export interface GetTaskNFTMetadataQueryVariables {
  tokenId: number;
  contractId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: User
// ====================================================

export interface User_threepids {
  __typename: "Threepid";
  source: ThreepidSource;
  threepid: string;
}

export interface User_paymentMethods {
  __typename: "PaymentMethod";
  type: PaymentMethodType;
  address: string;
}

export interface User {
  __typename: "User";
  username: string;
  imageUrl: string | null;
  threepids: User_threepids[];
  paymentMethods: User_paymentMethods[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum PaymentMethodType {
  GNOSIS_SAFE = "GNOSIS_SAFE",
  HIRO = "HIRO",
  METAMASK = "METAMASK",
  PHANTOM = "PHANTOM",
}

export enum ThreepidSource {
  discord = "discord",
  github = "github",
  hiro = "hiro",
  metamask = "metamask",
  notion = "notion",
  trello = "trello",
}

//==============================================================
// END Enums and Input Objects
//==============================================================
