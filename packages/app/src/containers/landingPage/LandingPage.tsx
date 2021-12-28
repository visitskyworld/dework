import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import * as Icons from "@ant-design/icons";
import {
  Button,
  Image,
  Col,
  Divider,
  PageHeader,
  Row,
  Space,
  Typography,
  Modal,
  Tabs,
  Avatar,
} from "antd";
import React, { FC, useCallback, useRef } from "react";
import { useFeaturedOrganizations } from "../organization/hooks";
import { OrganizationCard } from "./OrganizationCard";
import { siteTitle } from "@dewo/app/util/constants";
import { DeworkIcon } from "@dewo/app/components/icons/Dework";
import { LoginButton } from "../auth/LoginButton";
import { useToggle } from "@dewo/app/util/hooks";
import YouTube from "react-youtube";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";

const NUM_COLUMNS = 3;

export const LandingPage: FC = () => {
  const { user } = useAuthContext();
  const organizations = useFeaturedOrganizations(4);

  const watchVideoDemo = useToggle();
  const youtubeRef = useRef<YouTube>(null);
  const closeVideoDemoModal = useCallback(() => {
    watchVideoDemo.toggleOff();
    youtubeRef.current?.getInternalPlayer().pauseVideo();
  }, [watchVideoDemo]);

  return (
    <>
      <PageHeader
        title={
          <Row align="middle">
            <DeworkIcon style={{ width: 24, height: 24, marginRight: 8 }} />
            <Typography.Title level={4} style={{ margin: 0 }}>
              {siteTitle}
            </Typography.Title>
          </Row>
        }
        extra={[
          !user && (
            <LoginButton key="log-in" type="text">
              Log In
            </LoginButton>
          ),
          !user && (
            <LoginButton key="get-started" type="primary">
              Get Started
            </LoginButton>
          ),
        ]}
        style={{ width: "100%" }}
        className="max-w-xl mx-auto"
      />
      <Row className="max-w-xl mx-auto" style={{ width: "100%" }}>
        <Col md={12} xs={24} style={{ padding: "96px 24px" }}>
          <Space direction="vertical" size="large">
            <Typography.Title level={1}>
              A web3-native Asana with crypto payments, credentialing, bounties
              and more
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
              <Button
                type="text"
                size="large"
                icon={<Icons.PlayCircleOutlined />}
                onClick={watchVideoDemo.toggleOn}
              >
                Watch Video
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
              tab="Crypto Payments"
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
      <Row
        style={{
          padding: "64px 24px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <Col className="max-w-lg mx-auto" style={{ width: "100%" }}>
          <Typography.Title
            level={4}
            style={{ textAlign: "center", width: "100%" }}
          >
            Explore some popular DAOs
          </Typography.Title>
          <Row gutter={[16, 16]} style={{ margin: 0, width: "100%" }}>
            {organizations?.map((org) => (
              <Col xs={24} md={24 / NUM_COLUMNS} key={org.id}>
                <OrganizationCard organization={org} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Row
        className="max-w-xl mx-auto"
        style={{ padding: "64px 24px", width: "100%" }}
      >
        <Space>
          <Typography.Text>
            Have questions or feedback? Reach out on Twitter or Discord
          </Typography.Text>
          <a
            href="https://twitter.com/deworkxyz"
            target="_blank"
            rel="noreferrer"
          >
            <Avatar size="small">
              <Icons.TwitterOutlined />
            </Avatar>
          </a>
          <a
            href="https://discord.gg/gvfMCyxs"
            target="_blank"
            rel="noreferrer"
          >
            <Avatar size="small">
              <DiscordIcon />
            </Avatar>
          </a>
        </Space>
      </Row>
      <Modal
        visible={watchVideoDemo.isOn}
        footer={null}
        bodyStyle={{ padding: 0 }}
        width="min(1280px, 100vw)"
        onCancel={closeVideoDemoModal}
      >
        <YouTube
          ref={youtubeRef}
          videoId="4hwQznYw9FM"
          opts={{
            width: "100%",
            height: "720",
            playerVars: { autoplay: 1 },
          }}
        />
      </Modal>
    </>
  );
};
