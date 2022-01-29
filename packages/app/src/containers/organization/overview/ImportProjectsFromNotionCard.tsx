import * as Icons from "@ant-design/icons";
import { NotionIcon } from "@dewo/app/components/icons/Notion";
import { Constants } from "@dewo/app/util/constants";
import { Avatar, Card, Space, Tooltip, Typography } from "antd";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { useOrganization } from "../hooks";

interface Props {
  organizationId: string;
}

export const ImportProjectsFromNotionCard: FC<Props> = ({ organizationId }) => {
  const router = useRouter();
  const { organization } = useOrganization(organizationId);
  if (!organization) return null;
  return (
    <a
      href={`${Constants.GRAPHQL_API_URL}/auth/notion?state=${JSON.stringify({
        redirect: `${router.asPath}/notion-import`,
      })}`}
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
    </a>
  );
};
