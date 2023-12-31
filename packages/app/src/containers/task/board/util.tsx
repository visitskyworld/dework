import { ReactNode, useMemo } from "react";
import {
  PaymentMethodType,
  ProjectDetails,
  Task,
  TaskPriority,
  TaskSection,
  TaskStatus,
} from "@dewo/app/graphql/types";
import { inject } from "between";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useProject } from "../../project/hooks";
import { useProjectPaymentMethods } from "../../payment/hooks";

const Between = inject("0123456789");

export interface TaskSectionData {
  id: string;
  tasks: Task[];
  title: string;
  section?: TaskSection;
  button?: ReactNode;
}

export const STATUS_LABEL: Record<TaskStatus, string> = {
  [TaskStatus.COMMUNITY_SUGGESTIONS]: "Community Suggestions",
  [TaskStatus.BACKLOG]: "Backlog",
  [TaskStatus.TODO]: "To Do",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.IN_REVIEW]: "In Review",
  [TaskStatus.DONE]: "Done",
};

export const getProjectTaskStatuses = (
  projectDetails: ProjectDetails | undefined
) => {
  const keys = Object.keys(STATUS_LABEL) as TaskStatus[];
  if (!projectDetails) return keys;
  const { showCommunitySuggestions } = projectDetails.options ?? {};
  const statuses = keys.filter((status) => {
    if (status === TaskStatus.COMMUNITY_SUGGESTIONS) {
      return showCommunitySuggestions;
    }
    return true;
  });
  return statuses;
};

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  [TaskPriority.NONE]: "No Priority",
  [TaskPriority.LOW]: "Low Priority",
  [TaskPriority.MEDIUM]: "Medium Priority",
  [TaskPriority.HIGH]: "High Priority",
  [TaskPriority.URGENT]: "Urgent",
};

export function useShouldShowInlinePayButton(task: Task): boolean {
  const { project } = useProject(task.projectId);
  const paymentMethods = useProjectPaymentMethods(task.projectId);
  const canManageProject = usePermission("update", project);
  const unpaidRewards = useMemo(
    () => task.rewards.filter((r) => !r.payments.length),
    [task.rewards]
  );
  const isGnosisSafeConnected = useMemo(
    () =>
      !!paymentMethods?.some(
        (pm) =>
          pm.type === PaymentMethodType.GNOSIS_SAFE &&
          unpaidRewards.some((r) => r.token.networkId === pm.network.id)
      ),
    [paymentMethods, unpaidRewards]
  );
  return (
    task.status === TaskStatus.DONE &&
    !!task.assignees.length &&
    !!unpaidRewards.length &&
    !!canManageProject &&
    !isGnosisSafeConnected
  );
}

export function getSortKeyBetween<T>(
  itemAbove: T | undefined,
  itemBelow: T | undefined,
  getSortKey: (item: T) => string | undefined
): string {
  const [a, b] = [
    !!itemAbove ? getSortKey(itemAbove) ?? Between.lo : Between.lo,
    !!itemBelow
      ? getSortKey(itemBelow) ?? String(Date.now())
      : String(Date.now()),
  ].sort(Between.strord);

  if (a === b) return a;
  return Between.between(a, b);
}
