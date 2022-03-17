import { FC } from "react";
import { ProjectRole } from "@dewo/app/graphql/types";

interface Props {
  projectId: string;
}

export const projectRoleToString: Record<ProjectRole, string> = {
  [ProjectRole.ADMIN]: "Steward",
  [ProjectRole.CONTRIBUTOR]: "Contributor",
};

export const projectRoleDescription: Record<ProjectRole, string> = {
  [ProjectRole.ADMIN]: [
    "Project Stewards can:",
    "- do everything Contributors can",
    "- manage all tasks, applications, submissions",
    "- manage project settings",
  ].join("\n"),
  [ProjectRole.CONTRIBUTOR]: [
    "Project Contributors can:",
    "- see private projects",
    "- apply to tasks",
    "- manage tasks they're assigned to or reviewing",
    "- create and vote on community suggestions",
  ].join("\n"),
};

export const ProjectSettingsMemberList: FC<Props> = () => {
  return null;
  /*
  const { project } = useProject(projectId);

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
                  alert(
                    "TODO: update: " +
                      JSON.stringify({
                        projectId,
                        userId: member.user.id,
                        role,
                      })
                  )
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
                      alert(
                        "TODO: remove: " +
                          JSON.stringify({ userId: m.user.id, projectId })
                      );
                    }}
                  />
                ),
              },
            ]
          : []),
      ]}
    />
  );
  */
};
