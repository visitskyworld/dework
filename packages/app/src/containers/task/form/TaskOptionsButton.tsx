import * as Icons from "@ant-design/icons";
import { Project, TaskDetails } from "@dewo/app/graphql/types";
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
  useUpdateTask,
} from "../hooks";
import CopyToClipboard from "react-copy-to-clipboard";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import {
  useCloseTaskDetails,
  useNavigateToTaskFn,
} from "@dewo/app/util/navigation";
import { useOrganization } from "../../organization/hooks";
import Link from "next/link";
import { RouterContext } from "next/dist/shared/lib/router-context";

interface Props {
  task: TaskDetails;
}

const MoveTaskSubmenu: FC<Props> = ({ task }) => {
  const { organization } = useOrganization(task.project.organization.id);
  const router = useRouter();
  const closeTaskDetails = useCloseTaskDetails();
  const updateTask = useUpdateTask();
  const handleMoveTask = useCallback(
    async (project: Project) => {
      await updateTask({ id: task.id, projectId: project.id });
      await closeTaskDetails();
      message.success({
        content: (
          <RouterContext.Provider value={router}>
            <Typography.Text style={{ marginRight: 16 }}>
              Task moved to {project.name}
            </Typography.Text>
            <Link href={`${project.permalink}?taskId=${task.id}`}>
              <Button type="ghost" size="small">
                View
              </Button>
            </Link>
          </RouterContext.Provider>
        ),
      });
    },
    [updateTask, closeTaskDetails, router, task.id]
  );

  if (!organization?.projects.length) return null;
  return (
    <Menu.SubMenu
      icon={
        !organization ? <Icons.LoadingOutlined /> : <Icons.ExportOutlined />
      }
      title="Move Task"
    >
      {organization?.projects
        .filter((project) => project.id !== task.project.id)
        .map((project) => (
          <Menu.Item key={project.id} onClick={() => handleMoveTask(project)}>
            {project.name}
          </Menu.Item>
        ))}
    </Menu.SubMenu>
  );
};

export const TaskOptionsButton: FC<Props> = ({ task }) => {
  const canCreate = usePermission("create", task);
  const canUpdate = usePermission("update", task);
  const canDelete = usePermission("delete", task);
  const deleteTask = useDeleteTask();
  const router = useRouter();

  const handleDeleteTask = useCallback(async () => {
    await deleteTask(task.id);
    await router.push(task.project.permalink);
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
        options: { allowOpenSubmission: task.options?.allowOpenSubmission },
        subtasks: task.subtasks.map((s, index) => ({
          key: String(index),
          name: s.name,
          status: s.status,
          assigneeIds: s.assignees.map((a) => a.id),
          dueDate: null,
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
          {canUpdate && <MoveTaskSubmenu task={task} />}
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
                danger
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
