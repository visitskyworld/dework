import { Col, Row, Skeleton, Space, Typography } from "antd";
import React, { FC, useEffect, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import { JoinTokenGatedProjectsAlert } from "../../../invite/JoinTokenGatedProjectsAlert";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { ProjectListRow } from "./ProjectListRow";
import { CreateProjectButton } from "../CreateProjectButton";
import { ProjectListEmpty } from "./ProjectListEmpty";
import { useOrganizationDetails, useOrganizationWorkspaces } from "../../hooks";
import { DiscordRoleGateAlert } from "@dewo/app/containers/invite/DiscordRoleGateAlert";
import { isSSR } from "@dewo/app/util/isSSR";
import _ from "lodash";
import { WorkspaceOptionsButton } from "./WorkspaceOptionsButton";

interface Props {
  organizationId: string;
}

export const OrganizationProjectList: FC<Props> = ({ organizationId }) => {
  const { organization } = useOrganizationDetails(organizationId);
  const projects = useMemo(
    () => _.sortBy(organization?.projects, (p) => p.sortKey),
    [organization?.projects]
  );

  const canCreateProject = usePermission("create", {
    __typename: "Project",
    organizationId,
  });

  const workspaces = useOrganizationWorkspaces(organizationId);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <Skeleton loading={!mounted || !organization || isSSR}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <DiscordRoleGateAlert organizationId={organizationId} />
        <JoinTokenGatedProjectsAlert organizationId={organizationId} />

        {!projects.length ? (
          <ProjectListEmpty organizationId={organizationId} />
        ) : (
          workspaces.map((workspace) => (
            <div key={workspace.id}>
              <Row align="middle" style={{ marginBottom: 8 }}>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  {workspace.name}
                </Typography.Title>
                <WorkspaceOptionsButton
                  workspace={workspace}
                  isDefault={workspace.default}
                  organizationId={organizationId}
                />
                {canCreateProject && workspace.default && (
                  <>
                    <div style={{ flex: 1 }} />
                    <CreateProjectButton
                      organizationId={organizationId}
                      type="primary"
                      size="small"
                      icon={<Icons.PlusOutlined />}
                    >
                      Create Project
                    </CreateProjectButton>
                  </>
                )}
              </Row>
              <Row gutter={[8, 8]}>
                {workspace.projects.map((project) => (
                  <Col key={project.id} xs={24} sm={12} xl={8} xxl={8}>
                    <ProjectListRow project={project} workspaces={workspaces} />
                  </Col>
                ))}
              </Row>

              {!workspace.projects.length && (
                <Typography.Text type="secondary">
                  This workspace is empty
                </Typography.Text>
              )}
            </div>
          ))
        )}
      </Space>
    </Skeleton>
  );
};
