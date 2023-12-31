import { Logo } from "@dewo/app/components/Logo";
import styles from "./LandingPage.module.less";
import React, { FC } from "react";
import { PageHeader, Button } from "antd";
import getConfig from "next/config";
import { deworkSocialLinks } from "@dewo/app/util/constants";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";

const appUrl = getConfig().publicRuntimeConfig.APP_URL;

export const Header: FC = () => (
  <div className={styles.header}>
    <PageHeader
      title={<Logo />}
      extra={[
        <Button
          key="discord"
          type="text"
          href={deworkSocialLinks.discord}
          icon={<DiscordIcon />}
          target="_blank"
        >
          Discord
        </Button>,
        <Button key="app" type="primary" href={appUrl} target="_blank">
          Open App
        </Button>,
      ]}
      style={{ width: "100%", padding: 0 }}
      className={"max-w-xl mx-auto"}
    />
  </div>
);
