import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { Header } from "@dewo/app/containers/navigation/header/Header";
import { UserProfile } from "@dewo/app/containers/user/UserProfile";
import { useRouter } from "next/router";

const Page: NextPage = () => {
  const userId = useRouter().query.userId as string;
  return (
    <Layout>
      <Header />
      <Layout.Content>
        <UserProfile userId={userId} />
      </Layout.Content>
    </Layout>
  );
};

export default Page;
