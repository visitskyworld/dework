export interface User {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface TaskTag {
  label: string;
  color: string;
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export interface Task {
  id: string;
  title: string;
  subtitle: string;
  sortKey: string;
  tags: TaskTag[];
  status: TaskStatus;
  assignee?: User;
}
