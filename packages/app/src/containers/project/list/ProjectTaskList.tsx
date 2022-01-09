import * as Icons from "@ant-design/icons";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { Task, TaskReward, TaskStatus, User } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { Avatar, Button, Row, Table, Tag, Typography } from "antd";
import React, { FC, useMemo } from "react";
import { formatTaskReward } from "../../task/hooks";
import { TaskCreateModal } from "../../task/TaskCreateModal";
import { TaskFormValues } from "../../task/TaskForm";
import { TaskActionButton } from "../board/TaskActionButton";
import { TaskTagsRow } from "../board/TaskTagsRow";
import { STATUS_LABEL } from "../board/util";
import { useProjectTasks, useProjectTaskTags } from "../hooks";

interface Props {
  projectId: string;
}

const statuses = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

export const ProjectTaskList: FC<Props> = ({ projectId }) => {
  const tags = useProjectTaskTags(projectId);
  const tasks = useProjectTasks(projectId, "cache-and-network")?.tasks;
  const navigateToTask = useNavigateToTaskFn();

  const status = TaskStatus.TODO;
  const initialValues = useMemo<Partial<TaskFormValues>>(
    () => ({ status }),
    [status]
  );
  const createTaskToggle = useToggle();
  const canCreateTask = usePermission("create", { __typename: "Task", status });

  return (
    <Table<Task>
      dataSource={tasks}
      size="small"
      style={{ marginLeft: 24, marginRight: 24, maxWidth: 960 }}
      rowClassName="hover:cursor-pointer"
      pagination={{ hideOnSinglePage: true }}
      onRow={(t) => ({ onClick: () => navigateToTask(t.id) })}
      footer={
        canCreateTask
          ? () => (
              <Row align="middle">
                <Avatar icon={<Icons.PlusOutlined />} />
                <Button
                  type="text"
                  className="text-secondary"
                  onClick={createTaskToggle.toggleOn}
                >
                  Create task
                </Button>
                <TaskCreateModal
                  projectId={projectId}
                  initialValues={initialValues}
                  visible={createTaskToggle.isOn}
                  onCancel={createTaskToggle.toggleOff}
                  onDone={createTaskToggle.toggleOff}
                />
              </Row>
            )
          : undefined
      }
      columns={[
        {
          dataIndex: "assignees",
          width: 1,
          render: (assignees: User[]) => (
            <Avatar.Group maxCount={3}>
              {assignees.map((user) => (
                <UserAvatar key={user.id} user={user} />
              ))}
              {!assignees.length && <Avatar icon={<Icons.UserAddOutlined />} />}
            </Avatar.Group>
          ),
        },
        {
          title: "Name",
          dataIndex: "name",
          showSorterTooltip: false,
          sorter: (a: Task, b: Task) => a.name.localeCompare(b.name),
          render: (name: string) => (
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              {name}
            </Typography.Title>
          ),
        },
        {
          title: "Reward",
          dataIndex: "reward",
          width: 100,
          render: (reward: TaskReward) =>
            !!reward ? formatTaskReward(reward) : undefined,
        },
        {
          title: "Points",
          dataIndex: "storyPoints",
          width: 72,
        },
        {
          title: "Status",
          dataIndex: "status",
          width: 120,
          filters: statuses.map((status) => ({
            value: status,
            text: STATUS_LABEL[status],
          })),
          onFilter: (status, task) => task.status === status,
          render: (status: TaskStatus) => STATUS_LABEL[status],
          defaultSortOrder: "ascend",
          sorter: (a: Task, b: Task) =>
            statuses.indexOf(a.status) - statuses.indexOf(b.status),
          showSorterTooltip: false,
        },
        {
          title: "Tags",
          dataIndex: "tags",
          width: 240,
          filters: tags.map((tag) => ({
            value: tag.id,
            text: <Tag color={tag.color}>{tag.label}</Tag>,
          })),
          onFilter: (tagId, task) => task.tags.some((t) => t.id === tagId),
          render: (_, task) => (
            <TaskTagsRow task={task} showStandardTags={false} />
          ),
        },
        {
          title: "Actions",
          key: "button",
          width: 1,
          render: (_, task) => <TaskActionButton task={task} />,
        },
      ]}
    />
  );
};
