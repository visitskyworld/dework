import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Avatar, Card, PageHeader, Row, Space, Typography } from "antd";
import { siteTitle } from "@dewo/app/util/constants";
import { DeworkIcon } from "@dewo/app/components/icons/Dework";
import { LoginButton } from "../auth/LoginButton";
import { ExplorePopularDaosSection } from "./ExplorePopularDaosSection";
import { LandingPageFooter } from "./Footer";
import { ProductSection } from "./ProductSection";
import { CreateOrganizationButton } from "../navigation/CreateOrganizationButton";

export const LandingPage: FC = () => {
  const { user } = useAuthContext();
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
            <LoginButton key="get-started" type="primary">
              Connect
            </LoginButton>
          ),
        ]}
        style={{ width: "100%" }}
        className="max-w-xl mx-auto"
      />
      {!!user ? (
        <Row
          style={{ minHeight: "50vh", display: "grid", placeItems: "center" }}
        >
          <CreateOrganizationButton
            type="text"
            style={{
              height: "unset",
              margin: "0 auto",
              width: 512,
              padding: 0,
            }}
          >
            <Card>
              <Space direction="vertical" align="center">
                <Avatar size={96} style={{ fontSize: 48 }}>
                  <Icons.PlusOutlined />
                </Avatar>
                <Typography.Title level={3} style={{ marginTop: 16 }}>
                  Set up DAO
                </Typography.Title>
              </Space>
            </Card>
          </CreateOrganizationButton>
        </Row>
      ) : (
        <ProductSection />
      )}
      <ExplorePopularDaosSection />
      <LandingPageFooter />
    </>
  );
};
