import { registerEnumType } from "@nestjs/graphql";

export enum ProjectRole {
  ADMIN = "ADMIN",
  CONTRIBUTOR = "CONTRIBUTOR",
}

registerEnumType(ProjectRole, { name: "ProjectRole" });
