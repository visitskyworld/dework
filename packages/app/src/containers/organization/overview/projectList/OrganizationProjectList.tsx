import { Col, Row, Skeleton, Space, Typography } from "antd";
import React, { FC, useEffect, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import { JoinTokenGatedProjectsAlert } from "../../../invite/JoinTokenGatedProjectsAlert";
import { ProjectSection } from "@dewo/app/graphql/types";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { ProjectListRow } from "./ProjectListRow";
import { ProjectSectionOptionsButton } from "./ProjectSectionOptionsButton";
import { CreateProjectButton } from "../CreateProjectButton";
import { ProjectListEmpty } from "./ProjectListEmpty";
import { useOrganizationDetails, useOrganizationSections } from "../../hooks";
import { DiscordRoleGateAlert } from "@dewo/app/containers/invite/DiscordRoleGateAlert";
import { isSSR } from "@dewo/app/util/isSSR";
import _ from "lodash";

interface Props {
  organizationId: string;
}

const defaultProjectSection: ProjectSection = {
  id: "default",
  name: "Projects",
  sortKey: "1",
  __typename: "ProjectSection",
};

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

  const sections = useOrganizationSections(organizationId);

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
          sections.map((section) => (
            <div key={section.id}>
              <Row align="middle" style={{ marginBottom: 8 }}>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  {section.name}
                </Typography.Title>
                <ProjectSectionOptionsButton
                  section={section}
                  isDefault={section.id === defaultProjectSection.id}
                  organizationId={organizationId}
                />
                {canCreateProject && section.id === defaultProjectSection.id && (
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
                {section.projects.map((project) => (
                  <Col key={project.id} xs={24} sm={12} xl={8} xxl={8}>
                    <ProjectListRow project={project} sections={sections} />
                  </Col>
                ))}
              </Row>

              {!section.projects.length && (
                <Typography.Text type="secondary">
                  This section is empty
                </Typography.Text>
              )}
            </div>
          ))
        )}
      </Space>
    </Skeleton>
  );
};
