import React, { ReactNode } from "react";
import { Card, Button, Space, Tag, Divider } from "antd";
import classNames from "classnames";
import { HeadlessCollapse } from "@dewo/app/components/HeadlessCollapse";
import styles from "./IntegrationCard.module.less";
import { UseToggleHook } from "@dewo/app/util/hooks";

interface Props {
  headerTitle: string | undefined;
  headerIcon: ReactNode;
  isConnected: boolean;
  connectedButtonCopy: string;
  children: ReactNode;
  collapsedContent?: ReactNode;
  expanded: UseToggleHook;
  disabled?: boolean;
  onClick: () => void;
}

export const CreateIntegrationFeatureCard = ({
  headerTitle,
  headerIcon,
  isConnected,
  connectedButtonCopy,
  children,
  collapsedContent,
  expanded,
  disabled,
  onClick,
}: Props) => (
  <Card
    hoverable={isConnected && !expanded.isOn}
    onClick={isConnected && !expanded.isOn ? expanded.toggleOn : undefined}
    title={
      <Space style={{ maxWidth: "100%" }}>
        {headerIcon}
        {headerTitle}
        {isConnected && <Tag color="purple">Enabled</Tag>}
      </Space>
    }
    style={{ overflow: "hidden" }}
    className={classNames({
      [styles.integrationcard]: true,
    })}
    extra={
      isConnected ? (
        <Button onClick={onClick}>{connectedButtonCopy}</Button>
      ) : expanded.isOn ? (
        <Button type="text" disabled={disabled} onClick={onClick}>
          {expanded.isOn ? "Cancel" : "Connect"}
        </Button>
      ) : (
        <Button
          type={disabled ? "default" : "primary"}
          disabled={disabled}
          onClick={onClick}
        >
          Connect
        </Button>
      )
    }
  >
    {(!!collapsedContent || expanded.isOn) && <Divider style={{ margin: 0 }} />}
    {!!collapsedContent && (
      <HeadlessCollapse expanded={!expanded.isOn}>
        {collapsedContent}
      </HeadlessCollapse>
    )}
    <HeadlessCollapse expanded={expanded.isOn}>{children}</HeadlessCollapse>
  </Card>
);
