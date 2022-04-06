import { registerEnumType } from "@nestjs/graphql";

export enum TaskGatingType {
  ASSIGNEES = "ASSIGNEES",
  APPLICATION = "APPLICATION",
  ROLES = "ROLES",
  OPEN_SUBMISSION = "OPEN_SUBMISSION",
}

registerEnumType(TaskGatingType, { name: "TaskGatingType" });
