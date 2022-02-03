import { LoginModal } from "@dewo/app/containers/auth/LoginModal";
import { useToggle } from "@dewo/app/util/hooks";
import { Constants } from "@dewo/app/util/constants";
import {
  Image,
  Col,
  Button,
  Divider,
  Row,
  Space,
  Typography,
  Tabs,
} from "antd";
import React, { FC, useState } from "react";
import { WatchDemoButton } from "./WatchDemoButton";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

interface Props {
  appUrl: string;
}

export const ProductSection: FC<Props> = () => {
  const loginModal = useToggle();
  const [onboardingFlow, setOnboardingFlow] = useState<string>();
  const screens = useBreakpoint();
  return (
    <Row className="max-w-xl mx-auto" style={{ width: "100%" }}>
      <Col md={12} xs={24} style={{ padding: "96px 24px" }}>
        <Space direction="vertical" size="large">
          <Typography.Title level={1}>
            A web3-native Trello with token payments, credentialing, bounties
            and more
          </Typography.Title>
          <Row>
            <Row style={{ width: 100 }}>
              <Divider />
            </Row>
            <Typography.Paragraph style={{ fontSize: "150%" }}>
              Manage your tasks and bounties in one place. Get contributor
              applicants, sync with Discord, boost the reputation of
              contributors, and pay with your own DAO's tokens.{" "}
              <WatchDemoButton />
            </Typography.Paragraph>
          </Row>

          <Space
            align={screens.xs ? undefined : "start"}
            style={{ width: "100%", textAlign: "center" }}
            size={screens.xs ? 0 : 16}
            direction={screens.xs ? "vertical" : "horizontal"}
          >
            <Col>
              <Button
                type="primary"
                size="large"
                block
                onClick={() => {
                  setOnboardingFlow("dao");
                  loginModal.toggleOn();
                }}
              >
                Setup DAO
              </Button>
              <Typography.Paragraph
                type="secondary"
                style={{ margin: 0, textAlign: "center", marginTop: 4 }}
              >
                (takes 1 min)
              </Typography.Paragraph>
            </Col>
            <Typography.Paragraph style={{ marginTop: 8 }}>
              or
            </Typography.Paragraph>
            <Button
              size="large"
              block
              onClick={() => {
                setOnboardingFlow("import");
                loginModal.toggleOn();
              }}
            >
              Import Notion/Trello board
            </Button>
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
            <Image width="100%" src="/crypto-payments.jpeg" />
            <Typography.Paragraph
              type="secondary"
              style={{
                textAlign: "center",
                fontSize: "130%",
                marginTop: 16,
              }}
            >
              Pay contributors directly using your Gnosis Safe, Metamask or
              Phantom Wallet
            </Typography.Paragraph>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="Profile building"
            key="profile-building"
            style={{ padding: 8 }}
          >
            <Image width="100%" src="/profile.jpeg" />
            <Typography.Paragraph
              type="secondary"
              style={{
                textAlign: "center",
                fontSize: "130%",
                marginTop: 16,
              }}
            >
              Build your web3 profile & reputation
            </Typography.Paragraph>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="Community voting"
            key="community-voting"
            style={{ padding: 8 }}
          >
            <Image width="100%" src="/voting.jpeg" />
            <Typography.Paragraph
              type="secondary"
              style={{
                textAlign: "center",
                fontSize: "130%",
                marginTop: 16,
              }}
            >
              Let the community vote on bug fixes and feature requests.
            </Typography.Paragraph>
          </Tabs.TabPane>
        </Tabs>
      </Col>

      <LoginModal
        toggle={loginModal}
        redirectUrl={`${Constants.APP_URL}/onboarding/${onboardingFlow ?? ""}`}
        onAuthedWithWallet={(threepidId) => {
          const state = JSON.stringify({
            redirect: `/onboarding/${onboardingFlow ?? ""}`,
          });
          window.location.href = `${Constants.APP_URL}/auth/3pid/${threepidId}?state=${state}`;
        }}
      />
    </Row>
  );
};
