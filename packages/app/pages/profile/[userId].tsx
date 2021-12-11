import React from "react";
import { NextPage } from "next";
import { Layout, Tabs } from "antd";
import { useRouter } from "next/router";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { UserProfile } from "@dewo/app/containers/user/UserProfile";
import { UserTaskBoard } from "@dewo/app/containers/user/UserTaskBoard";

const Page: NextPage = () => {
  const userId = useRouter().query.userId as string;
  return (
    <Layout>
      <Sidebar />
      <Layout.Content>
        <UserProfile userId={userId} />
        <Tabs defaultActiveKey="board" centered>
          <Tabs.TabPane tab="Activity" key="activity"></Tabs.TabPane>
          <Tabs.TabPane tab="Board" key="board">
            <Layout.Content className="max-w-lg mx-auto">
              <UserTaskBoard userId={userId} />
            </Layout.Content>
          </Tabs.TabPane>
          <Tabs.TabPane tab="About" key="about"></Tabs.TabPane>
        </Tabs>
      </Layout.Content>
    </Layout>
  );
};

export default Page;
