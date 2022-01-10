import * as Icons from "@ant-design/icons";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import {
  Task,
  TaskReward,
  TaskStatus,
  TaskTag,
  User,
} from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { Avatar, Button, Row, Table, Tag, Typography } from "antd";
import React, { CSSProperties, FC, useMemo } from "react";
import { formatTaskReward } from "../../task/hooks";
import { TaskCreateModal } from "../../task/TaskCreateModal";
import { TaskFormValues } from "../../task/form/TaskForm";
import { TaskActionButton } from "../../task/board/TaskActionButton";
import { TaskTagsRow } from "../../task/board/TaskTagsRow";
import { STATUS_LABEL } from "../../task/board/util";
import { AtLeast } from "@dewo/app/types/general";

type RowData = AtLeast<Task, "name" | "status" | "assignees">;

interface Props {
  tasks: Task[];
  tags: TaskTag[];
  projectId?: string;
  style?: CSSProperties;
}

const statuses = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

export const TaskList: FC<Props> = ({ tasks, tags, projectId, style }) => {
  const navigateToTask = useNavigateToTaskFn();

  const status = TaskStatus.TODO;
  const initialValues = useMemo<Partial<TaskFormValues>>(
    () => ({ status }),
    [status]
  );
  const createTaskToggle = useToggle();
  const canCreateTask = usePermission("create", { __typename: "Task", status });

  const data = useMemo<RowData[]>(() => {
    if (!canCreateTask) return tasks;
    return [...tasks, { name: "", assignees: [], status: TaskStatus.TODO }];
  }, [canCreateTask, tasks]);

  // TODO(fant): SSRing <Table /> gets stuck
  if (typeof window === "undefined") return null;
  return (
    <Table<RowData>
      dataSource={data}
      size="small"
      style={style}
      rowClassName="hover:cursor-pointer"
      pagination={{ hideOnSinglePage: true }}
      onRow={(t) => ({
        onClick: !!t.id ? () => navigateToTask(t.id!) : undefined,
      })}
      footer={
        canCreateTask && projectId
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
          sorter: (a, b) => a.name.localeCompare(b.name),
          render: (name: string) => (
            <Typography.Title
              level={5}
              style={{ marginBottom: 0 }}
              editable={{ onChange: () => alert("cheng") }}
            >
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
        { title: "Points", dataIndex: "storyPoints", width: 72 },
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
          sorter: (a, b) =>
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
          onFilter: (tagId, task) => !!task.tags?.some((t) => t.id === tagId),
          render: (_, task) =>
            !!task.id && (
              <TaskTagsRow task={task as any} showStandardTags={false} />
            ),
        },
        {
          title: "Actions",
          key: "button",
          width: 1,
          render: (_, task) =>
            !!task.id && <TaskActionButton task={task as any} />,
        },
      ]}
    />
  );
};
