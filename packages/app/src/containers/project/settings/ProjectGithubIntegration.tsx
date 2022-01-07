import React, { FC, useCallback, useMemo } from "react";
import { useOrganization } from "../../organization/hooks";
import {
  OrganizationIntegrationType,
  ProjectIntegrationType,
} from "@dewo/app/graphql/types";
import { useProject } from "../hooks";
import { ConnectToGithubFormSection } from "../../integrations/ConnectToGithubFormSection";
import { ConnectOrganizationToGithubButton } from "../../integrations/ConnectOrganizationToGithubButton";
import { Alert, Typography } from "antd";
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

interface ProjectGithubIntegrationProps {
  projectId: string;
  organizationId: string;
}

function useHasOrganizationGithubIntegration(
  organizationId: string | undefined
): boolean {
  const organization = useOrganization(organizationId);
  return useMemo(
    () =>
      !!organization?.integrations.some(
        (i) => i.type === OrganizationIntegrationType.GITHUB
      ),
    [organization?.integrations]
  );
}

export const ProjectGithubIntegration: FC<ProjectGithubIntegrationProps> = ({
  projectId,
  organizationId,
}) => {
  const project = useProject(projectId);
  const hasOrgInt = useHasOrganizationGithubIntegration(organizationId);
  const projInt = useMemo(
    () =>
      project?.integrations.find(
        (i) => i.type === ProjectIntegrationType.GITHUB
      ),
    [project?.integrations]
  );

  const createIntegration = useCreateGithubProjectIntegration();
  const handleSubmit = useCallback(
    async (values: CreateGithubIntegrationFormValues) => {
      await createIntegration({
        projectId,
        repo: values.repo,
        importIssues: values.importIssues,
      });
    },
    [createIntegration, projectId]
  );

  const updateIntegration = useUpdateProjectIntegration();
  const removeIntegration = useCallback(
    () =>
      updateIntegration({
        id: projInt!.id,
        deletedAt: new Date().toISOString(),
      }),
    [projInt, updateIntegration]
  );

  if (!project) return null;
  if (!!projInt) {
    return (
      <FormSection label="Github Integration">
        <Alert
          message={
            <Typography.Text>
              Connected to{" "}
              <Link
                href={`https://github.com/${projInt.config.organization}/${projInt.config.repo}`}
              >
                <a target="_blank">
                  <Typography.Text strong>
                    {projInt.config.organization}/{projInt.config.repo}
                  </Typography.Text>
                </a>
              </Link>
            </Typography.Text>
          }
          type="success"
          showIcon
          closable
          onClose={removeIntegration}
        />
      </FormSection>
    );
  }

  if (!!hasOrgInt) {
    return (
      <CreateGithubIntegrationForm
        organizationId={organizationId}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <ConnectToGithubFormSection>
      <ConnectOrganizationToGithubButton
        organizationId={project.organizationId}
      />
    </ConnectToGithubFormSection>
  );
};
