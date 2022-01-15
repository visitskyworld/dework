import * as Icons from "@ant-design/icons";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { Task, TaskStatus, TaskTag, User } from "@dewo/app/graphql/types";
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
  Tooltip,
} from "antd";
import React, { CSSProperties, FC, useCallback, useMemo } from "react";
import {
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

export interface TaskListRow {
  task?: Task;
  name: string;
  status: TaskStatus;
  assigneeIds: string[];
}

interface Props {
  rows: TaskListRow[];
  tags: TaskTag[];
  projectId?: string;
  style?: CSSProperties;
  // onAddTask(name: string): void;
  onChange?(
    changed: Partial<TaskListRow>,
    prevValue: TaskListRow,
    index: number
  ): void;
  onDelete?(value: TaskListRow, index: number): void;
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
  // tags,
  projectId,
  style,
  onChange,
  onDelete,
  // onAddTask,
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
      showHeader={false}
      className="dewo-table-xs"
      pagination={{ hideOnSinglePage: true }}
      // components={{ body: { cell: CustomCell } }}
      // onRow={(t) => ({
      // onClick: !!t.id ? () => navigateToTask(t.id!) : undefined,
      // })}
      // footer={() => (
      //   <Row align="middle" style={{ gap: 16 }}>
      //     <Button
      //       icon={<Icons.PlusOutlined />}
      //       shape="circle"
      //       size="small"
      //       type="ghost"
      //       loading={adding.isOn}
      //     />
      //     <Input
      //       className="dewo-field dewo-field-focus-border"
      //       style={{ flex: 1 }}
      //       placeholder="Add subtask..."
      //       disabled={adding.isOn}
      //       onPressEnter={handleAddTask}
      //     />
      //   </Row>
      // )}
      columns={[
        {
          dataIndex: "status",
          // width: 120,
          width: 1,
          // render: (status: TaskStatus) => STATUS_LABEL[status],
          render: (currentStatus: TaskStatus, row, index) => (
            // <Form.Item name={["rows", 0, "status"]} style={{ marginBottom: 0 }}>
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
              // children={<div>{STATUS_ICON[currentStatus]}</div>}
              children={
                <div>
                  <Tooltip title={STATUS_LABEL[currentStatus]} placement="left">
                    <TaskStatusAvatar size="small" status={currentStatus} />
                  </Tooltip>
                </div>
              }
            />
            // </Form.Item>
          ),
        },
        {
          title: "Name",
          dataIndex: "name",
          showSorterTooltip: false,
          sorter: (a, b) => a.name.localeCompare(b.name),
          render: (name: string, row: TaskListRow, index: number) => (
            // editing ? (
            <Input.TextArea
              autoSize
              className="dewo-field dewo-field-focus-border"
              style={{ paddingTop: 4 }}
              placeholder="Enter name..."
              disabled={!canChange(row.task, "name")}
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
          ),
          // ) : (
          //   <Typography.Title level={5} style={{ marginBottom: 0 }}>
          //     {name}
          //   </Typography.Title>
          // ),
        },
        {
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
                <Avatar.Group
                  maxCount={3}
                  size="small"
                  style={{ pointerEvents: "none" }}
                >
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
          /*
                <Avatar.Group maxCount={3}>
                  {assignees.map((user) => (
                    <UserAvatar key={user.id} user={user} />
                  ))}
                  {!assignees.length && (
                    <Avatar icon={<Icons.UserAddOutlined />} />
                  )}
                </Avatar.Group>
                */
          // {
          //   title: "Reward",
          //   dataIndex: "reward",
          //   width: 100,
          //   render: (reward: TaskReward) =>
          //     !!reward ? formatTaskReward(reward) : undefined,
          // },
          // { title: "Points", dataIndex: "storyPoints", width: 72 },

          // filters: statuses.map((status) => ({
          //   value: status,
          //   text: STATUS_LABEL[status],
          // })),
          // onFilter: (status, task) => task.status === status,
          // defaultSortOrder: "ascend",
          // sorter: (a, b) =>
          //   statuses.indexOf(a.status) - statuses.indexOf(b.status),
          // showSorterTooltip: false,
        },
        // {
        //   title: "Tags",
        //   dataIndex: "tags",
        //   width: 240,
        //   filters: tags.map((tag) => ({
        //     value: tag.id,
        //     text: <Tag color={tag.color}>{tag.label}</Tag>,
        //   })),
        //   onFilter: (tagId, task) => !!task.tags?.some((t) => t.id === tagId),
        //   render: (_, task) =>
        //     !!task.id && (
        //       <TaskTagsRow task={task as any} showStandardTags={false} />
        //     ),
        // },
        // {
        //   title: "Actions",
        //   key: "button",
        //   width: 1,
        //   render: (_, task) =>
        //     !!task.id && <TaskActionButton task={task as any} />,
        // },
        {
          key: "actions",
          width: 1,
          render: (_, row, index) => (
            <Dropdown
              key="avatar"
              placement="bottomRight"
              trigger={["click"]}
              overlay={
                <Menu>
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
                style={{ margin: -8 }}
              />
            </Dropdown>
          ),
        },
      ]}
    />
  );
};
