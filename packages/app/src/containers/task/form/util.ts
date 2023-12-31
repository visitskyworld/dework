import {
  RoleWithRules,
  TaskDetails,
  TaskReward,
  UpdateTaskRewardInput,
} from "@dewo/app/graphql/types";
import { Constants } from "@dewo/app/util/constants";
import { formatFixed, parseFixed } from "@ethersproject/bignumber";
import moment from "moment";
import { SubtaskTableRowData } from "./subtask/SubtaskTable";
import { TaskFormValues, TaskRewardFormValues } from "./types";

export const toTaskReward = (
  reward: TaskRewardFormValues | undefined
): UpdateTaskRewardInput | null => {
  if (!reward?.amount || !reward?.token) return null;
  return {
    amount: parseFixed(
      String(reward.amount),
      reward.peggedToUsd ? Constants.NUM_DECIMALS_IN_USD_PEG : reward.token.exp
    ).toString(),
    tokenId: reward.token.id,
    peggedToUsd: reward.peggedToUsd,
  };
};

export const toTaskRewardFormValues = (
  reward: TaskReward | undefined
): TaskRewardFormValues | undefined => {
  if (!reward) return undefined;
  return {
    amount: Number(
      formatFixed(
        reward.amount,
        reward.peggedToUsd
          ? Constants.NUM_DECIMALS_IN_USD_PEG
          : reward.token.exp
      )
    ),
    networkId: reward.token.networkId,
    token: reward.token,
    peggedToUsd: reward.peggedToUsd,
  };
};

export const toTaskFormValues = (
  task: TaskDetails,
  roles: RoleWithRules[]
): TaskFormValues => ({
  projectId: task.projectId!,
  name: task.name ?? "",
  description: task.description ?? undefined,
  storyPoints: task.storyPoints ?? undefined,
  tagIds: task.tags.map((t) => t.id) ?? [],
  skillIds: task.skills.map((s) => s.id) ?? [],
  assigneeIds: task.assignees.map((a) => a.id) ?? [],
  ownerIds: task.owners.map((o) => o.id) ?? [],
  status: task.status!,
  priority: task.priority ?? null,
  dueDate: !!task.dueDate ? moment(task.dueDate) : undefined,
  reward: toTaskRewardFormValues(task.rewards[0]),
  gating: task.gating,
  roleIds: roles.map((r) => r.id),
  subtasks: task.subtasks.map(
    (subtask): SubtaskTableRowData => ({
      key: subtask.id,
      name: subtask.name,
      description: subtask.description ?? undefined,
      assigneeIds: subtask.assignees.map((a) => a.id) ?? [],
      dueDate: subtask.dueDate ?? null,
      status: subtask.status,
    })
  ),
});
