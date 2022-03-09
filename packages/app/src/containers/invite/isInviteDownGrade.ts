import { OrganizationRole, ProjectRole } from "@dewo/app/graphql/types";

const OrganizationRoleHierarchy: Record<OrganizationRole, number> = {
  [OrganizationRole.OWNER]: 2,
  [OrganizationRole.ADMIN]: 1,
  [OrganizationRole.FOLLOWER]: 0,
};

export const isOrganizationInviteDownGrade = (
  memberRole: OrganizationRole,
  inviteRole: OrganizationRole
) => {
  return (
    OrganizationRoleHierarchy[memberRole] >=
    OrganizationRoleHierarchy[inviteRole]
  );
};

const ProjectRoleHierarchy: Record<ProjectRole, number> = {
  [ProjectRole.ADMIN]: 1,
  [ProjectRole.CONTRIBUTOR]: 0,
};

export const isProjectInviteDownGrade = (
  memberRole: ProjectRole,
  inviteRole: ProjectRole
) => {
  return ProjectRoleHierarchy[memberRole] >= ProjectRoleHierarchy[inviteRole];
};
