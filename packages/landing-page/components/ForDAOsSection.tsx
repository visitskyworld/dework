import React, { ReactNode, FC } from "react";
import { Typography, Layout, Row, Col, Card, List } from "antd";
import * as Icons from "@ant-design/icons";
import styles from "./LandingPage.module.less";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";

const boxes: {
  title: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    title: "Discord Integration",
    description:
      "Discuss Dework tasks in Discord threads, notify members when new bounties are available, and more",
    icon: <DiscordIcon />,
  },
  {
    title: "Sync with Github",
    description:
      "Dework syncs Github issues, branches and pull requests with Dework tasks",
    icon: <Icons.GithubOutlined />,
  },
  {
    title: "Pay with your wallet",
    description:
      "Dework works with Gnosis Safe, Metamask, Wallet Connect, Phantom, and more",
    icon: <Icons.WalletOutlined />,
  },
];

export const ForDAOsSection: FC = () => (
  <Layout.Content className={styles.darkSection}>
    <Typography.Title
      level={3}
      style={{ textAlign: "center", marginBottom: 24 }}
    >
      Built for decentralized organizations
    </Typography.Title>
    <Row
      gutter={[32, 16]}
      className="w-full max-w-lg"
      style={{ marginRight: "auto", marginLeft: "auto" }}
    >
      {boxes.map((box, index, { length }) => (
        <Col span={24} md={24 / length} key={index}>
          <Card bordered={false} className={styles.featureBox}>
            <List.Item.Meta
              avatar={box.icon}
              title={
                <Typography.Title level={5} style={{ marginBottom: 0 }}>
                  {box.title}
                </Typography.Title>
              }
              description={box.description}
            />
          </Card>
        </Col>
      ))}
    </Row>
  </Layout.Content>
);
