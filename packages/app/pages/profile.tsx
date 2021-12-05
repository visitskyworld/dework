import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { Header } from "@dewo/app/containers/navigation/header/Header";
import { UserProfile } from "@dewo/app/containers/user/UserProfile";

const Page: NextPage = () => {
  return (
    <Layout>
      <Header />
      <Layout.Content>
        <UserProfile />
      </Layout.Content>
    </Layout>
  );
};

export default Page;
