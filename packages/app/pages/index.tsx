import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { LandingPage } from "@dewo/app/containers/landingPage/LandingPage";

const Page: NextPage = () => {
  return (
    <Layout>
      <Sidebar />
      <Layout.Content>
        <LandingPage />
      </Layout.Content>
    </Layout>
  );
};

export default Page;
