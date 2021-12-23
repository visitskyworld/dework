import React, { FC, useMemo } from "react";
import { Button, Typography } from "antd";
import { useParseIdFromSlug } from "@dewo/app/util/uuid";
import { ProjectIntegrationSource } from "@dewo/app/graphql/types";
import * as Icons from "@ant-design/icons";
import { Constants, siteTitle } from "@dewo/app/util/constants";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useOrganization } from "../../organization/hooks";

interface ProjectGithubIntegrationProps {
  projectId: string;
  organizationId: string;
}

export function useConnectToGithubUrl(projectId: string): string {
  const { user } = useAuthContext();
  return useMemo(() => {
    const appUrl = typeof window !== "undefined" ? window.location.href : "";
    const state = JSON.stringify({
      appUrl,
      creatorId: user?.id,
      projectId,
    });

    return `${Constants.GITHUB_APP_URL}?state=${state}`;
  }, [projectId, user?.id]);
}

export function useCheckGithubIntegration(
  organizationId: string | undefined
): boolean {
  if (!organizationId) return false;
  const organization = useOrganization(organizationId);

  return useMemo(
    () =>
      !!organization?.projects.some((proj) =>
        proj.integrations.some(
          (int) => int.source === ProjectIntegrationSource.github
        )
      ),
    [organization?.projects]
  );
}

export const ProjectGithubIntegration: FC<ProjectGithubIntegrationProps> = ({
  projectId,
}) => {
  const organizationId = useParseIdFromSlug("organizationSlug");
  const hasGithubIntegration = useCheckGithubIntegration(organizationId);
  const connectToGithubUrl = useConnectToGithubUrl(projectId);

  if (hasGithubIntegration) {
    return (
      <>
        <Button
          size="large"
          type="ghost"
          block
          icon={<Icons.GithubOutlined />}
          href={Constants.GITHUB_APP_URL}
          target="_blank"
        >
          Manage Github Integration
        </Button>
        <Typography.Paragraph disabled style={{ marginTop: 4 }}>
          <Icons.InfoCircleOutlined />
          {` ${siteTitle} tickets will auto-link pull requests if you reference
          the ticket ID in the PR name like so: feat/dw-115/feature-name.`}
        </Typography.Paragraph>
      </>
    );
  }

  return (
    <Button
      size="large"
      type="primary"
      block
      icon={<Icons.GithubOutlined />}
      href={connectToGithubUrl}
    >
      Connect to Github
    </Button>
  );
};
