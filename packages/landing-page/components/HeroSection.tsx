import React, { FC } from "react";
import getConfig from "next/config";
import { Image, Button, Row, Typography, Layout } from "antd";
import styles from "./LandingPage.module.less";

const appUrl = getConfig().publicRuntimeConfig.APP_URL;

export const HeroSection: FC = () => {
  return (
    <>
      <Layout.Content className={styles.hero}>
        <Typography.Title
          level={1}
          className="max-w-md mx-auto w-full"
          style={{ marginTop: 16, marginBottom: 16 }}
        >
          Web3-native project management with token payments, credentialing,
          bounties
        </Typography.Title>
        <Typography.Paragraph
          type="secondary"
          className="max-w-sm mx-auto w-full"
          style={{ fontSize: "130%", marginBottom: 32 }}
        >
          Create bounties for contributors, let contributors build their web3
          profile and pay with your own DAO token.
          {/* Get contributor applicants, sync with Discord, boost the reputation of
          contributors, and pay with your own DAO's tokens */}
        </Typography.Paragraph>
        <Row justify="center" style={{ columnGap: 32 }}>
          <Button type="primary" size="large" href={`${appUrl}/auth`}>
            Create Project
          </Button>
          <Button type="default" size="large" href={`${appUrl}/bounties`}>
            Explore Bounties
          </Button>
        </Row>
      </Layout.Content>
      <Layout.Content
        className="max-w-lg mx-auto w-full"
        style={{ textAlign: "center", padding: 16, marginTop: 32 }}
      >
        <Image src="/board.jpeg" wrapperClassName={styles.borderedImage} />
      </Layout.Content>
    </>
  );
};
