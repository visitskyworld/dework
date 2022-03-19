import { ProjectRole } from "@dewo/app/graphql/types";

export const projectRoleToString: Record<ProjectRole, string> = {
  [ProjectRole.ADMIN]: "Steward",
  [ProjectRole.CONTRIBUTOR]: "Contributor",
};

export const projectRoleDescription: Record<ProjectRole, string> = {
  [ProjectRole.ADMIN]: [
    "Manage Project permission can:",
    "- do everything the View Project permission can",
    "- manage all tasks, applications, submissions",
    "- manage project settings",
  ].join("\n"),
  [ProjectRole.CONTRIBUTOR]: [
    "View Project permission can:",
    "- view private projects and its",
    "- apply to tasks",
    "- manage tasks they're assigned to or reviewing",
    "- create and vote on community suggestions",
  ].join("\n"),
};
