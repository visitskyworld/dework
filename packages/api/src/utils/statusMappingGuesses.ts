import { TaskStatus } from "../models/Task";

export const statusMappingGuesses: Record<TaskStatus, string[]> = {
  [TaskStatus.BACKLOG]: ["backlog"],
  [TaskStatus.TODO]: [
    "not started",
    "todo",
    "to-do",
    "to do",
    "sprint",
    "up for grabs",
  ],
  [TaskStatus.IN_PROGRESS]: ["progress", "doing", "claimed", "incomplete"],
  [TaskStatus.IN_REVIEW]: ["review"],
  [TaskStatus.DONE]: ["done", "complete", "finished"],
  [TaskStatus.COMMUNITY_SUGGESTIONS]: [],
};
