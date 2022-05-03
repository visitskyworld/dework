import {
  DeleteOutlined,
  ExportOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { usePermissionFn } from "@dewo/app/contexts/PermissionsContext";
import { Task } from "@dewo/app/graphql/types";
import { eatClick } from "@dewo/app/util/eatClick";
import { Button, Dropdown, Menu, Popconfirm } from "antd";
import React, { CSSProperties, FC, useCallback } from "react";
import { useDeleteTask, useUpdateTask } from "../../hooks";

interface Props {
  task?: Task;
  style?: CSSProperties;
  onDelete(): void;
}

export const SubtaskOptionButton: FC<Props> = ({ task, style, onDelete }) => {
  const hasPermission = usePermissionFn();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const handleDelete = useCallback(async () => {
    if (!!task) await deleteTask(task.id);
    onDelete();
  }, [onDelete, deleteTask, task]);

  const menuItems = [
    !!task?.parentTaskId && hasPermission("create", task) && (
      <Popconfirm
        key="convert"
        icon={null}
        title="Convert this task to normal?"
        okText="Yes"
        onConfirm={(e) => {
          e && eatClick(e);
          updateTask({ id: task.id, parentTaskId: null });
        }}
      >
        <Menu.Item
          key="normalTask"
          children="Convert to normal task"
          icon={<ExportOutlined />}
        />
      </Popconfirm>
    ),
    (!task || hasPermission("delete", task)) && (
      <Popconfirm
        key="delete"
        icon={null}
        title="Delete this subtask?"
        okType="danger"
        okText="Delete"
        onConfirm={(e) => {
          e && eatClick(e);
          handleDelete();
        }}
      >
        <Menu.Item
          key="delete"
          icon={<DeleteOutlined />}
          danger
          children="Delete"
        />
      </Popconfirm>
    ),
  ].filter((menuItem) => !!menuItem);

  if (!menuItems.length) return null;
  return (
    <Dropdown
      key="avatar"
      placement="bottomRight"
      trigger={["click"]}
      // @ts-ignore
      onClick={eatClick}
      overlay={<Menu onClick={(e) => eatClick(e.domEvent)}>{menuItems}</Menu>}
    >
      <Button type="text" size="small" icon={<MoreOutlined />} style={style} />
    </Dropdown>
  );
};
