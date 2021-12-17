import { Avatar, Input, PageHeader, Row, Skeleton, Typography } from "antd";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { useProject, useUpdateProject } from "../hooks";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useOrganization } from "../../organization/hooks";
import { InviteButton } from "../../invite/InviteButton";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { PageHeaderBreadcrumbs } from "../../navigation/PageHeaderBreadcrumbs";
import { JoinOrganizationButton } from "../../organization/overview/JoinOrganizationButton";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";

interface Props {
  projectId: string;
}

export const ProjectHeader: FC<Props> = ({ projectId }) => {
  const project = useProject(projectId);
  const organization = useOrganization(project?.organizationId);
  const updateProject = useUpdateProject();
  const canEdit = usePermission("update", "Project");
  const [isEdit, setIsEdit] = useState(false);
  const [projectName, setProjectName] = useState("");

  const routes = useMemo(
    () =>
      !!organization &&
      !!project && [
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
          children: [{ path: "settings", breadcrumbName: "Settings" }],
        },
      ],
    [organization, project]
  ) as Route[];

  const handleChange = useCallback(async (e: any) => {
    setProjectName(e.target.value);
    updateProjectName(e.target.value);
  }, []);

  const updateProjectName = _.debounce((name) => {
    if (name) {
      updateProject({
        id: projectId,
        name: name,
      });
    }
  }, 500);

  useEffect(() => {
    if (!!project) {
      setProjectName(project.name);
    }
  }, [project]);

  return (
    <PageHeader
      title={
        !!project ? (
          <Typography.Title level={3} style={{ margin: 0 }}>
            {!isEdit ? (
              <div onClick={() => setIsEdit(true)}>{project.name}</div>
            ) : (
              <Input
                disabled={!canEdit}
                autoFocus={true}
                className="dewo-field dewo-field-display ant-typography-h3"
                placeholder={`Enter a project name...`}
                onBlur={() => setIsEdit(false)}
                onChange={handleChange}
                value={projectName}
                bordered={false}
              />
            )}
          </Typography.Title>
        ) : (
          <Skeleton.Button active style={{ width: 200 }} />
        )
      }
      subTitle={
        !!project ? (
          <Row align="middle">
            <Avatar.Group maxCount={3} size="large">
              {organization?.members.map((m) => (
                <UserAvatar key={m.id} user={m.user} linkToProfile />
              ))}
            </Avatar.Group>

            <div style={{ width: 24 }} />
            <InviteButton
              organizationId={project?.organizationId}
              projectId={projectId}
            />
            <JoinOrganizationButton organizationId={project?.organizationId} />
          </Row>
        ) : (
          <Skeleton.Avatar active size="large" />
        )
      }
      breadcrumb={<PageHeaderBreadcrumbs routes={routes} />}
    />
  );
};
