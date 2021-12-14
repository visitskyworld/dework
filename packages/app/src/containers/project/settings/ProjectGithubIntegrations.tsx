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
import { useAuthContext } from "../../../contexts/AuthContext";
import { Constants } from "@dewo/app/util/constants";
import { siteTitle } from "../../../util/constants";

type ProjectGithubIntegrationProps = {
  projectId: string;
  organizationId: string;
};

export const ProjectGithubIntegration: FC<ProjectGithubIntegrationProps> = ({
  projectId,
  organizationId,
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
      integrations?.some(
        (i) =>
          i.source === ProjectIntegrationSource.github &&
          (i.config as any).organizationId === organizationId
      ),
    [integrations, organizationId]
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
          the ticket ID in the PR description.`}
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
