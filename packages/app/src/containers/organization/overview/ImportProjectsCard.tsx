import { NotionIcon } from "@dewo/app/components/icons/Notion";
import { TrelloIcon } from "@dewo/app/components/icons/Trello";
import { Constants } from "@dewo/app/util/constants";
import {
  Avatar,
  Card,
  Dropdown,
  Menu,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useRouter } from "next/router";
import * as Icons from "@ant-design/icons";
import React, { FC, useCallback } from "react";
import { useOrganization } from "../hooks";

interface Props {
  organizationId: string;
}

export const ImportProjectsCard: FC<Props> = ({ organizationId }) => {
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
  const goToTrelloOauthFlow = useCallback(() => {
    const url = `${
      Constants.GRAPHQL_API_URL
    }/auth/trello?state=${JSON.stringify({
      redirect: `${router.asPath}/trello-import`,
    })}`;
    window.location.href = url;
  }, [router.asPath]);
  if (!organization) return null;
  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomCenter"
      overlay={
        <Menu style={{ textAlign: "center" }}>
          <Menu.Item onClick={goToNotionOauthFlow}>
            <Space>
              <NotionIcon />
              Import tasks from Notion
              <Tag color="green">New</Tag>
            </Space>
          </Menu.Item>
          <Menu.Item onClick={goToTrelloOauthFlow}>
            <Space>
              <TrelloIcon />
              Import tasks from Trello
              <Tag color="green">New</Tag>
            </Space>
          </Menu.Item>
        </Menu>
      }
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
            Import from Notion/Trello
          </Typography.Title>
          <Typography.Paragraph
            type="secondary"
            className="ant-typography-caption"
          >
            <Tooltip
              title="Easily move all of your Notion or Trello boards over to Dework. Select which boards you want to import and Dework does the rest!"
              placement="bottom"
            >
              What does this do? <Icons.QuestionCircleOutlined />
            </Tooltip>
          </Typography.Paragraph>
        </Space>
      </Card>
    </Dropdown>
  );
};
