import { ProjectRole } from "@dewo/app/graphql/types";

export const projectRoleToString: Record<ProjectRole, string> = {
  [ProjectRole.ADMIN]: "Steward",
  [ProjectRole.CONTRIBUTOR]: "Contributor",
};

export const projectRoleDescription: Record<ProjectRole, string> = {
  [ProjectRole.ADMIN]: [
    "Project Stewards can:",
    "- do everything Contributors can",
    "- manage all tasks, applications, submissions",
    "- manage project settings",
  ].join("\n"),
  [ProjectRole.CONTRIBUTOR]: [
    "Project Contributors can:",
    "- see private projects",
    "- apply to tasks",
    "- manage tasks they're assigned to or reviewing",
    "- create and vote on community suggestions",
  ].join("\n"),
};
