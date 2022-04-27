import React, { ReactNode } from "react";
import { Card, Button, Space } from "antd";
import classNames from "classnames";
import { HeadlessCollapse } from "@dewo/app/components/HeadlessCollapse";
import { UseToggleHook } from "@dewo/app/util/hooks";
import styles from "./IntegrationCard.module.less";

interface Props {
  headerTitle: string | undefined;
  headerIcon: ReactNode;
  isConnected: boolean;
  connectedButtonCopy: string;
  children: ReactNode;
  expanded: UseToggleHook;
  disabled?: boolean;
}

export const CreateIntegrationFeatureCard = ({
  headerTitle,
  headerIcon,
  isConnected,
  connectedButtonCopy,
  children,
  expanded,
  disabled,
}: Props) => (
  <Card
    hoverable={isConnected && !expanded.isOn}
    onClick={isConnected && !expanded.isOn ? expanded.toggleOn : undefined}
    title={
      <Space style={{ maxWidth: "100%" }}>
        {headerIcon}
        {headerTitle}
      </Space>
    }
    className={classNames({
      [styles.connected]: isConnected,
      [styles.expanded]: expanded.isOn,
      [styles.integrationcard]: true,
    })}
    extra={
      isConnected ? (
        <Button className="dewo-simple-button" onClick={expanded.toggle}>
          {connectedButtonCopy}
        </Button>
      ) : (
        <Space>
          <Button
            type="text"
            hidden={!expanded.isOn}
            onClick={expanded.toggleOff}
          >
            Cancel
          </Button>
          <Button
            type={disabled ? "default" : "primary"}
            disabled={disabled}
            onClick={expanded.toggle}
          >
            Setup integration
          </Button>
        </Space>
      )
    }
  >
    <HeadlessCollapse expanded={expanded.isOn}>{children}</HeadlessCollapse>
  </Card>
);
