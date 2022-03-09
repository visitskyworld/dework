import { NotionIcon } from "@dewo/app/components/icons/Notion";
import { TrelloIcon } from "@dewo/app/components/icons/Trello";
import { Constants } from "@dewo/app/util/constants";
import { Button, ButtonProps, Dropdown, Menu, Space, Tag } from "antd";
import { useRouter } from "next/router";
import * as Icons from "@ant-design/icons";
import React, { FC, useCallback } from "react";
import { useOrganization } from "../hooks";
import { useConnectToGithubUrlFn } from "../../integrations/hooks";
import { OrganizationIntegrationType } from "@dewo/app/graphql/types";
import Link from "next/link";

interface Props extends ButtonProps {
  organizationId: string;
  mode?: "import" | "all";
}

export const CreateProjectButton: FC<Props> = ({
  organizationId,
  mode = "all",
  ...buttonProps
}) => {
  const router = useRouter();
  const { organization } = useOrganization(organizationId);
  const goToNotionOauthFlow = useCallback(() => {
    const url = `${
      Constants.GRAPHQL_API_URL
    }/auth/notion?state=${JSON.stringify({
      redirect: `${router.asPath}/import/notion`,
    })}`;
    window.location.href = url;
  }, [router.asPath]);
  const goToTrelloOauthFlow = useCallback(() => {
    const url = `${
      Constants.GRAPHQL_API_URL
    }/auth/trello?state=${JSON.stringify({
      redirect: `${router.asPath}/import/trello`,
    })}`;
    window.location.href = url;
  }, [router.asPath]);

  const createConnectToGithubUrl = useConnectToGithubUrlFn();
  const goToGithubOauthFlow = useCallback(() => {
    if (!organization) return;
    const redirectUrl = `${organization.permalink}/import/github`;
    const hasGithubIntegration = !!organization.integrations.some(
      (i) => i.type === OrganizationIntegrationType.GITHUB
    );
    if (hasGithubIntegration) {
      router.push(redirectUrl);
    } else {
      window.location.href = createConnectToGithubUrl(organization.id, {
        appUrl: redirectUrl,
      });
    }
  }, [router, organization, createConnectToGithubUrl]);

  if (!organization) return null;
  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomCenter"
      overlay={
        <Menu>
          {mode === "all" && (
            <Link href={`${organization.permalink}/create`}>
              <a>
                <Menu.Item>
                  <Space>
                    <Icons.PlusOutlined />
                    Create without importing
                  </Space>
                </Menu.Item>
              </a>
            </Link>
          )}
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
          <Menu.Item onClick={goToGithubOauthFlow}>
            <Space>
              <Icons.GithubOutlined />
              Import tasks from Github
              <Tag color="green">New</Tag>
            </Space>
          </Menu.Item>
        </Menu>
      }
    >
      <Button {...buttonProps} />
    </Dropdown>
  );
};
