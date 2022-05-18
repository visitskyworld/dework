import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { LandingPage } from "@dewo/app/containers/landingPage/LandingPage";
import { Header } from "@dewo/app/containers/navigation/header/Header";

const Page: NextPage = () => {
  return (
    <Layout>
      <Layout.Content style={{ display: "flex", flexDirection: "column" }}>
        <Header />
        <LandingPage />
      </Layout.Content>
    </Layout>
  );
};

export default Page;
