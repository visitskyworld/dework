import { NotionIcon } from "@dewo/app/components/icons/Notion";
import { TrelloIcon } from "@dewo/app/components/icons/Trello";
import { Constants } from "@dewo/app/util/constants";
import { Button, Dropdown, Menu, Space, Tag } from "antd";
import { useRouter } from "next/router";
import * as Icons from "@ant-design/icons";
import React, { FC, useCallback } from "react";
import { useOrganization } from "../hooks";

interface Props {
  organizationId: string;
}

export const CreateProjectButton: FC<Props> = ({ organizationId }) => {
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
  const handleBlankProject = useCallback(
    () => router.push(`${organization?.permalink}/create`),
    [organization?.permalink, router]
  );

  if (!organization) return null;
  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      overlay={
        <Menu>
          <Menu.Item onClick={handleBlankProject}>
            <Space>
              <Icons.PlusOutlined />
              Create without importing
            </Space>
          </Menu.Item>
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
      <Button type="primary" icon={<Icons.PlusOutlined />}>
        Create Project
      </Button>
    </Dropdown>
  );
};
