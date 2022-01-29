import * as Icons from "@ant-design/icons";
import { NotionIcon } from "@dewo/app/components/icons/Notion";
import { Constants } from "@dewo/app/util/constants";
import { Avatar, Card, Popconfirm, Space, Tooltip, Typography } from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback } from "react";
import { useOrganization } from "../hooks";

interface Props {
  organizationId: string;
}

export const ImportProjectsFromNotionCard: FC<Props> = ({ organizationId }) => {
  const router = useRouter();
  const { organization } = useOrganization(organizationId);
  const goToNotionOauthFlow = useCallback(() => {
    const url = `${
      Constants.GRAPHQL_API_URL
    }/auth/notion?state=${JSON.stringify({
      redirect: `${router.asPath}/notion-import`,
    })}`;
    window.location.href = url;
  }, [router.asPath]);
  if (!organization) return null;
  return (
    <Popconfirm
      title="You will be sent to Notion to select what workspaces you want to import to Dework. After you have selected workspaces, you will be redirected back to this page and the workspaces and Notion cards will be shown as Dework projects and tasks."
      okText="Go to Notion"
      icon={<NotionIcon style={{ color: "unset" }} />}
      onConfirm={goToNotionOauthFlow}
    >
      <Card
        size="small"
        className="dewo-project-card hover:component-highlight"
      >
        <Space direction="vertical" align="center">
          <Avatar size="large" icon={<NotionIcon />} />
          <Typography.Title
            level={5}
            style={{ marginBottom: 0, textAlign: "center" }}
          >
            Import from Notion
          </Typography.Title>
          <Typography.Paragraph
            type="secondary"
            className="ant-typography-caption"
          >
            <Tooltip title="Easily move all of your Notion boards over to Dework. Select which boards you want to import and Dework does the rest!">
              What does this do? <Icons.QuestionCircleOutlined />
            </Tooltip>
          </Typography.Paragraph>
        </Space>
      </Card>
    </Popconfirm>
  );
};
