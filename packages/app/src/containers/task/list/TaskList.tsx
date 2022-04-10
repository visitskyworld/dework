import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { eatClick, stopPropagation } from "@dewo/app/util/eatClick";
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
  DatePicker,
  Dropdown,
  Input,
  Menu,
  Popconfirm,
  Row,
  Table,
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
import { UserSelectOption } from "@dewo/app/components/form/UserSelectOption";
import { STATUS_LABEL } from "../../task/board/util";
import _ from "lodash";
import { DropdownSelect } from "@dewo/app/components/DropdownSelect";
import { TaskStatusAvatar } from "../TaskStatusAvatar";
import {
  usePermission,
  usePermissionFn,
} from "@dewo/app/contexts/PermissionsContext";
import { AvatarSize } from "antd/lib/avatar/SizeContext";
import { TaskActionButton } from "../actions/TaskActionButton";
import { TaskTagsRow } from "../board/TaskTagsRow";
import moment from "moment";
import { isSSR } from "@dewo/app/util/isSSR";

export interface TaskListRow {
  key: string;
  task?: Task;
  name: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
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
  onChange?(changed: Partial<TaskListRow>, row: TaskListRow): void;
  onDelete?(row: TaskListRow): void;
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
    (
      task: Task | undefined,
      field: keyof Task | `status[${TaskStatus}]` | "assigneeIds"
    ) => {
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
    async (changed: Partial<TaskListRow>, prevValue: TaskListRow) => {
      if (!!prevValue.task) {
        await updateTask({ id: prevValue.task.id, ...changed });
      }

      onChange?.(changed, prevValue);
    },
    [onChange, updateTask]
  );

  const deleteTask = useDeleteTask();
  const handleDelete = useCallback(
    async (value: TaskListRow) => {
      if (!!value.task) await deleteTask(value.task.id);
      onDelete?.(value);
    },
    [onDelete, deleteTask]
  );

  // TODO(fant): SSRing <Table /> gets stuck
  if (isSSR) return null;
  if (!rows.length) return null;
  return (
    <Table<TaskListRow>
      dataSource={rows}
      size="small"
      style={style}
      showHeader={showHeader}
      className={size === "small" ? "dewo-table-xs" : "dewo-card-table"}
      pagination={{ hideOnSinglePage: true }}
      rowClassName={!!onClick ? "hover:cursor-pointer" : undefined}
      onRow={(t) => ({
        onClick: !!onClick ? () => onClick(t) : undefined,
      })}
      columns={[
        {
          dataIndex: "status",
          width: 1,
          render: (currentStatus: TaskStatus, row) => (
            <DropdownSelect
              value={currentStatus}
              mode="default"
              disabled={!canChange(row.task, "status")}
              onChange={(status) => handleChange({ status }, row)}
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
          defaultSortOrder: defaultSortByStatus ? "ascend" : undefined,
          sorter: (a, b) =>
            statuses.indexOf(a.status) - statuses.indexOf(b.status),
        },
        {
          title: "Name",
          dataIndex: "name",
          showSorterTooltip: false,
          sorter: (a, b) => a.name.localeCompare(b.name),
          filterIcon: <Icons.SearchOutlined />,
          onFilter: (value, row) =>
            row.name.toLowerCase().includes((value as string).toLowerCase()),
          render: (name: string, row: TaskListRow) =>
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
                    row
                  );
                  (e.target as HTMLInputElement).blur();
                }}
              />
            ) : size === "small" ? (
              <Typography.Paragraph style={{ padding: 8, marginBottom: 0 }}>
                {name}
              </Typography.Paragraph>
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
          render: (_, row) =>
            !!row.task && (
              <TaskTagsRow task={row.task} showStandardTags={false} />
            ),
        },
        { title: "Points", dataIndex: ["task", "storyPoints"], width: 1 },
        {
          title: "Reward",
          dataIndex: ["task", "reward"],
          render: (reward: TaskReward | undefined) =>
            !!reward && (
              <Typography.Text style={{ whiteSpace: "nowrap" }}>
                {formatTaskReward(reward)}
              </Typography.Text>
            ),
        },
        {
          title: "Due",
          dataIndex: "dueDate",
          width: 82,
          render: (dueDate: string | undefined, row) => (
            <div onClick={stopPropagation}>
              <DatePicker
                bordered={false}
                format="D MMM"
                value={!!dueDate ? moment(dueDate) : undefined}
                placeholder=""
                disabled={!canChange(row.task, "dueDate")}
                style={{ padding: 0 }}
                onChange={(dueDate) =>
                  handleChange({ dueDate: dueDate?.toISOString() ?? null }, row)
                }
                suffixIcon={
                  row.status !== TaskStatus.DONE &&
                  !!dueDate &&
                  moment().endOf("day").isAfter(dueDate) ? (
                    <Icons.ExclamationCircleFilled
                      style={{ color: Colors.red.primary, marginLeft: 4 }}
                    />
                  ) : (
                    <Icons.CalendarOutlined />
                  )
                }
              />
            </div>
          ),
        },
        {
          title: "Assignees",
          dataIndex: "assigneeIds",
          width: 1,
          render: (assigneeIds: string[], row: TaskListRow) => (
            <DropdownSelect
              mode="multiple"
              placement="bottomRight"
              disabled={!canChange(row.task, "assigneeIds")}
              options={users?.map((user) => ({
                value: user.id,
                label: <UserSelectOption key={user.id} user={user} />,
              }))}
              value={assigneeIds}
              onChange={(assigneeIds) => handleChange({ assigneeIds }, row)}
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
          width: showActionButtons ? 140 : 1,
          render: (_, row) => (
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
                    {!!row.task && !onClick && (
                      <Menu.Item
                        key="details"
                        icon={<Icons.BarsOutlined />}
                        children="Details"
                        onClick={() => navigateToTask(row.task!.id)}
                      />
                    )}

                    {!!canChange && !!row.task?.parentTaskId && (
                      <Popconfirm
                        icon={null}
                        title="Convert this task to normal?"
                        okText="Yes"
                        onConfirm={(e) => {
                          e && eatClick(e);
                          updateTask({ id: row.task!.id, parentTaskId: null });
                        }}
                      >
                        <Menu.Item
                          key="normalTask"
                          children="Convert to normal task"
                          icon={<Icons.ExportOutlined />}
                        />
                      </Popconfirm>
                    )}

                    {!!canDeleteTask && (
                      <Popconfirm
                        icon={null}
                        title="Delete this subtask?"
                        okType="danger"
                        okText="Delete"
                        onConfirm={(e) => {
                          e && eatClick(e);
                          handleDelete(row);
                        }}
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
                  style={showActionButtons ? undefined : { margin: -4 }}
                />
              </Dropdown>
            </Row>
          ),
        },
      ]}
    />
  );
};
