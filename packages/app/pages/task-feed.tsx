import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { Header } from "@dewo/app/containers/navigation/header/Header";
import { RecommendedTasksList } from "@dewo/app/containers/task/feed/RecommendedTasksList";

const Page: NextPage = () => (
  <Layout>
    <Layout.Content style={{ overflowY: "auto", paddingBottom: 80 }}>
      <Header />
      <div
        className="mx-auto max-w-md w-full"
        style={{ paddingLeft: 12, paddingRight: 12 }}
      >
        <RecommendedTasksList />
      </div>
    </Layout.Content>
  </Layout>
);

export default Page;
