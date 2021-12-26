import { ProjectDetails, User } from "@dewo/app/graphql/types";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Menu,
  Progress,
  Row,
  Tag,
  Typography,
} from "antd";
import React, { FC, useCallback } from "react";
import Link from "next/link";
import * as Icons from "@ant-design/icons";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useOrganization } from "../hooks";
import { Can } from "@dewo/app/contexts/PermissionsContext";
import { useUpdateProject } from "../../project/hooks";

interface Props {
  project: ProjectDetails;
  // TODO(fant): get this from the project instead of from the org through a prop
  users: User[];
}

export const ProjectCard: FC<Props> = ({ project, users }) => {
  const organization = useOrganization(project.organizationId);

  const updateProject = useUpdateProject();
  const deleteProject = useCallback(
    () =>
      updateProject({ id: project.id, deletedAt: new Date().toISOString() }),
    [updateProject, project.id]
  );
  return (
    <Link
      href={organization ? `/o/${organization.slug}/p/${project.slug}` : ""}
    >
      <a>
        <Card className="hover:component-highlight">
          <Typography.Title level={4} style={{ marginBottom: 0 }}>
            {project.name}
          </Typography.Title>
          <Progress
            size="small"
            percent={
              !!project.taskCount
                ? (project.doneTaskCount / project.taskCount) * 100
                : undefined
            }
            showInfo={false}
          />

          {/* <Typography.Paragraph type="secondary" ellipsis={{ rows: 4 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Typography.Paragraph> */}

          <Row align="middle">
            <Avatar.Group maxCount={3} style={{ flex: 1 }}>
              {users.map((user) => (
                <UserAvatar key={user.id} user={user} linkToProfile />
              ))}
            </Avatar.Group>
            {!!project.openBountyTaskCount && (
              <Tag className="bg-primary">
                {project.openBountyTaskCount === 1
                  ? "1 open bounty"
                  : `${project.openBountyTaskCount} open bounties`}
              </Tag>
            )}
          </Row>

          <Can I="delete" a="Task">
            <Dropdown
              placement="bottomRight"
              trigger={["click"]}
              overlay={
                <Menu
                  theme="dark"
                  onClick={(e) => e.domEvent.stopPropagation()}
                >
                  <Menu.Item
                    icon={<Icons.DeleteOutlined />}
                    onClick={deleteProject}
                  >
                    Delete Project
                  </Menu.Item>
                </Menu>
              }
            >
              <Button
                type="text"
                icon={<Icons.MoreOutlined />}
                style={{ position: "absolute", top: 0, right: 0 }}
              />
            </Dropdown>
          </Can>
        </Card>
      </a>
    </Link>
  );
};
