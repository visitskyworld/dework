import React, { FC, useMemo } from "react";
import { Button, Typography } from "antd";
import {
  GetProjectIntegrationsQuery,
  GetProjectIntegrationsQueryVariables,
  ProjectIntegrationSource,
} from "@dewo/app/graphql/types";
import { useQuery } from "@apollo/client";
import * as Queries from "@dewo/app/graphql/queries";
import * as Icons from "@ant-design/icons";
import { useRouter } from "next/router";
import { Constants, siteTitle } from "@dewo/app/util/constants";
import { useAuthContext } from "../../../contexts/AuthContext";

interface ProjectGithubIntegrationProps {
  projectId: string;
  organizationId: string;
}

export const ProjectGithubIntegration: FC<ProjectGithubIntegrationProps> = ({
  projectId,
}) => {
  const router = useRouter();
  const auth = useAuthContext();
  const appUrl = typeof window !== "undefined" ? window.location.href : "";
  const state = JSON.stringify({
    ...router.query,
    appUrl,
    creatorId: auth.user?.id,
  });
  const integrations = useQuery<
    GetProjectIntegrationsQuery,
    GetProjectIntegrationsQueryVariables
  >(Queries.projectIntegrations, { variables: { projectId } }).data?.project
    .integrations;

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
      href={`${Constants.GITHUB_APP_URL}?state=${state}`}
    >
      Connect Github
    </Button>
  );
};
