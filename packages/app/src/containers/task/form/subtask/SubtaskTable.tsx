import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { eatClick, stopPropagation } from "@dewo/app/util/eatClick";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import {
  Task,
  TaskGatingType,
  TaskReward,
  TaskStatus,
  TaskTag,
  User,
} from "@dewo/app/graphql/types";
import { Avatar, DatePicker, Row, Table, Tooltip, Typography } from "antd";
import React, {
  CSSProperties,
  FC,
  useCallback,
  useMemo,
  useState,
} from "react";
import { UserSelectOption } from "@dewo/app/components/form/UserSelectOption";
import _ from "lodash";
import { DropdownSelect } from "@dewo/app/components/DropdownSelect";
import { usePermissionFn } from "@dewo/app/contexts/PermissionsContext";
import { AvatarSize } from "antd/lib/avatar/SizeContext";
import moment from "moment";
import { isSSR } from "@dewo/app/util/isSSR";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { TaskStatusIcon } from "@dewo/app/components/icons/task/TaskStatus";
import {
  formatTaskReward,
  useTaskFormUserOptions,
  useUpdateTask,
} from "../../hooks";
import { STATUS_LABEL } from "../../board/util";
import { NewSubtaskInput } from "./NewSubtaskInput";
import { TaskTagsRow } from "../../board/TaskTagsRow";
import { TaskActionButton } from "../../actions/TaskActionButton";
import { SubtaskOptionButton } from "./SubtaskOptionButton";

export interface SubtaskTableRowData {
  key: string;
  task?: Task;
  name: string;
  description: string | undefined;
  status: TaskStatus;
  dueDate: string | null;
  assigneeIds: string[];
}

interface Props {
  rows: SubtaskTableRowData[];
  tags?: TaskTag[];
  showHeader?: boolean;
  showActionButtons?: boolean;
  defaultSortByStatus?: boolean;
  projectId?: string;
  style?: CSSProperties;
  size?: AvatarSize;
  canCreateSubtask?: boolean;
  onChange?(
    changed: Partial<SubtaskTableRowData>,
    row: SubtaskTableRowData
  ): void;
  onDelete?(row: SubtaskTableRowData): void;
  onClick?(row: SubtaskTableRowData): void;
  editable?: boolean;
}

interface TableRowComponentProps extends React.HTMLAttributes<any> {
  "data-row-key": string;
  isDragDisabled?: boolean;
  index: number;
}

const statuses = [
  // TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];
const DroppableTableBody = ({ ...props }) => {
  return (
    <Droppable droppableId="sub-tasks">
      {(provided) => (
        <tbody ref={provided.innerRef} {...props} {...provided.droppableProps}>
          {props.children}
          {provided.placeholder}
        </tbody>
      )}
    </Droppable>
  );
};

const DraggableTableRow = ({
  index,
  isDragDisabled = false,
  ...props
}: TableRowComponentProps) => {
  return (
    <Draggable
      key={props["data-row-key"]}
      draggableId={props["data-row-key"]}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {(provided) => {
        return (
          <tr
            ref={provided.innerRef}
            {...props}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          ></tr>
        );
      }}
    </Draggable>
  );
};

// Drag and drop table: https://codesandbox.io/s/react-beautiful-dnd-examples-multi-drag-table-with-antd-gptbl
export const SubtaskTable: FC<Props> = ({
  rows,
  tags,
  projectId,
  showHeader = true,
  showActionButtons = false,
  defaultSortByStatus = false,
  style,
  size,
  canCreateSubtask,
  onChange,
  onDelete,
  onClick,
  editable = false,
}) => {
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
    async (
      changed: Partial<SubtaskTableRowData> & { gating?: TaskGatingType },
      prevValue: SubtaskTableRowData
    ) => {
      if (!!prevValue.task) {
        await updateTask({ id: prevValue.task.id, ...changed });
      }

      onChange?.(changed, prevValue);
    },
    [onChange, updateTask]
  );

  const [editingRow, setEditingRow] = useState<string | undefined>();

  // TODO(fant): SSRing <Table /> gets stuck
  if (isSSR) return null;
  if (!rows.length) return null;
  return (
    <Table<SubtaskTableRowData>
      dataSource={rows}
      size="small"
      style={style}
      showHeader={showHeader}
      className={size === "small" ? "dewo-table-xs" : "dewo-card-table"}
      pagination={{ hideOnSinglePage: true }}
      rowClassName={!!onClick ? "hover:cursor-pointer" : undefined}
      onRow={(t, index) => ({
        index,
        onClick: !!onClick
          ? (e) => {
              editable && setEditingRow(t.key);
              eatClick(e);
              onClick(t);
            }
          : undefined,
      })}
      components={
        canCreateSubtask
          ? {
              body: {
                wrapper: DroppableTableBody,
                row: (val: TableRowComponentProps) =>
                  DraggableTableRow({
                    ...val,
                    isDragDisabled: val["data-row-key"] === editingRow,
                  }),
              },
            }
          : undefined
      }
      columns={[
        {
          key: "status",
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
                    <TaskStatusIcon status={status} />
                    {STATUS_LABEL[status]}
                  </Row>
                ),
              }))}
              children={
                <Tooltip title={STATUS_LABEL[currentStatus]} placement="left">
                  <div
                    style={{ display: "grid", placeItems: "center", width: 24 }}
                  >
                    <TaskStatusIcon status={currentStatus} />
                  </div>
                </Tooltip>
              }
            />
          ),
          defaultSortOrder: defaultSortByStatus ? "ascend" : undefined,
          sorter: (a, b) =>
            statuses.indexOf(a.status) - statuses.indexOf(b.status),
        },
        {
          key: "name",
          title: "Name",
          dataIndex: "name",
          showSorterTooltip: false,
          sorter: (a, b) => a.name.localeCompare(b.name),
          filterIcon: <Icons.SearchOutlined />,
          className: "w-full",
          onFilter: (value, row) =>
            row.name.toLowerCase().includes((value as string).toLowerCase()),
          render: (name: string, row: SubtaskTableRowData) => {
            const isEditing = editingRow === row.key;
            if (!isEditing) {
              return size === "small" ? (
                <Typography.Paragraph style={{ padding: 8, marginBottom: 0 }}>
                  {name}
                </Typography.Paragraph>
              ) : (
                <Typography.Title level={5} style={{ marginBottom: 0 }}>
                  {name}
                </Typography.Title>
              );
            }

            return (
              <div onClick={eatClick} style={{ margin: "0 8px" }}>
                <NewSubtaskInput
                  initialValues={row}
                  placeholder="Add a title"
                  hideButton
                  autoFocus
                  onCancel={() => setEditingRow(undefined)}
                  onSubmit={(c) => {
                    onChange?.(c, row);
                    setEditingRow(undefined);
                  }}
                />
              </div>
            );
          },
        },
        {
          key: "tags",
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
          key: "dueDate",
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
          key: "assignees",
          title: "Assignees",
          dataIndex: "assigneeIds",
          width: 1,
          render: (assigneeIds: string[], row: SubtaskTableRowData) => (
            <DropdownSelect
              showSearch
              menuStyle={{ width: 280 }}
              mode="multiple"
              placement="bottomRight"
              disabled={!canChange(row.task, "assigneeIds")}
              options={users?.map((user) => ({
                value: user.id,
                label: <UserSelectOption key={user.id} user={user} />,
                data: user.username,
              }))}
              value={assigneeIds}
              onChange={(assigneeIds) =>
                handleChange(
                  { assigneeIds, gating: TaskGatingType.ASSIGNEES },
                  row
                )
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
          key: "actions",
          title: "Actions",
          width: showActionButtons ? 140 : 1,
          render: (_, row) => (
            <Row align="middle" style={{ justifyContent: "space-between" }}>
              {showActionButtons && !!row.task && (
                <TaskActionButton task={row.task} />
              )}
              <div />
              <SubtaskOptionButton
                task={row.task}
                style={showActionButtons ? undefined : { margin: -4 }}
                onDelete={() => onDelete?.(row)}
              />
            </Row>
          ),
        },
      ]}
    />
  );
};
