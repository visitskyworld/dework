import React, { FC, useMemo } from "react";
import {
  OrganizationIntegrationType,
  ProjectDetails,
  ProjectIntegrationType,
} from "@dewo/app/graphql/types";
import { Card, Divider, Skeleton, Space, Typography } from "antd";
import { GithubProjectIntegrationFeature } from "../../integrations/hooks";
import { useOrganizationIntegrations } from "../../organization/hooks";
import { ConnectOrganizationToGithubButton } from "../../integrations/github/ConnectOrganizationToGithubButton";
import { CreateGithubIntegrationFeatureForm } from "../../integrations/github/CreateGithubIntegrationFeatureForm";
import { useProjectIntegrations } from "../hooks";

interface Props {
  project: ProjectDetails;
}

export const ProjectSettingsGithubIntegration: FC<Props> = ({ project }) => {
  const hasGithubOrganizationIntegration = !!useOrganizationIntegrations(
    project.organizationId,
    OrganizationIntegrationType.GITHUB
  )?.length;

  const allProjectIntegrations = useProjectIntegrations(project.id);
  const githubProjectIntegrations = useMemo(
    () =>
      allProjectIntegrations?.filter(
        (i) => i.type === ProjectIntegrationType.GITHUB
      ),
    [allProjectIntegrations]
  );

  const copy = "Connect one or more repos to your Dework project";

  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: 4 }}>
        Github Integration
      </Typography.Title>
      <Divider style={{ marginTop: 0 }} />
      <Skeleton loading={!githubProjectIntegrations}>
        <Space size="middle" direction="vertical" style={{ width: "100%" }}>
          {hasGithubOrganizationIntegration ? (
            <Typography.Text type="secondary">{copy}</Typography.Text>
          ) : (
            <Card
              className="dewo-card-highlighted"
              bodyStyle={{
                display: "flex",
                alignItems: "center",
                padding: 12,
              }}
            >
              <ConnectOrganizationToGithubButton
                organizationId={project.organizationId}
                type="primary"
                icon={null}
                style={{ marginTop: 0 }}
              >
                Connect Github
              </ConnectOrganizationToGithubButton>
              <Typography.Paragraph style={{ margin: 0, marginLeft: 12 }}>
                {copy}
              </Typography.Paragraph>
            </Card>
          )}
          {[
            GithubProjectIntegrationFeature.SHOW_BRANCHES,
            GithubProjectIntegrationFeature.CREATE_TASKS_FROM_ISSUES,
          ]?.map((feature) => (
            <CreateGithubIntegrationFeatureForm
              key={feature}
              feature={feature}
              projectId={project.id}
              existingIntegrations={
                githubProjectIntegrations?.filter((i) =>
                  i.config.features.includes(feature)
                ) ?? []
              }
              disabled={!hasGithubOrganizationIntegration}
            />
          ))}
        </Space>
      </Skeleton>
    </>
  );
};
