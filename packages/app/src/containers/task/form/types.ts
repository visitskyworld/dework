import {
  PaymentToken,
  TaskGatingType,
  TaskRewardTrigger,
  TaskStatus,
} from "@dewo/app/graphql/types";
import { TaskListRow } from "../list/TaskList";

export interface TaskRewardFormValues {
  amount: number;
  networkId: string;
  token: PaymentToken;
  trigger: TaskRewardTrigger;
}

export interface TaskFormValues {
  name: string;
  description?: string;
  projectId: string;
  parentTaskId?: string;
  status: TaskStatus;
  dueDate?: moment.Moment;
  storyPoints?: number;
  tagIds?: string[];
  gating?: TaskGatingType;
  defaultGating?: boolean;
  roleIds?: string[];
  assigneeIds: string[];
  ownerIds?: string[];
  reward?: TaskRewardFormValues;
  subtasks?: TaskListRow[];
}
