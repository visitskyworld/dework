import React, { FC, useCallback, useMemo, useState } from "react";
import {
  useOrganization,
  useOrganizationGithubRepos,
} from "../../organization/hooks";
import {
  OrganizationIntegrationType,
  ProjectIntegrationType,
} from "@dewo/app/graphql/types";
import { useProject } from "../hooks";
import { ConnectProjectToGithubSelect } from "../../integrations/ConnectProjectToGithubSelect";
import { ConnectToGithubFormSection } from "../../integrations/ConnectToGithubFormSection";
import { ConnectOrganizationToGithubButton } from "../../integrations/ConnectOrganizationToGithubButton";
import { Alert, Button, Input, Typography } from "antd";
import {
  useCreateGithubProjectIntegration,
  useUpdateProjectIntegration,
} from "../../integrations/hooks";
import { useToggle } from "@dewo/app/util/hooks";
import { FormSection } from "@dewo/app/components/FormSection";
import Link from "next/link";

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

  const githubRepos = useOrganizationGithubRepos(
    project?.organizationId,
    !hasOrgInt
  );
  const [selectedGithubRepoId, setSelectedGithubRepoId] = useState<string>();

  const loading = useToggle();
  const createIntegration = useCreateGithubProjectIntegration();
  const handleConnect = useCallback(async () => {
    loading.toggleOn();
    try {
      const repo = githubRepos?.find((r) => r.id === selectedGithubRepoId);
      if (!repo) return;
      await createIntegration(projectId, repo);
    } finally {
      loading.toggleOff();
    }
  }, [
    loading,
    createIntegration,
    selectedGithubRepoId,
    projectId,
    githubRepos,
  ]);

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
      <ConnectToGithubFormSection>
        <Input.Group compact style={{ display: "flex" }}>
          <ConnectProjectToGithubSelect
            repos={githubRepos}
            organizationId={project.organizationId}
            allowClear
            style={{ flex: 1 }}
            onChange={setSelectedGithubRepoId}
          />
          <Button
            loading={loading.isOn}
            disabled={!selectedGithubRepoId}
            type="primary"
            onClick={handleConnect}
          >
            Connect
          </Button>
        </Input.Group>
      </ConnectToGithubFormSection>
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
