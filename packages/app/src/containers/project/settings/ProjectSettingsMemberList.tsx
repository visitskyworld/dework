import {
  usePermission,
  usePermissionFn,
} from "@dewo/app/contexts/PermissionsContext";
import React, { FC } from "react";
import {
  useProject,
  useRemoveProjectMember,
  useUpdateProjectMember,
} from "../hooks";
import { Table, Button, Select } from "antd";
import * as Icons from "@ant-design/icons";
import { ProjectMember, ProjectRole } from "@dewo/app/graphql/types";
import { useNavigateToProfile } from "@dewo/app/util/navigation";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { eatClick } from "@dewo/app/util/eatClick";

interface Props {
  projectId: string;
}

export const projectRoleToString: Record<ProjectRole, string> = {
  [ProjectRole.ADMIN]: "Admin",
  [ProjectRole.CONTRIBUTOR]: "Contributor",
};

export const ProjectSettingsMemberList: FC<Props> = ({ projectId }) => {
  const { project } = useProject(projectId);
  const updateMember = useUpdateProjectMember();
  const removeMember = useRemoveProjectMember();

  const hasPermission = usePermissionFn();
  const canDeleteAdmin = usePermission("delete", {
    __typename: "ProjectMember",
    role: ProjectRole.ADMIN,
  });
  const canDeleteContributor = usePermission("delete", {
    __typename: "ProjectMember",
    role: ProjectRole.CONTRIBUTOR,
  });

  const navigateToProfile = useNavigateToProfile();

  return (
    <Table<ProjectMember>
      dataSource={project?.members}
      size="small"
      showHeader={false}
      pagination={{ hideOnSinglePage: true }}
      onRow={(m) => ({ onClick: () => navigateToProfile(m.user) })}
      style={{ cursor: "pointer" }}
      columns={[
        {
          key: "avatar",
          width: 1,
          render: (_, m: ProjectMember) => <UserAvatar user={m.user} />,
        },
        { title: "Username", dataIndex: ["user", "username"] },
        {
          title: "Role",
          dataIndex: "role",
          width: 120,
          render: (currentRole: ProjectRole, member: ProjectMember) => {
            if (!hasPermission("update", member)) {
              return projectRoleToString[currentRole];
            }

            return (
              <Select
                key={member.id}
                defaultValue={currentRole}
                style={{ width: "100%" }}
                onClick={eatClick}
                onChange={(role) =>
                  updateMember({
                    projectId,
                    userId: member.user.id,
                    role,
                  })
                }
              >
                {[ProjectRole.ADMIN, ProjectRole.CONTRIBUTOR].map((role) => (
                  <Select.Option key={role} value={role}>
                    {projectRoleToString[role]}
                  </Select.Option>
                ))}
              </Select>
            );
          },
        },
        ...(canDeleteAdmin || canDeleteContributor
          ? [
              {
                key: "delete",
                width: 1,
                render: (_: unknown, m: ProjectMember) => (
                  <Button
                    type="text"
                    icon={<Icons.DeleteOutlined />}
                    onClick={(event) => {
                      eatClick(event);
                      removeMember({ userId: m.user.id, projectId });
                    }}
                  />
                ),
              },
            ]
          : []),
      ]}
    />
  );
};
