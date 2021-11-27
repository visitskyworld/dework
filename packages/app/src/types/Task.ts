export interface TaskTag {
  label: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  subtitle: string;
  tags: TaskTag[];
}
