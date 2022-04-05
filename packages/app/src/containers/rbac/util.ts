import { RoleWithRules, Rule, RulePermission } from "@dewo/app/graphql/types";

export function getRule(
  role: RoleWithRules,
  permission: RulePermission,
  context: { projectId?: string; taskId?: string } = {}
): Rule | undefined {
  return role.rules.find((r) => {
    const matchesProject = (r.projectId ?? undefined) === context.projectId;
    const matchesTask = (r.taskId ?? undefined) === context.taskId;
    return (
      matchesProject &&
      matchesTask &&
      r.permission === permission &&
      !r.inverted
    );
  });
}

export function hasRule(
  role: RoleWithRules,
  permission: RulePermission,
  context: { projectId?: string; taskId?: string } = {}
): boolean {
  return !!getRule(role, permission, context);
}
