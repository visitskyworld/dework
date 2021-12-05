import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { Header } from "@dewo/app/containers/navigation/header/Header";

const Page: NextPage = () => {
  return (
    <Layout>
      <Header />
      <Layout.Content>Select a project in the menu</Layout.Content>
    </Layout>
  );
};

export default Page;
