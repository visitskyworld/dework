import React, { FC } from "react";
import {
  Button,
  ButtonProps,
  Dropdown,
  Menu,
  Space,
  Tag,
  Typography,
} from "antd";
import { NotionIcon } from "@dewo/app/components/icons/Notion";
import { TrelloIcon } from "@dewo/app/components/icons/Trello";

export interface OrganizationCreateFormSubmitButtonOptions {
  importFromNotion?: boolean;
  importFromTrello?: boolean;
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
        <Menu.Item onClick={() => props.onClick({ importFromNotion: true })}>
          <Space>
            <NotionIcon />
            Import tasks from Notion
            <Tag color="green">New</Tag>
          </Space>
        </Menu.Item>
        <Menu.Item onClick={() => props.onClick({ importFromTrello: true })}>
          <Space>
            <TrelloIcon />
            Import tasks from Trello
            <Tag color="green">New</Tag>
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
