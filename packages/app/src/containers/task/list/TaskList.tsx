import * as Icons from "@ant-design/icons";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { TaskStatus, TaskTag, User } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { Avatar, Input, Row, Table, Tooltip, Typography } from "antd";
import React, {
  CSSProperties,
  FC,
  useCallback,
  useMemo,
  useState,
} from "react";
import { TaskFormValues } from "../../task/form/TaskForm";
import { useTaskFormUserOptions } from "../../task/hooks";
import { UserSelectOption } from "../form/UserSelectOption";
import { STATUS_LABEL } from "../../task/board/util";
import { useForm } from "antd/lib/form/Form";
import _ from "lodash";
import { DropdownSelect } from "@dewo/app/components/DropdownSelect";
import { TaskStatusAvatar } from "../TaskStatusAvatar";
import { eatClick } from "@dewo/app/util/eatClick";

export interface TaskListRowData {
  id?: string;
  name: string;
  status: TaskStatus;
  // assignees?: User[];
  assigneeIds?: string[];
}

interface FormValues {
  rows: TaskListRowData[];
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
  tags,
  projectId,
  style,
  onChange,
  // onAddTask,
}) => {
  const navigateToTask = useNavigateToTaskFn();

  const status = TaskStatus.TODO;
  const initialValues = useMemo<Partial<TaskFormValues>>(
    () => ({ status }),
    [status]
  );
  const createTaskToggle = useToggle();
  const canCreateTask = usePermission("create", { __typename: "Task", status });

  // const rows = useMemo<TaskListRowData[]>(() => {
  //   const toRowData = (task: Task) => ({
  //     name: task.name,
  //     assigneeIds: task.assignees.map((u) => u.id),
  //     status: task.status,
  //   });
  //   return tasks.map(toRowData);
  // }, [tasks]);

  const editing = true;

  const [form] = useForm<FormValues>();
  const [values, setValues] = useState<FormValues>({ rows });
  const handleChange = useCallback(
    (changed: Partial<FormValues>, newValues: FormValues) => {
      console.log("handle cheng", changed);
      if (!!changed.rows) {
        newValues.rows[0] = { ...values.rows[0], ...changed.rows[0] };
      }
      console.log({ changed, newValues });
      setValues(newValues);
      form.setFieldsValue(newValues);
    },
    [form, values]
  );

  const users = useTaskFormUserOptions(projectId!, []); // task.assignees);
  const userById = useMemo(() => _.keyBy(users, (u) => u.id), [users]);

  const handleNameSubmit = useCallback(
    (e) => {
      eatClick(e);
      form.submit();
    },
    [form]
  );

  console.log("rendar", rows);

  const adding = useToggle();
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
        onClick: !!t.id ? () => navigateToTask(t.id!) : undefined,
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
      ]}
    />
    // </Form>
  );
};
