import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Col, Divider, Row, Space, Typography } from "antd";
import React, { FC } from "react";
import { UserTaskBoard } from "../user/UserTaskBoard";
import { siteTitle, siteDescription } from "../../../pages/copy";
import { usePopularOrganizations } from "../organization/hooks";
import { OrganizationCard } from "./OrganizationCard";
import { OrganizationDetails } from "../../graphql/types";

const OrganizationGrid: FC<{ orgs: OrganizationDetails[] }> = ({ orgs }) => {
  const columns = 2;
  const rows = [...Array(Math.ceil(orgs.length / columns))];
  const productRows = rows.map((_, idx) =>
    orgs.slice(idx * columns, idx * columns + columns)
  );

  const content = productRows.map((row, idx) => (
    <Row
      gutter={16}
      style={{ justifyContent: "center", marginBottom: "16px" }}
      key={idx}
    >
      {row.map((org) => (
        <Col span={12} key={org.name}>
          <OrganizationCard
            organization={org}
            users={[]} // TODO
          />
        </Col>
      ))}
    </Row>
  ));
  return <>{content}</>;
};

export const LandingPage: FC = () => {
  const { user } = useAuthContext();

  const popularOrganizations = usePopularOrganizations(4) || [];

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
          <Divider />
          <Typography.Title
            level={2}
            style={{ textAlign: "center", width: "100%" }}
          >
            Popular DAOs
          </Typography.Title>
          <OrganizationGrid orgs={popularOrganizations} />
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
