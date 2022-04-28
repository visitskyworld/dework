export enum TodoGroup {
  assigned = "assigned",
  applied = "applied",
  work_submitted = "work_submitted",
  default = "default",
}
export const TodoGroupText = {
  [TodoGroup.assigned]: "Assigned",
  [TodoGroup.applied]: "Applied",
  [TodoGroup.work_submitted]: "Work submitted",
  [TodoGroup.default]: "Other",
};
