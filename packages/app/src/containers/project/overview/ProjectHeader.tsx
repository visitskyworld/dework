import { Input, PageHeader, Skeleton, Space, Typography } from "antd";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import { useProject, useUpdateProject } from "../hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useToggle } from "@dewo/app/util/hooks";
import { FollowOrganizationButton } from "../../organization/overview/FollowOrganizationButton";
import { ProjectInviteButton } from "../../invite/ProjectInviteButton";
import { PageHeaderBreadcrumbs } from "../../navigation/PageHeaderBreadcrumbs";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { useIsProjectPrivate } from "../../rbac/hooks";
import { useOrganization } from "../../organization/hooks";

interface Props {
  projectId: string;
  organizationId: string;
}

export const ProjectHeader: FC<Props> = ({ projectId, organizationId }) => {
  const { project } = useProject(projectId);
  const isPrivate = useIsProjectPrivate(project);
  const organization = useOrganization(organizationId);
  const canEdit = usePermission("update", project);

  const routes = useMemo<Route[] | undefined>(() => {
    if (!organization || !project) return undefined;
    return [
      {
        path: "../..",
        breadcrumbName: "Home",
      },
      {
        path: `o/${organization.slug}`,
        breadcrumbName: organization.name,
      },
      {
        path: `p/${project.slug}`,
        breadcrumbName: project.name,
      },
    ];
  }, [organization, project]);

  const editName = useToggle();
  const [projectName, setProjectName] = useState("");
  const updateProject = useUpdateProject();
  const submitProjectName = useCallback(async () => {
    await updateProject({ id: projectId, name: projectName });
    editName.toggleOff();
  }, [editName, updateProject, projectId, projectName]);

  const handleChange = useCallback(async (e: any) => {
    setProjectName(e.target.value);
  }, []);

  useEffect(() => {
    if (!!project) setProjectName(project.name);
  }, [project]);

  return (
    <PageHeader
      className="dewo-project-header"
      style={{ paddingBottom: 0 }}
      title={
        !!project ? (
          !editName.isOn ? (
            <Typography.Title
              level={3}
              style={{ margin: 0 }}
              onClick={editName.toggleOn}
            >
              {isPrivate && (
                <Typography.Text type="secondary">
                  <Icons.LockOutlined />
                  {"  "}
                </Typography.Text>
              )}
              {project.name}
            </Typography.Title>
          ) : (
            <Input
              disabled={!canEdit}
              autoFocus={true}
              className="ant-input dewo-field dewo-field-display ant-typography-h3"
              placeholder="Enter a project name..."
              onBlur={editName.toggleOff}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  submitProjectName();
                }
              }}
              onChange={handleChange}
              value={projectName}
            />
          )
        ) : (
          <Skeleton.Button active style={{ width: 200 }} />
        )
      }
      // subTitle={
      //   !!project ? (
      //     <Row align="middle">
      //       <Avatar.Group maxCount={3} size="large" style={{ marginRight: 16 }}>
      //         {project?.members.map((m) => (
      //           <UserAvatar key={m.id} user={m.user} linkToProfile />
      //         ))}
      //       </Avatar.Group>
      //     </Row>
      //   ) : (
      //     <Skeleton.Avatar active size="large" />
      //   )
      // }
      extra={
        !!project && (
          <Space align="center" style={{ height: "100%" }}>
            <ProjectInviteButton projectId={projectId} />
            <FollowOrganizationButton
              organizationId={project?.organizationId}
            />
          </Space>
        )
      }
      breadcrumb={<PageHeaderBreadcrumbs routes={routes} />}
    />
  );
};
