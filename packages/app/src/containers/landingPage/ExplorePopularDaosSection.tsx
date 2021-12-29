import { Col, Row, Typography } from "antd";
import React, { FC } from "react";
import { useFeaturedOrganizations } from "../organization/hooks";
import { OrganizationCard } from "./OrganizationCard";

const NUM_COLUMNS = 3;

export const ExplorePopularDaosSection: FC = () => {
  const organizations = useFeaturedOrganizations(4);
  return (
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
        <Row
          gutter={[16, 16]}
          style={{
            margin: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {organizations?.map((org) => (
            <Col xs={24} md={24 / NUM_COLUMNS} key={org.id}>
              <OrganizationCard organization={org} />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};
