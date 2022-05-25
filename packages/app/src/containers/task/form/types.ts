import {
  PaymentToken,
  TaskGatingType,
  TaskPriority,
  TaskStatus,
} from "@dewo/app/graphql/types";
import { SubtaskTableRowData } from "./subtask/SubtaskTable";

export interface TaskRewardFormValues {
  amount: number;
  networkId: string;
  token: PaymentToken;
  peggedToUsd: boolean;
}

export interface TaskFormValues {
  name: string;
  description?: string;
  projectId: string;
  parentTaskId?: string;
  status: TaskStatus;
  priority: TaskPriority | null;
  dueDate?: moment.Moment;
  storyPoints?: number;
  tagIds?: string[];
  skillIds?: string[];
  gating?: TaskGatingType;
  defaultGating?: boolean;
  roleIds?: string[];
  assigneeIds: string[];
  ownerIds?: string[];
  reward?: TaskRewardFormValues;
  subtasks?: SubtaskTableRowData[];
}
