import { registerEnumType } from "@nestjs/graphql";

export enum OrganizationRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  FOLLOWER = "FOLLOWER",
}

registerEnumType(OrganizationRole, { name: "OrganizationRole" });
