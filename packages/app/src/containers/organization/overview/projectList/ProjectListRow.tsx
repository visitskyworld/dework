import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Menu,
  Row,
  Skeleton,
  Tag,
  Typography,
} from "antd";
import React, { FC, useCallback, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { OrganizationDetails, ProjectSection } from "@dewo/app/graphql/types";
import Link from "next/link";
import {
  useIsProjectPrivate,
  useOrganizationRoles,
} from "@dewo/app/containers/rbac/hooks";
import { useUpdateProject } from "@dewo/app/containers/project/hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useOrganizationUsers } from "../../hooks";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { eatClick } from "@dewo/app/util/eatClick";
import _ from "lodash";
import styles from "./ProjectListRow.module.less";

interface Props {
  project: OrganizationDetails["projects"][number];
  sections: ProjectSection[];
}

export const ProjectListRow: FC<Props> = ({ project, sections }) => {
  const isPrivate = useIsProjectPrivate(project, project.organizationId);
  const canChangeSection = usePermission("update", project, "sectionId");
  const updateProject = useUpdateProject();
  const handleMoveSection = useCallback(
    async (section: ProjectSection) => {
      await updateProject({
        id: project.id,
        sortKey: Date.now().toString(),
        sectionId: section.id === "default" ? null : section.id,
      });
    },
    [project.id, updateProject]
  );

  const { users } = useOrganizationUsers(project.organizationId);
  const roles = useOrganizationRoles(project.organizationId);
  const projectUsers = useMemo(() => {
    const rolesWithAccess = new Set(
      roles
        ?.filter((role) =>
          role.rules.some((r) => r.projectId === project.id && !r.inverted)
        )
        .map((role) => role.id)
    );
    return users?.filter((user) =>
      user.roles.some((r) => rolesWithAccess.has(r.id))
    );
  }, [users, roles, project.id]);

  return (
    <Link href={project.permalink}>
      <a>
        <Card size="small" className={styles.card}>
          <Row
            style={{
              columnGap: 8,
              paddingRight: canChangeSection ? 20 : undefined,
            }}
          >
            <Typography.Text strong>{project.name}</Typography.Text>
            {isPrivate && (
              <Tag className="bg-component" icon={<Icons.LockOutlined />}>
                Private
              </Tag>
            )}
          </Row>
          <div style={{ flex: 1 }} />

          <Row
            style={{ rowGap: 4, justifyContent: "space-between", marginTop: 8 }}
          >
            <Avatar.Group size="small" maxCount={3}>
              {!projectUsers &&
                _.range(3).map((i) => <Skeleton.Avatar size="small" key={i} />)}
              {projectUsers?.map((user) => (
                <UserAvatar key={user.id} user={user} />
              ))}
            </Avatar.Group>
            {!!project.openBountyTaskCount && (
              <Tag className="bg-primary" style={{ margin: 0 }}>
                {project.openBountyTaskCount === 1
                  ? "1 open bounty"
                  : `${project.openBountyTaskCount} open bounties`}
              </Tag>
            )}
          </Row>

          {canChangeSection && (
            <Dropdown
              key="avatar"
              placement="bottomRight"
              trigger={["click"]}
              overlay={
                <Menu>
                  <Menu.SubMenu title="Change Section">
                    {sections.map((section) => (
                      <Menu.Item
                        key={section.id}
                        onClick={(e) => {
                          eatClick(e.domEvent);
                          handleMoveSection(section);
                        }}
                      >
                        {section.name}
                      </Menu.Item>
                    ))}
                  </Menu.SubMenu>
                </Menu>
              }
            >
              <Button
                type="text"
                size="small"
                style={{ position: "absolute", top: 8, right: 8 }}
                icon={<Icons.MoreOutlined />}
                className="dewo-task-options-button"
              />
            </Dropdown>
          )}
        </Card>
      </a>
    </Link>
  );
};
