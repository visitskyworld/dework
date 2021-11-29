import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { Header } from "@dewo/app/containers/navigation/header/Header";

const Page: NextPage = () => {
  return (
    <Layout>
      {/* <Layout.Header> */}
      <Header />
      {/* </Layout.Header> */}
      <Layout.Content>pls sign in</Layout.Content>
    </Layout>
  );
};

export default Page;
