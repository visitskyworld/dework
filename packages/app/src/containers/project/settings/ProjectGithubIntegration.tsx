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

export function useOrganizationHasGithubIntegration(
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
}) => {
  const project = useProject(projectId);
  const hasOrgInt = useOrganizationHasGithubIntegration(
    project?.organizationId
  );
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

  const creatingGithubIntegration = useToggle();
  const createGithubIntegration = useCreateGithubProjectIntegration();
  const handleConnectGithub = useCallback(async () => {
    creatingGithubIntegration.toggleOn();
    try {
      const repo = githubRepos?.find((r) => r.id === selectedGithubRepoId);
      if (!repo) return;
      await createGithubIntegration(projectId, repo);
    } finally {
      creatingGithubIntegration.toggleOff();
    }
  }, [
    creatingGithubIntegration,
    createGithubIntegration,
    selectedGithubRepoId,
    projectId,
    githubRepos,
  ]);

  const updateProjectIntegration = useUpdateProjectIntegration();
  const removeGithubIntegration = useCallback(
    () => updateProjectIntegration({ id: projInt?.id, deletedAt: new Date() }),
    [projInt?.id, updateProjectIntegration]
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
          onClose={removeGithubIntegration}
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
            loading={creatingGithubIntegration.isOn}
            disabled={!selectedGithubRepoId}
            type="primary"
            onClick={handleConnectGithub}
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
