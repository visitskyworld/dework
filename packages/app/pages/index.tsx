import React from "react";
import { NextPage } from "next";
import { Layout, Row } from "antd";
import { Header } from "@dewo/app/containers/navigation/header/Header";
import { LandingPage } from "@dewo/app/containers/landingPage/LandingPage";

const Page: NextPage = () => {
  return (
    <Layout>
      <Header />
      <Layout.Content>
        <Row className="max-w-lg mx-auto">
          <LandingPage />
        </Row>
      </Layout.Content>
    </Layout>
  );
};

export default Page;
