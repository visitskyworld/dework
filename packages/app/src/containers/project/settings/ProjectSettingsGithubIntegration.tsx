import React, { FC, useCallback, useMemo } from "react";
import {
  OrganizationIntegrationType,
  ProjectIntegrationType,
} from "@dewo/app/graphql/types";
import { useProjectIntegrations } from "../hooks";
import { ConnectToGithubFormSection } from "../../integrations/ConnectToGithubFormSection";
import { ConnectOrganizationToGithubButton } from "../../integrations/ConnectOrganizationToGithubButton";
import { Alert, Space, Typography } from "antd";
import {
  useCreateGithubProjectIntegration,
  useUpdateProjectIntegration,
} from "../../integrations/hooks";
import { FormSection } from "@dewo/app/components/FormSection";
import Link from "next/link";
import {
  CreateGithubIntegrationForm,
  CreateGithubIntegrationFormValues,
} from "../../integrations/CreateGithubIntegrationForm";
import { useOrganizationDetails } from "../../organization/hooks";

interface ProjectGithubIntegrationProps {
  projectId: string;
  organizationId: string;
}

function useHasOrganizationGithubIntegration(
  organizationId: string | undefined
): boolean {
  const { organization } = useOrganizationDetails(organizationId);
  return useMemo(
    () =>
      !!organization?.integrations.some(
        (i) => i.type === OrganizationIntegrationType.GITHUB
      ),
    [organization?.integrations]
  );
}

export const ProjectSettingsGithubIntegration: FC<
  ProjectGithubIntegrationProps
> = ({ projectId, organizationId }) => {
  const integrations = useProjectIntegrations(projectId);
  const hasOrgInt = useHasOrganizationGithubIntegration(organizationId);
  const projInts = useMemo(
    () => integrations?.filter((i) => i.type === ProjectIntegrationType.GITHUB),
    [integrations]
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

  const updateIntegration = useUpdateProjectIntegration();

  if (!integrations) return null;
  if (!hasOrgInt) {
    return (
      <ConnectToGithubFormSection>
        <ConnectOrganizationToGithubButton organizationId={organizationId} />
      </ConnectToGithubFormSection>
    );
  }

  return (
    <FormSection label="Github Integration">
      <Space direction="vertical" style={{ width: "100%" }}>
        {projInts?.map((integration) => (
          <Alert
            message={
              <Typography.Text>
                Connected to{" "}
                <Link
                  href={`https://github.com/${integration.config.organization}/${integration.config.repo}`}
                >
                  <a target="_blank">
                    <Typography.Text strong>
                      {integration.config.organization}/
                      {integration.config.repo}
                    </Typography.Text>
                  </a>
                </Link>
              </Typography.Text>
            }
            type="success"
            showIcon
            closable
            onClose={() =>
              updateIntegration({
                id: integration!.id,
                deletedAt: new Date().toISOString(),
              })
            }
          />
        ))}
        <CreateGithubIntegrationForm
          key={projInts?.length}
          organizationId={organizationId}
          onSubmit={handleSubmit}
        />
      </Space>
    </FormSection>
  );
};
