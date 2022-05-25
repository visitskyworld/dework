import { registerEnumType } from "@nestjs/graphql";

export enum RulePermission {
  MANAGE_ORGANIZATION = "MANAGE_ORGANIZATION",
  MANAGE_PROJECTS = "MANAGE_PROJECTS",
  MANAGE_TASKS = "MANAGE_TASKS",
  MANAGE_FUNDING = "MANAGE_FUNDING",
  VIEW_PROJECTS = "VIEW_PROJECTS",
}

registerEnumType(RulePermission, { name: "RulePermission" });
