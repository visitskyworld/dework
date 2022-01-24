import * as Icons from "@ant-design/icons";
import { TaskDetails } from "@dewo/app/graphql/types";
import { eatClick } from "@dewo/app/util/eatClick";
import {
  Button,
  Dropdown,
  Menu,
  message,
  Popconfirm,
  Space,
  Typography,
} from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback } from "react";
import {
  toTaskRewardFormValues,
  useCreateTaskFromFormValues,
  useDeleteTask,
} from "../hooks";
import CopyToClipboard from "react-copy-to-clipboard";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";

interface Props {
  task: TaskDetails;
}

export const TaskOptionsButton: FC<Props> = ({ task }) => {
  const canDelete = usePermission("delete", task);
  const canCreate = usePermission("create", task);
  const deleteTask = useDeleteTask();
  const router = useRouter();

  const handleDeleteTask = useCallback(async () => {
    await deleteTask(task.id);
    await router.push(
      `/o/${router.query.organizationSlug}/p/${router.query.projectSlug}`
    );
  }, [deleteTask, task, router]);

  const copiedToClipboard = useCallback(
    () => message.success({ content: "Copied to clipboard" }),
    []
  );

  const navigateToTask = useNavigateToTaskFn();
  const createTask = useCreateTaskFromFormValues();
  const duplicate = useCallback(async () => {
    const duplicatedTask = await createTask(
      {
        name: task.name,
        description: task.description ?? undefined,
        parentTaskId: task.parentTaskId ?? undefined,
        storyPoints: task.storyPoints ?? undefined,
        status: task.status,
        tagIds: task.tags.map((t) => t.id),
        assigneeIds: task.assignees.map((t) => t.id),
        ownerId: task.ownerId,
        reward: toTaskRewardFormValues(task.reward ?? undefined),
        options: task.options ?? undefined,
        subtasks: task.subtasks.map((s, index) => ({
          key: String(index),
          name: s.name,
          status: s.status,
          assigneeIds: s.assignees.map((a) => a.id),
        })),
      },
      task.projectId
    );

    message.success({
      content: (
        <Space>
          <Typography.Text>Task duplicated</Typography.Text>
          <Button
            type="ghost"
            size="small"
            onClick={() => navigateToTask(duplicatedTask.id)}
          >
            View
          </Button>
        </Space>
      ),
    });
  }, [navigateToTask, createTask, task]);

  return (
    <Dropdown
      key="avatar"
      placement="bottomRight"
      trigger={["click"]}
      overlay={
        <Menu>
          <Menu.Item
            icon={<Icons.LinkOutlined />}
            children={
              <CopyToClipboard text={task.permalink} onCopy={copiedToClipboard}>
                <Typography.Text>Copy task link</Typography.Text>
              </CopyToClipboard>
            }
          />
          {canCreate && (
            <Menu.Item
              icon={<Icons.CopyOutlined />}
              children={<Typography.Text>Duplicate</Typography.Text>}
              onClick={duplicate}
            />
          )}
          {canDelete && (
            <Popconfirm
              icon={null}
              title="Delete this task?"
              okType="danger"
              okText="Delete"
              onConfirm={handleDeleteTask}
            >
              <Menu.Item
                icon={<Icons.DeleteOutlined />}
                children="Delete"
                onClick={(e) => eatClick(e.domEvent)}
              />
            </Popconfirm>
          )}
        </Menu>
      }
    >
      <Button
        type="text"
        icon={<Icons.MoreOutlined />}
        className="dewo-task-options-button"
      />
    </Dropdown>
  );
};
