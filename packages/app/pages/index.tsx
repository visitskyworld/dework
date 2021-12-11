import React from "react";
import { NextPage } from "next";
import { Layout, Row } from "antd";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { LandingPage } from "@dewo/app/containers/landingPage/LandingPage";

const Page: NextPage = () => {
  return (
    <Layout>
      <Sidebar />
      <Layout.Content>
        <Row className="max-w-lg mx-auto" style={{ paddingTop: 40 }}>
          <LandingPage />
        </Row>
      </Layout.Content>
    </Layout>
  );
};

export default Page;
