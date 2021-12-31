import React, { FC, useMemo } from "react";
import { Button, Typography } from "antd";
import { useParseIdFromSlug } from "@dewo/app/util/uuid";
import * as Icons from "@ant-design/icons";
import { Constants, siteTitle } from "@dewo/app/util/constants";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useOrganization } from "../../organization/hooks";
import { ProjectIntegrationType } from "@dewo/app/graphql/types";

interface ProjectGithubIntegrationProps {
  projectId: string;
  organizationId: string;
}

export function useConnectToGithubUrl(organizationId: string): string {
  const { user } = useAuthContext();
  return useMemo(() => {
    const appUrl = typeof window !== "undefined" ? window.location.href : "";
    const state = JSON.stringify({
      appUrl,
      creatorId: user?.id,
      organizationId,
    });

    return `${Constants.GITHUB_APP_URL}?state=${encodeURIComponent(state)}`;
  }, [organizationId, user?.id]);
}

export function useHasGithubIntegration(
  organizationId: string | undefined
): boolean {
  const organization = useOrganization(organizationId);

  return useMemo(
    () =>
      !!organization?.projects.some((proj) =>
        proj.integrations.some(
          (int) => int.type === ProjectIntegrationType.GITHUB
        )
      ),
    [organization?.projects]
  );
}

export const ProjectGithubIntegration: FC<ProjectGithubIntegrationProps> = ({
  projectId,
}) => {
  const organizationId = useParseIdFromSlug("organizationSlug");
  const hasGithubIntegration = useHasGithubIntegration(organizationId);
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
