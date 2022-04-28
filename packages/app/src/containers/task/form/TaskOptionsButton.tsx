import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { Project, TaskDetails } from "@dewo/app/graphql/types";
import { eatClick } from "@dewo/app/util/eatClick";
import { Button, Dropdown, Menu, message, Popconfirm, Typography } from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback } from "react";
import { useDeleteTask, useTaskRoles, useUpdateTask } from "../hooks";
import CopyToClipboard from "react-copy-to-clipboard";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useCloseTaskDetails } from "@dewo/app/util/navigation";
import Link from "next/link";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { useOrganizationDetails } from "../../organization/hooks";
import { toTaskFormValues } from "./util";

interface Props {
  task: TaskDetails;
}

const MoveTaskSubmenu: FC<Props> = ({ task }) => {
  const { organization } = useOrganizationDetails(task.project.organization.id);
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
              <Button size="small">View</Button>
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
  const canUpdate = usePermission("update", task, "projectId");
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

  const taskRoles = useTaskRoles(task);

  const handleDuplicate = useCallback(() => {
    if (!taskRoles) return;
    router.push(
      `${task.project.permalink}/create?values=${encodeURIComponent(
        JSON.stringify(
          toTaskFormValues({ ...task, name: `${task.name} (Copy)` }, taskRoles)
        )
      )}`
    );
  }, [router, task, taskRoles]);

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
              onClick={handleDuplicate}
            />
          )}
          {canUpdate && <MoveTaskSubmenu task={task} />}
          {canDelete && (
            <Popconfirm
              icon={
                <Icons.DeleteOutlined style={{ color: Colors.grey.primary }} />
              }
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
