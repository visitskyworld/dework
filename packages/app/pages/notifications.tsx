import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { Header } from "@dewo/app/containers/navigation/header/Header";
import { NotificationList } from "@dewo/app/containers/notification/NotificationList";

const Page: NextPage = () => {
  return (
    <Layout.Content style={{ overflowY: "auto" }}>
      <Header />
      <div className="mx-auto max-w-sm w-full" style={{ padding: 8 }}>
        <NotificationList />
      </div>
    </Layout.Content>
  );
};

export default Page;
