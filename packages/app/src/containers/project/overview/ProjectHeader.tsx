import {
  Avatar,
  Button,
  Input,
  PageHeader,
  Row,
  Skeleton,
  Space,
  Typography,
} from "antd";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import { useProject, useUpdateProject } from "../hooks";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useOrganization } from "../../organization/hooks";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { PageHeaderBreadcrumbs } from "../../navigation/PageHeaderBreadcrumbs";
import { Can, usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useToggle } from "@dewo/app/util/hooks";
import Link from "next/link";
import { FollowOrganizationButton } from "../../organization/overview/FollowOrganizationButton";
import { ProjectInviteButton } from "../../invite/ProjectInviteButton";
import { ProjectVisibility } from "@dewo/app/graphql/types";

interface Props {
  projectId: string;
}

export const ProjectHeader: FC<Props> = ({ projectId }) => {
  const project = useProject(projectId);
  const organization = useOrganization(project?.organizationId);
  const canEdit = usePermission("update", "Project");

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
      title={
        !!project ? (
          !editName.isOn ? (
            <Typography.Title
              level={3}
              style={{ margin: 0 }}
              onClick={editName.toggleOn}
            >
              {project.visibility === ProjectVisibility.PRIVATE && (
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
      subTitle={
        !!project ? (
          <Row align="middle">
            <Avatar.Group maxCount={3} size="large" style={{ marginRight: 8 }}>
              {project?.members.map((m) => (
                <UserAvatar key={m.id} user={m.user} linkToProfile />
              ))}
            </Avatar.Group>

            <Space>
              <Row>
                <Link href={`${project?.permalink}/about`}>
                  <a>
                    <Button
                      type="text"
                      size="large"
                      icon={<Icons.InfoCircleOutlined />}
                    />
                  </a>
                </Link>
                <Can I="update" a="Project">
                  <Link href={`${project?.permalink}/settings`}>
                    <a>
                      <Button
                        type="text"
                        size="large"
                        icon={<Icons.SettingOutlined />}
                      />
                    </a>
                  </Link>
                </Can>
              </Row>
              <ProjectInviteButton projectId={projectId} />
              <FollowOrganizationButton
                organizationId={project?.organizationId}
              />
            </Space>
          </Row>
        ) : (
          <Skeleton.Avatar active size="large" />
        )
      }
      breadcrumb={<PageHeaderBreadcrumbs routes={routes} />}
    />
  );
};
