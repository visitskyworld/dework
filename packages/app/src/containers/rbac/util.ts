import { RoleWithRules, Rule, RulePermission } from "@dewo/app/graphql/types";

interface RuleContext {
  projectId?: string;
  fundingSessionId?: string;
  taskId?: string;
}

export function getRule(
  role: RoleWithRules,
  permission: RulePermission,
  context: RuleContext = {}
): Rule | undefined {
  return role.rules.find((r) => {
    const matchesFundingSession =
      (r.fundingSessionId ?? undefined) === context.fundingSessionId;
    const matchesProject = (r.projectId ?? undefined) === context.projectId;
    const matchesTask = (r.taskId ?? undefined) === context.taskId;
    return (
      matchesFundingSession &&
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
  context: RuleContext = {}
): boolean {
  return !!getRule(role, permission, context);
}
