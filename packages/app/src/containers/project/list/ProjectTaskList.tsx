import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { Button } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import { useProject, useProjectTasks, useProjectTaskTags } from "../hooks";
import { TaskList, TaskListRow } from "../../task/list/TaskList";
import * as Icons from "@ant-design/icons";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { TaskCreateModal } from "../../task/TaskCreateModal";
import { TaskStatus } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { useFilteredTasks } from "../../task/board/filters/FilterContext";

interface Props {
  projectId?: string;
}

export const ProjectTaskList: FC<Props> = ({ projectId }) => {
  const tags = useProjectTaskTags(projectId);
  const tasks = useProjectTasks(projectId, "cache-and-network");
  const { project } = useProject(projectId);
  const filteredTasks = useFilteredTasks(
    useMemo(() => tasks ?? [], [tasks]),
    project?.organizationId
  );
  const rows = useMemo(
    () =>
      filteredTasks.map(
        (task): TaskListRow => ({
          task,
          key: task.id,
          assigneeIds: task.assignees.map((u) => u.id),
          name: task.name,
          status: task.status,
          dueDate: task.dueDate,
        })
      ),
    [filteredTasks]
  );

  const canCreateTask = usePermission("create", {
    __typename: "Task",
    projectId,
    status: TaskStatus.TODO,
  });
  const createTaskToggle = useToggle();

  const navigateToTask = useNavigateToTaskFn();
  const handleClick = useCallback(
    (row: TaskListRow) => !!row.task && navigateToTask(row.task.id),
    [navigateToTask]
  );

  if (!tasks) return null;
  return (
    <>
      <TaskList
        rows={rows}
        tags={tags}
        nameEditable={false}
        showActionButtons={true}
        defaultSortByStatus={true}
        projectId={projectId}
        style={{
          marginLeft: 0,
          marginRight: 0,
          minWidth: 480,
          maxWidth: 960,
          width: "100%",
          alignSelf: "stretch",
        }}
        onClick={handleClick}
      />
      {canCreateTask && projectId && (
        <>
          <Button
            icon={<Icons.PlusOutlined />}
            type="ghost"
            style={{ marginTop: 8 }}
            onClick={createTaskToggle.toggleOn}
          >
            Add task
          </Button>
          <TaskCreateModal
            projectId={projectId}
            initialValues={{ status: TaskStatus.TODO }}
            visible={createTaskToggle.isOn}
            onCancel={createTaskToggle.toggleOff}
            onDone={createTaskToggle.toggleOff}
          />
        </>
      )}
    </>
  );
};
