import * as Icons from "@ant-design/icons";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { Task, TaskStatus, TaskTag, User } from "@dewo/app/graphql/types";
import * as Colors from "@ant-design/colors";
import { useToggle } from "@dewo/app/util/hooks";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import {
  Avatar,
  Dropdown,
  Form,
  Input,
  Menu,
  Row,
  Table,
  Typography,
} from "antd";
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

interface RowData {
  id?: string;
  name: string;
  status: TaskStatus;
  assigneeIds: string[];
}

interface FormValues {
  rows: RowData[];
}

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

const AssigneePicker: FC<{
  projectId: string;
  value?: string[];
  onChange?(value: string[]): void;
}> = ({ projectId, value: assigneeIds = [], onChange }) => {
  const users = useTaskFormUserOptions(projectId, []);
  const userById = useMemo(() => _.keyBy(users, (u) => u.id), [users]);
  const assignees = useMemo(
    () => assigneeIds.map((id) => userById[id]).filter((u): u is User => !!u),
    [userById, assigneeIds]
  );

  return (
    <Dropdown
      placement="bottomRight"
      trigger={["click"]}
      overlay={
        <Menu>
          {users?.map((user) => {
            const selected = !!assigneeIds.includes(user.id);
            return (
              <Menu.Item
                key={user.id}
                className={
                  selected ? "ant-select-item-option-selected" : undefined
                }
                onClick={() =>
                  selected
                    ? onChange?.(assigneeIds.filter((id) => id !== user.id))
                    : onChange?.([...assigneeIds, user.id])
                }
              >
                <UserSelectOption user={user} />
              </Menu.Item>
            );
          })}
        </Menu>
      }
    >
      <div>
        <Avatar.Group
          maxCount={3}
          size="small"
          style={{ pointerEvents: "none" }}
        >
          {assignees.map((user) => (
            <UserAvatar key={user.id} user={user} />
          ))}
          {!assignees.length && <Avatar icon={<Icons.UserAddOutlined />} />}
        </Avatar.Group>
      </div>
    </Dropdown>
  );
};

/*
const CustomCell: React.FC<any> = ({
  // editing,
  // dataIndex,
  // title,
  // inputType,
  // record,
  // index,
  // children,
  // ...restProps
  ...props
}) => {
  console.log(props);
  const inputNode = props.inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...props}>
      {props.editing ? (
        <Form.Item
          name={props.dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${props.title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        props.children
      )}
    </td>
  );
};
*/

// Drag and drop table: https://codesandbox.io/s/react-beautiful-dnd-examples-multi-drag-table-with-antd-gptbl
export const TaskList: FC<Props> = ({ tasks, tags, projectId, style }) => {
  const navigateToTask = useNavigateToTaskFn();

  const status = TaskStatus.TODO;
  const initialValues = useMemo<Partial<TaskFormValues>>(
    () => ({ status }),
    [status]
  );
  const createTaskToggle = useToggle();
  const canCreateTask = usePermission("create", { __typename: "Task", status });

  const rows = useMemo<RowData[]>(() => {
    const toRowData = (task: Task) => ({
      name: task.name,
      assigneeIds: task.assignees.map((u) => u.id),
      status: task.status,
    });
    if (!canCreateTask) return tasks.map(toRowData);
    return [
      ...tasks.map(toRowData),
      { name: "", assigneeIds: [], status: TaskStatus.TODO },
    ];
  }, [canCreateTask, tasks]);

  const editing = true;

  const [form] = useForm<FormValues>();
  const [values, setValues] = useState<FormValues>({ rows });
  const handleChange = useCallback(
    (changed: Partial<FormValues>, newValues: FormValues) => {
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

  console.log(values, Colors.green);
  // TODO(fant): SSRing <Table /> gets stuck
  if (typeof window === "undefined") return null;
  if (!values.rows.length) return null;
  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      // initialValues={initialValues}
      onValuesChange={handleChange}
      onFinish={() => alert("finish sabmit")}
    >
      <Table<RowData>
        dataSource={values.rows}
        size="small"
        style={style}
        showHeader={false}
        rowClassName="hover:cursor-pointer"
        pagination={{ hideOnSinglePage: true }}
        // components={{ body: { cell: CustomCell } }}
        onRow={(t) => ({
          onClick: !!t.id ? () => navigateToTask(t.id!) : undefined,
        })}
        // footer={
        //   canCreateTask && projectId
        //     ? () => (
        //         <Row align="middle">
        //           <Avatar icon={<Icons.PlusOutlined />} />
        //           <Button
        //             type="text"
        //             className="text-secondary"
        //             onClick={createTaskToggle.toggleOn}
        //           >
        //             Create task
        //           </Button>
        //           <TaskCreateModal
        //             projectId={projectId}
        //             initialValues={initialValues}
        //             visible={createTaskToggle.isOn}
        //             onCancel={createTaskToggle.toggleOff}
        //             onDone={createTaskToggle.toggleOff}
        //           />
        //         </Row>
        //       )
        //     : undefined
        // }
        columns={[
          {
            dataIndex: "status",
            // width: 120,
            width: 1,
            // render: (status: TaskStatus) => STATUS_LABEL[status],
            render: (currentStatus: TaskStatus) => (
              <Form.Item
                name={["rows", 0, "status"]}
                style={{ marginBottom: 0 }}
              >
                <DropdownSelect
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
                      <TaskStatusAvatar size="small" status={currentStatus} />
                    </div>
                  }
                />
              </Form.Item>
            ),
          },
          {
            title: "Name",
            dataIndex: "name",
            showSorterTooltip: false,
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (name: string, _row: RowData, index: number) =>
              editing ? (
                <Form.Item
                  name={["rows", index, "name"]}
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    className="dewo-field dewo-field-focus-border"
                    placeholder="Add subtask..."
                    onPressEnter={() => alert("enter")}
                  />
                </Form.Item>
              ) : (
                <Typography.Title level={5} style={{ marginBottom: 0 }}>
                  {name}
                </Typography.Title>
              ),
          },
          {
            dataIndex: "assigneeIds",
            width: 1,
            render: (assigneeIds: string[], _row: RowData, index: number) =>
              editing ? (
                <Form.Item
                  name={["rows", index, "assigneeIds"]}
                  style={{ marginBottom: 0 }}
                >
                  {/* <AssigneePicker projectId={projectId!} /> */}
                  <DropdownSelect
                    mode="multiple"
                    options={users?.map((user) => ({
                      value: user.id,
                      label: <UserSelectOption key={user.id} user={user} />,
                    }))}
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
                </Form.Item>
              ) : null,
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
    </Form>
  );
};
