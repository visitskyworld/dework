import {
  GetFeaturedOrganizationsQuery,
  GetFeaturedOrganizationsQueryVariables,
  OrganizationDetails,
} from "@dewo/app/graphql/types";
import { Col, Row, Typography } from "antd";
import React, { FC } from "react";
import { OrganizationCard } from "./OrganizationCard";
import { useQuery } from "@apollo/client";
import * as Queries from "@dewo/app/graphql/queries";

const NUM_COLUMNS = 3;

export function useFeaturedOrganizations(
  limit: number
): OrganizationDetails[] | undefined {
  const { data } = useQuery<
    GetFeaturedOrganizationsQuery,
    GetFeaturedOrganizationsQueryVariables
  >(Queries.featuredOrganizations, { variables: { limit } });
  return data?.organizations;
}

export const ExplorePopularDaosSection: FC = () => {
  const organizations = useFeaturedOrganizations(9);
  return (
    <Row
      style={{
        padding: "64px 24px",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      }}
    >
      <Col className="max-w-lg mx-auto" style={{ width: "100%" }}>
        <Typography.Title
          level={3}
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
              <OrganizationCard
                organization={org}
                avatar={{ size: 72 }}
                title={{ level: 4 }}
              />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};
