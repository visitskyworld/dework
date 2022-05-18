import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { Header } from "@dewo/app/containers/navigation/header/Header";
import { RecommendedTasksList } from "@dewo/app/containers/dashboard/RecommendedTasksList";

const Page: NextPage = () => (
  <Layout>
    <Layout.Content style={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <RecommendedTasksList />
    </Layout.Content>
  </Layout>
);

export default Page;
