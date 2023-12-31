import React, { FC } from "react";
import { Button, ButtonProps, Dropdown, Menu, Space, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import { NotionIcon } from "@dewo/app/components/icons/Notion";
import { TrelloIcon } from "@dewo/app/components/icons/Trello";

export interface OrganizationCreateFormSubmitButtonOptions {
  import?: "notion" | "trello" | "github";
}

export interface OrganizationCreateFormSubmitButtonProps
  extends Omit<ButtonProps, "onClick"> {
  onClick(options?: OrganizationCreateFormSubmitButtonOptions): void;
}

export const OrganizationCreateFormSubmitButton: FC<
  OrganizationCreateFormSubmitButtonProps
> = (props) => (
  <Dropdown
    trigger={["click"]}
    placement="bottomCenter"
    disabled={props.disabled}
    overlay={
      <Menu style={{ textAlign: "center" }}>
        <Typography.Text type="secondary">
          Do you want to move over existing projects and tasks?
        </Typography.Text>
        <Menu.Item onClick={() => props.onClick({ import: "notion" })}>
          <Space>
            <NotionIcon />
            Import tasks from Notion
          </Space>
        </Menu.Item>
        <Menu.Item onClick={() => props.onClick({ import: "trello" })}>
          <Space>
            <TrelloIcon />
            Import tasks from Trello
          </Space>
        </Menu.Item>
        <Menu.Item onClick={() => props.onClick({ import: "github" })}>
          <Space>
            <Icons.GithubOutlined />
            Import tasks from Github
          </Space>
        </Menu.Item>
        <Menu.Item onClick={() => props.onClick()}>
          Don't import projects and tasks
        </Menu.Item>
      </Menu>
    }
  >
    <Button {...props} onClick={undefined} />
  </Dropdown>
);
