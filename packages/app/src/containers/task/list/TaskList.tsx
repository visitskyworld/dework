import * as Icons from "@ant-design/icons";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { TaskStatus, TaskTag, User } from "@dewo/app/graphql/types";
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
  Typography,
} from "antd";
import React, { CSSProperties, FC, useMemo } from "react";
import { useTaskFormUserOptions } from "../../task/hooks";
import { UserSelectOption } from "../form/UserSelectOption";
import { STATUS_LABEL } from "../../task/board/util";
import _ from "lodash";
import { DropdownSelect } from "@dewo/app/components/DropdownSelect";
import { TaskStatusAvatar } from "../TaskStatusAvatar";

export interface TaskListRowData {
  id?: string;
  name: string;
  status: TaskStatus;
  // assignees?: User[];
  assigneeIds?: string[];
}

interface Props {
  rows: TaskListRowData[];
  tags: TaskTag[];
  projectId?: string;
  style?: CSSProperties;
  // onAddTask(name: string): void;
  onChange(
    changed: Partial<TaskListRowData>,
    prevValue: TaskListRowData,
    index: number
  ): void;
  onDelete(value: TaskListRowData, index: number): void;
}

const statuses = [
  TaskStatus.BACKLOG,
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

  // const rows = useMemo<TaskListRowData[]>(() => {
  //   const toRowData = (task: Task) => ({
  //     name: task.name,
  //     assigneeIds: task.assignees.map((u) => u.id),
  //     status: task.status,
  //   });
  //   return tasks.map(toRowData);
  // }, [tasks]);

  const editing = true;

  const users = useTaskFormUserOptions(projectId!, []); // task.assignees);
  const userById = useMemo(() => _.keyBy(users, (u) => u.id), [users]);

  // const adding = useToggle();
  // const handleAddTask = useCallback<KeyboardEventHandler<HTMLInputElement>>(
  //   async (event) => {
  //     try {
  //       adding.toggleOn();
  //       const inputElement = event.target as HTMLInputElement;
  //       const name = inputElement.value;
  //       inputElement.blur();
  //       await onAddTask(name);
  //       inputElement.value = "";
  //     } finally {
  //       adding.toggleOff();
  //     }
  //   },
  //   [onAddTask, adding]
  // );

  // TODO(fant): SSRing <Table /> gets stuck
  if (typeof window === "undefined") return null;
  if (!rows.length) return null;
  return (
    // <Form
    //   form={form}
    //   layout="vertical"
    //   requiredMark={false}
    //   // initialValues={initialValues}
    //   onValuesChange={handleChange}
    //   onFinish={() => alert("finish sabmit")}
    // >
    <Table<TaskListRowData>
      dataSource={rows}
      size="small"
      style={style}
      showHeader={false}
      className="dewo-table-xs"
      rowClassName="hover:cursor-pointer"
      pagination={{ hideOnSinglePage: true }}
      // components={{ body: { cell: CustomCell } }}
      onRow={(t) => ({
        // onClick: !!t.id ? () => navigateToTask(t.id!) : undefined,
      })}
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
              onChange={(status) => onChange({ status }, row, index)}
              mode="default"
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
                  <Tooltip title={STATUS_LABEL[currentStatus]}>
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
          render: (name: string, row: TaskListRowData, index: number) =>
            editing ? (
              // <Form.Item
              //   name={["rows", index, "name"]}
              //   style={{ marginBottom: 0 }}
              // >
              <Input
                className="dewo-field dewo-field-focus-border"
                placeholder="Enter name..."
                defaultValue={name}
                onPressEnter={(e) => {
                  e.preventDefault();
                  onChange(
                    { name: (e.target as HTMLInputElement).value },
                    row,
                    index
                  );
                  (e.target as HTMLInputElement).blur();
                }}
              />
            ) : (
              // </Form.Item>
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                {name}
              </Typography.Title>
            ),
        },
        {
          dataIndex: "assigneeIds",
          width: 1,
          render: (
            assigneeIds: string[],
            row: TaskListRowData,
            index: number
          ) =>
            editing ? (
              // <Form.Item
              //   name={["rows", index, "assigneeIds"]}
              //   style={{ marginBottom: 0 }}
              // >
              <DropdownSelect
                mode="multiple"
                placement="bottomRight"
                options={users?.map((user) => ({
                  value: user.id,
                  label: <UserSelectOption key={user.id} user={user} />,
                }))}
                value={assigneeIds}
                onChange={(assigneeIds) =>
                  onChange({ assigneeIds }, row, index)
                }
              >
                <div>
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
            ) : // </Form.Item>
            null,
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
                  <Popconfirm
                    icon={null}
                    title="Delete this subtask?"
                    okType="danger"
                    okText="Delete"
                    onConfirm={() => onDelete(row, index)}
                  >
                    <Menu.Item
                      icon={<Icons.DeleteOutlined />}
                      danger
                      children="Delete"
                    />
                  </Popconfirm>
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
    // </Form>
  );
};
