import * as Icons from "@ant-design/icons";
import { eatClick } from "@dewo/app/util/eatClick";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import {
  Task,
  TaskReward,
  TaskStatus,
  TaskTag,
  User,
} from "@dewo/app/graphql/types";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Menu,
  Popconfirm,
  Row,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { CSSProperties, FC, useCallback, useMemo } from "react";
import {
  formatTaskReward,
  useDeleteTask,
  useTaskFormUserOptions,
  useUpdateTask,
} from "../../task/hooks";
import { UserSelectOption } from "../form/UserSelectOption";
import { STATUS_LABEL } from "../../task/board/util";
import _ from "lodash";
import { DropdownSelect } from "@dewo/app/components/DropdownSelect";
import { TaskStatusAvatar } from "../TaskStatusAvatar";
import {
  usePermission,
  usePermissionFn,
} from "@dewo/app/contexts/PermissionsContext";
import { AvatarSize } from "antd/lib/avatar/SizeContext";
import { TaskActionButton } from "../board/TaskActionButton";
import { TaskTagsRow } from "../board/TaskTagsRow";

export interface TaskListRow {
  task?: Task;
  name: string;
  status: TaskStatus;
  assigneeIds: string[];
}

interface Props {
  rows: TaskListRow[];
  tags?: TaskTag[];
  nameEditable?: boolean;
  showHeader?: boolean;
  showActionButtons?: boolean;
  defaultSortByStatus?: boolean;
  projectId?: string;
  style?: CSSProperties;
  size?: AvatarSize;
  onChange?(
    changed: Partial<TaskListRow>,
    row: TaskListRow,
    index: number
  ): void;
  onDelete?(row: TaskListRow, index: number): void;
  onClick?(row: TaskListRow): void;
}

const statuses = [
  // TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

// Drag and drop table: https://codesandbox.io/s/react-beautiful-dnd-examples-multi-drag-table-with-antd-gptbl
export const TaskList: FC<Props> = ({
  rows,
  tags,
  projectId,
  nameEditable = true,
  showHeader = true,
  showActionButtons = false,
  defaultSortByStatus = false,
  style,
  size,
  onChange,
  onDelete,
  onClick,
}) => {
  const navigateToTask = useNavigateToTaskFn();

  const canDeleteTask = usePermission("delete", "Task");
  const hasPermission = usePermissionFn();
  const canChange = useCallback(
    (task: Task | undefined, field: keyof Task | `status[${TaskStatus}]`) => {
      if (!!task) {
        return hasPermission("update", task, field);
      } else {
        return hasPermission("create", "Task", field);
      }
    },
    [hasPermission]
  );

  const existingAssignees = useMemo(
    () =>
      _(rows)
        .map((r) => r.task?.assignees ?? [])
        .flatten()
        .uniqBy((u) => u.id)
        .value(),
    [rows]
  );
  const users = useTaskFormUserOptions(projectId!, existingAssignees);
  const userById = useMemo(() => _.keyBy(users, (u) => u.id), [users]);

  const updateTask = useUpdateTask();
  const handleChange = useCallback(
    async (
      changed: Partial<TaskListRow>,
      prevValue: TaskListRow,
      index: number
    ) => {
      if (!!prevValue.task) {
        await updateTask({ id: prevValue.task.id, ...changed });
      }

      onChange?.(changed, prevValue, index);
    },
    [onChange, updateTask]
  );

  const deleteTask = useDeleteTask();
  const handleDelete = useCallback(
    async (value: TaskListRow, index: number) => {
      if (!!value.task) await deleteTask(value.task.id);
      onDelete?.(value, index);
    },
    [onDelete, deleteTask]
  );

  // TODO(fant): SSRing <Table /> gets stuck
  if (typeof window === "undefined") return null;
  if (!rows.length) return null;
  return (
    <Table<TaskListRow>
      dataSource={rows}
      size="small"
      style={style}
      showHeader={showHeader}
      className={size === "small" ? "dewo-table-xs" : undefined}
      pagination={{ hideOnSinglePage: true }}
      rowClassName={!!onClick ? "hover:cursor-pointer" : undefined}
      onRow={(t) => ({
        onClick: !!onClick ? () => onClick(t) : undefined,
      })}
      columns={[
        {
          dataIndex: "status",
          width: 1,
          render: (currentStatus: TaskStatus, row, index) => (
            <DropdownSelect
              value={currentStatus}
              mode="default"
              disabled={!canChange(row.task, "status")}
              onChange={(status) => handleChange({ status }, row, index)}
              options={statuses.map((status) => ({
                value: status,
                label: (
                  <Row style={{ gap: 8 }}>
                    <TaskStatusAvatar size={20} status={status} />
                    {STATUS_LABEL[status]}
                  </Row>
                ),
              }))}
              children={
                <div>
                  <Tooltip title={STATUS_LABEL[currentStatus]} placement="left">
                    <TaskStatusAvatar size={size} status={currentStatus} />
                  </Tooltip>
                </div>
              }
            />
          ),

          filters: statuses.map((status) => ({
            value: status,
            text: STATUS_LABEL[status],
          })),
          onFilter: (status, task) => task.status === status,
          defaultSortOrder: defaultSortByStatus ? "ascend" : undefined,
          sorter: (a, b) =>
            statuses.indexOf(a.status) - statuses.indexOf(b.status),
          showSorterTooltip: false,
        },
        {
          title: "Name",
          dataIndex: "name",
          showSorterTooltip: false,
          sorter: (a, b) => a.name.localeCompare(b.name),
          render: (name: string, row: TaskListRow, index: number) =>
            nameEditable ? (
              <Input.TextArea
                autoSize
                className="dewo-field dewo-field-focus-border"
                style={{ paddingTop: 4 }}
                placeholder="Enter name..."
                disabled={!canChange(row.task, "name") || !nameEditable}
                defaultValue={name}
                onPressEnter={(e) => {
                  e.preventDefault();
                  handleChange(
                    { name: (e.target as HTMLInputElement).value },
                    row,
                    index
                  );
                  (e.target as HTMLInputElement).blur();
                }}
              />
            ) : (
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                {name}
              </Typography.Title>
            ),
        },
        {
          title: "Tags",
          dataIndex: ["task", "tags"],
          width: !!tags ? undefined : 1,
          filters: tags?.map((tag) => ({
            value: tag.id,
            text: <Tag color={tag.color}>{tag.label}</Tag>,
          })),
          onFilter: (tagId, row) =>
            !!row.task?.tags.some((t) => t.id === tagId),
          render: (_, row) =>
            !!row.task && (
              <TaskTagsRow task={row.task} showStandardTags={false} />
            ),
        },
        { title: "Points", dataIndex: ["task", "storyPoints"], width: 1 },
        {
          title: "Reward",
          dataIndex: ["task", "reward"],
          render: (reward: TaskReward) =>
            !!reward ? formatTaskReward(reward) : undefined,
        },
        {
          title: "Assignees",
          dataIndex: "assigneeIds",
          width: 1,
          render: (assigneeIds: string[], row: TaskListRow, index: number) => (
            <DropdownSelect
              mode="multiple"
              placement="bottomRight"
              disabled={!canChange(row.task, "assignees")}
              options={users?.map((user) => ({
                value: user.id,
                label: <UserSelectOption key={user.id} user={user} />,
              }))}
              value={assigneeIds}
              onChange={(assigneeIds) =>
                handleChange({ assigneeIds }, row, index)
              }
            >
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Avatar.Group maxCount={3} size={size}>
                  {assigneeIds
                    .map((id) => userById[id])
                    .filter((u): u is User => !!u)
                    .map((user) => (
                      <UserAvatar key={user.id} user={user} />
                    ))}
                  {!assigneeIds.length && (
                    <Avatar icon={<Icons.UserAddOutlined />} />
                  )}
                </Avatar.Group>
              </div>
            </DropdownSelect>
          ),
        },
        {
          title: "Actions",
          key: "actions",
          width: showActionButtons ? 120 : 1,
          render: (_, row, index) => (
            <Row align="middle" style={{ justifyContent: "space-between" }}>
              {showActionButtons && !!row.task && (
                <TaskActionButton task={row.task} />
              )}
              <div />
              <Dropdown
                key="avatar"
                placement="bottomRight"
                trigger={["click"]}
                // @ts-ignore
                onClick={eatClick}
                overlay={
                  <Menu onClick={(e) => eatClick(e.domEvent)}>
                    {!!row.task && (
                      <Menu.Item
                        key="details"
                        icon={<Icons.BarsOutlined />}
                        children="Details"
                        onClick={() => navigateToTask(row.task!.id)}
                      />
                    )}

                    {!!canDeleteTask && (
                      <Popconfirm
                        icon={null}
                        title="Delete this subtask?"
                        okType="danger"
                        okText="Delete"
                        onConfirm={() => handleDelete(row, index)}
                      >
                        <Menu.Item
                          key="delete"
                          icon={<Icons.DeleteOutlined />}
                          danger
                          children="Delete"
                        />
                      </Popconfirm>
                    )}
                  </Menu>
                }
              >
                <Button
                  type="text"
                  size="small"
                  icon={<Icons.MoreOutlined />}
                  style={showActionButtons ? undefined : { margin: -8 }}
                />
              </Dropdown>
            </Row>
          ),
        },
      ]}
    />
  );
};
