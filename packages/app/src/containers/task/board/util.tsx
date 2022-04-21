import { ReactNode, useMemo } from "react";
import {
  PaymentMethodType,
  Task,
  TaskSection,
  TaskStatus,
} from "@dewo/app/graphql/types";
import { inject } from "between";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useProject, useProjectPaymentMethods } from "../../project/hooks";

const Between = inject("0123456789");

export interface TaskSectionData {
  id: string;
  tasks: Task[];
  title: string;
  section?: TaskSection;
  button?: ReactNode;
}

export const STATUS_LABEL: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "Community Suggestions",
  [TaskStatus.TODO]: "To Do",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.IN_REVIEW]: "In Review",
  [TaskStatus.DONE]: "Done",
};

export function useShouldShowInlinePayButton(task: Task): boolean {
  const { project } = useProject(task.projectId);
  const paymentMethods = useProjectPaymentMethods(task.projectId);
  const canManageProject = usePermission("update", project);
  const hasPaymentMethod = useMemo(
    () =>
      !!paymentMethods?.some(
        (pm) =>
          pm.type !== PaymentMethodType.GNOSIS_SAFE &&
          pm.networks.some((n) => n.id === task.reward?.token.networkId)
      ),
    [paymentMethods, task.reward?.token.networkId]
  );
  return (
    task.status === TaskStatus.DONE &&
    !!task.assignees.length &&
    !!task.reward &&
    !task.reward.payment &&
    !!canManageProject &&
    hasPaymentMethod
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
