import React, { FC, useCallback, useMemo } from "react";
import {
  OrganizationIntegrationType,
  ProjectIntegrationType,
} from "@dewo/app/graphql/types";
import { Card, Space, Typography } from "antd";
import {
  useCreateGithubProjectIntegration,
  GithubProjectIntegrationFeature,
} from "../../integrations/hooks";
import { CreateGithubIntegrationFormValues } from "../../integrations/github/CreateGithubIntegrationForm";
import { useOrganizationIntegrations } from "../../organization/hooks";
import { ConnectOrganizationToGithubButton } from "../../integrations/github/ConnectOrganizationToGithubButton";
import { CreateGithubIntegrationFeatureForm } from "../../integrations/github/CreateGithubIntegrationFeatureForm";
import { useProjectIntegrations } from "../hooks";

interface Props {
  projectId: string;
  organizationId: string;
}

export const ProjectSettingsGithubIntegrationFeatures: FC<Props> = ({
  projectId,
  organizationId,
}) => {
  const hasGithubOrganizationIntegration = !!useOrganizationIntegrations(
    organizationId,
    OrganizationIntegrationType.GITHUB
  )?.length;

  const allProjectIntegrations = useProjectIntegrations(projectId);
  const githubProjectIntegrations = useMemo(
    () =>
      allProjectIntegrations?.filter(
        (i) => i.type === ProjectIntegrationType.GITHUB
      ),
    [allProjectIntegrations]
  );

  const createIntegration = useCreateGithubProjectIntegration();
  const handleSubmit = useCallback(
    async (values: CreateGithubIntegrationFormValues) => {
      await createIntegration({
        projectId,
        repo: values.repo,
        importIssues: values.importIssues,
        features: values.features,
      });
    },
    [createIntegration, projectId]
  );

  const copy = "Connect one or more repos to your Dework project";

  return (
    <>
      {hasGithubOrganizationIntegration ? (
        <Typography.Paragraph type="secondary">{copy}</Typography.Paragraph>
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
            organizationId={organizationId}
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

      <Space size="middle" direction="vertical" style={{ width: "100%" }}>
        {[
          GithubProjectIntegrationFeature.SHOW_BRANCHES,
          GithubProjectIntegrationFeature.CREATE_ISSUES_FROM_TASKS,
        ]?.map((feature) => (
          <CreateGithubIntegrationFeatureForm
            organizationId={organizationId}
            feature={feature}
            existingIntegrations={githubProjectIntegrations?.filter((i) =>
              i.config.features.includes(feature)
            )}
            disabled={!hasGithubOrganizationIntegration}
            onSubmit={handleSubmit}
          />
        ))}
      </Space>
    </>
  );
};
