import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { useRouter } from "next/router";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { UserProfile } from "@dewo/app/containers/user/UserProfile";

const Page: NextPage = () => {
  const userId = useRouter().query.userId as string;
  return (
    <Layout>
      <Sidebar />
      <Layout.Content style={{ marginTop: 40 }}>
        <UserProfile userId={userId} />
      </Layout.Content>
    </Layout>
  );
};

export default Page;
