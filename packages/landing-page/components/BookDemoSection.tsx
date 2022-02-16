import { Button, Col, Row, Typography } from "antd";
import React, { FC } from "react";
import Link from "next/link";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";

export const BookDemoSection: FC = () => {
  return (
    <Row style={{ padding: "64px 24px" }}>
      <Col className="max-w-sm mx-auto" style={{ width: "100%" }}>
        <Typography.Title
          level={3}
          style={{ textAlign: "center", width: "100%" }}
        >
          See how Dework can help your DAO
        </Typography.Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Link href="https://calendly.com/dework">
              <a target="_blank">
                <Button type="primary" size="large" block>
                  Schedule a Demo
                </Button>
              </a>
            </Link>
          </Col>
          <Col xs={24} sm={12}>
            <Link href="http://discord.gg/wjSnYC6Q">
              <a target="_blank">
                <Button size="large" block icon={<DiscordIcon />}>
                  Join our Discord
                </Button>
              </a>
            </Link>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
