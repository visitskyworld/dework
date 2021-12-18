import React, { FC, useMemo } from "react";
import { Button, Typography } from "antd";
import { ProjectIntegrationSource } from "@dewo/app/graphql/types";
import * as Icons from "@ant-design/icons";
import { Constants, siteTitle } from "@dewo/app/util/constants";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useProjectIntegrations } from "../hooks";

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

export const ProjectGithubIntegration: FC<ProjectGithubIntegrationProps> = ({
  projectId,
}) => {
  const connectToGithubUrl = useConnectToGithubUrl(projectId);

  const integrations = useProjectIntegrations(projectId);
  const hasIntegration = useMemo(
    () =>
      integrations?.some((i) => i.source === ProjectIntegrationSource.github),
    [integrations]
  );

  if (hasIntegration) {
    return (
      <>
        <Button
          size="large"
          type="primary"
          block
          icon={<Icons.GithubOutlined />}
          disabled
        >
          Connected to Github
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
