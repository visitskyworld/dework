import {
  RoleWithRules,
  RulePermission,
  Task,
  TaskPriority,
  TaskStatus,
} from "@dewo/app/graphql/types";

export const matchingName = (name: string | undefined) => (t: Task) =>
  !name?.length || t.name.toLowerCase().includes(name.toLowerCase());
export const matchingTagLabels = (labels: string[] | undefined) => (t: Task) =>
  !labels?.length ||
  t.tags.some((tag) => labels.includes(tag.label.toLowerCase()));
export const matchingTagIds = (ids: string[] | undefined) => (t: Task) =>
  !ids?.length || t.tags.some((x) => ids.includes(x.id));
export const matchingAssigneeIds =
  (ids: (string | null)[] | undefined) => (t: Task) =>
    !ids?.length ||
    t.assignees.some((x) => ids.includes(x.id)) ||
    (ids.includes(null) && !t.assignees.length);
export const matchingOwnerIds = (ids: string[] | undefined) => (t: Task) =>
  !ids?.length || t.owners.some((x) => ids.includes(x.id));
export const matchingStatuses =
  (statuses: TaskStatus[] | undefined) => (t: Task) =>
    !statuses?.length || statuses.includes(t.status);
export const matchingPriorities =
  (priorities: TaskPriority[] | undefined) => (t: Task) =>
    !priorities?.length || priorities.includes(t.priority);
export const matchingProjects = (ids: string[] | undefined) => (t: Task) =>
  !ids?.length || ids.includes(t.projectId);
export const matchingRoles =
  (ids: string[] | undefined, roles: RoleWithRules[] | undefined) =>
  (t: Task) =>
    !ids?.length ||
    !!roles
      ?.filter((r) => ids.includes(r.id))
      .some((r) =>
        r.rules.some(
          (r) =>
            r.permission === RulePermission.MANAGE_TASKS && r.taskId === t.id
        )
      );
