import { Image, Col, Divider, Row, Space, Typography, Tabs } from "antd";
import React, { FC } from "react";
import { LoginButton } from "../auth/LoginButton";
import { WatchDemoButton } from "./WatchDemoButton";

export const ProductSection: FC = () => {
  return (
    <Row className="max-w-xl mx-auto" style={{ width: "100%" }}>
      <Col md={12} xs={24} style={{ padding: "96px 24px" }}>
        <Space direction="vertical" size="large">
          <Typography.Title level={1}>
            A web3-native Asana with token payments, credentialing, bounties and
            more
          </Typography.Title>
          <Row>
            <Row style={{ width: 100 }}>
              <Divider />
            </Row>
            <Typography.Paragraph style={{ fontSize: "150%" }}>
              Manage your tasks and bounties in one place. Get contributor
              applicants, sync with Discord, boost the reputation of
              contributors, and pay with your own DAO's tokens
            </Typography.Paragraph>
          </Row>

          <Space>
            <LoginButton type="primary" size="large">
              Get Started
            </LoginButton>
            <WatchDemoButton />
          </Space>
        </Space>
      </Col>
      <Col
        md={12}
        xs={24}
        style={{ padding: 24, display: "grid", placeItems: "center" }}
      >
        <Tabs centered type="line" className="dewo-lp-feature-tabs">
          <Tabs.TabPane
            tab="Token Payments"
            key="crypto-payments"
            style={{ padding: 8 }}
          >
            <Image width="100%" src="/lp/crypto-payments.jpeg" />
            <Typography.Paragraph
              type="secondary"
              style={{
                textAlign: "center",
                fontSize: "130%",
                marginTop: 16,
              }}
            >
              Pay contributors directly with Metamask, Gnosis Safe or Phantom
              Wallet
            </Typography.Paragraph>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="Review Contributors"
            key="review-contributors"
            style={{ padding: 8 }}
          >
            <Image width="100%" src="/lp/review-contributors.jpeg" />
            <Typography.Paragraph
              type="secondary"
              style={{
                textAlign: "center",
                fontSize: "130%",
                marginTop: 16,
              }}
            >
              Let contributors find and apply to tasks. See their work history
              and assign the task to the most capable.
            </Typography.Paragraph>
          </Tabs.TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};
