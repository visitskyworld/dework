import React, { FC, ReactNode } from "react";
import { Grid, Tabs, Button, List, Typography, Col, Row, Image } from "antd";
import * as Icons from "@ant-design/icons";
import styles from "./LandingPage.module.less";
import classNames from "classnames";
import getConfig from "next/config";

const appUrl = getConfig().publicRuntimeConfig.APP_URL;
const createProjectUrl = `${appUrl}/auth`;
const bountiesUrl = `${appUrl}/bounties`;

interface RowProps {
  title: string;
  imageUrl: string;
  cta: string;
  href: string;
  usps: {
    icon: ReactNode;
    description: string;
  }[];
}

const FeatureSection: FC<RowProps> = ({ title, imageUrl, cta, href, usps }) => (
  <Row
    gutter={[32, 16]}
    className={styles.featureRow}
    style={{ marginLeft: 0, marginRight: 0 }}
  >
    <Col
      md={8}
      span={24}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography.Title level={3}>{title}</Typography.Title>
      {usps.map(({ icon, description }, index) => (
        <List.Item key={index}>
          <List.Item.Meta
            avatar={
              <Typography.Text className="text-primary">{icon}</Typography.Text>
            }
            description={description}
          />
        </List.Item>
      ))}
      <Button
        size="large"
        type="primary"
        href={href}
        block={Grid.useBreakpoint().md === false}
        style={{ marginTop: 16, alignSelf: "flex-start" }}
      >
        {cta}
      </Button>
    </Col>
    <Col md={16} span={24}>
      <Image src={imageUrl} wrapperClassName={styles.borderedImage} />
    </Col>
  </Row>
);

export const FeatureTabsSecton: FC = () => {
  return (
    <Tabs
      centered
      animated
      className={classNames("w-full max-w-xl mx-auto", styles.tabs)}
    >
      <Tabs.TabPane key="core" tab="For Project Leaders">
        <FeatureSection
          title="✅ Manage tasks and bounties"
          imageUrl="/overview.jpeg"
          cta="Create Project"
          href={createProjectUrl}
          usps={[
            {
              icon: <Icons.SoundOutlined />,
              description:
                "Clearly communicate your project roadmap and what work needs to be done",
            },
            {
              icon: <Icons.DeploymentUnitOutlined />,
              description:
                "Share context on ongoing initiatives and make it easy to involve new and existing contributors",
            },
          ]}
        />
        <FeatureSection
          title="🔍 Find the right contributors"
          imageUrl="/profile.jpeg"
          cta="Create Project"
          href={createProjectUrl}
          usps={[
            {
              icon: <Icons.SmileOutlined />,
              description:
                "Let your community apply to tasks. Easily view their profile and work history before assigning them",
            },
            {
              icon: <Icons.LockOutlined />,
              description: "Gate access using Discord roles or token holdings",
            },
          ]}
        />
        <FeatureSection
          title="💰 Built-in bounties workflow"
          imageUrl="/pay-bounty.jpeg"
          cta="Create Project"
          href={createProjectUrl}
          usps={[
            {
              icon: <Icons.WalletOutlined />,
              description:
                "Add bounties to tasks and pay them directly through Dework. Connect your Gnosis Safe and batch pay bounties to save on gas fees.",
            },
            {
              icon: <Icons.DollarOutlined />,
              description:
                "Pay with any on-chain token, including your DAO native token",
            },
          ]}
        />
      </Tabs.TabPane>
      <Tabs.TabPane key="contributor" tab="For Contributors">
        <FeatureSection
          title="✨ The easiest way to contribute"
          imageUrl="/open-bounties.jpeg"
          cta="Explore Bounties"
          href={bountiesUrl}
          usps={[
            {
              icon: <Icons.SearchOutlined />,
              description:
                "Find bounties and projects in 100s of DAOs in our global bounty board",
            },
            {
              icon: <Icons.TrophyOutlined />,
              description: "Apply to tasks or submit contest bounties",
            },
          ]}
        />
        <FeatureSection
          title="🤑 Get paid and build your on-chain CV"
          imageUrl="/on-chain-cv.jpeg"
          cta="Explore Bounties"
          href={bountiesUrl}
          usps={[
            {
              icon: <Icons.WalletOutlined />,
              description:
                "Get paid directly to your wallet after completing a task",
            },
            {
              icon: <Icons.SafetyCertificateOutlined />,
              description: "Tasks you complete are stored on-chain",
            },
          ]}
        />
        <FeatureSection
          title="🌍 Track everything in one place"
          imageUrl="/task-board.jpeg"
          cta="Explore Bounties"
          href={bountiesUrl}
          usps={[
            {
              icon: <Icons.BellOutlined />,
              description:
                "Stay up to date with new opportunities in your task feed",
            },
            {
              icon: <Icons.ProjectOutlined />,
              description: "All your tasks in your task board",
            },
          ]}
        />
      </Tabs.TabPane>
    </Tabs>
  );
};
