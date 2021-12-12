import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Button, Col, Divider, Row, Space, Typography } from "antd";
import React, { FC } from "react";
import { UserTaskBoard } from "../user/UserTaskBoard";
import { useFeaturedOrganizations } from "../organization/hooks";
import { OrganizationCard } from "./OrganizationCard";
import { OrganizationDetails } from "../../graphql/types";
import { siteTitle, siteDescription } from "@dewo/app/util/constants";

export const LandingPage: FC = () => {
  const { user } = useAuthContext();
  const featuredOrganizations = useFeaturedOrganizations(4) || [];

  if (!user)
    return (
      <Row
        style={{
          maxWidth: "740px",
          width: "100%",
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        <Space direction="vertical" style={{ flex: 1 }}>
          <Typography.Title
            level={1}
            style={{ width: "100%", maxWidth: "100%", textAlign: "center" }}
          >
            {siteTitle}
          </Typography.Title>
          <Typography.Paragraph
            style={{ fontSize: "1.5em", textAlign: "center", width: "100%" }}
          >
            {siteDescription}
          </Typography.Paragraph>
          <Row style={{ flexDirection: "column", alignItems: "center" }}>
            <Button type="primary" size="large" href="/auth">
              Log in
            </Button>
          </Row>
          <Divider />
          <Typography.Title
            level={2}
            style={{ textAlign: "center", width: "100%" }}
          >
            Popular DAOs
          </Typography.Title>
          <Row gutter={[16, 16]}>
            {featuredOrganizations.map((org) => (
              <Col span={12} key={org.name}>
                <OrganizationCard organization={org} />
              </Col>
            ))}
          </Row>
        </Space>
      </Row>
    );

  return (
    <Space direction="vertical">
      <Typography.Title
        level={3}
        style={{ textAlign: "center", width: "100%" }}
      >
        Your tasks for today
      </Typography.Title>
      <UserTaskBoard userId={user.id} />
    </Space>
  );
};
