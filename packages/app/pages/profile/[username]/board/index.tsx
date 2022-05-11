import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { useRouter } from "next/router";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import {
  useUserByUsername,
  useUserTasks,
} from "@dewo/app/containers/user/hooks";
import { Header } from "@dewo/app/containers/navigation/header/Header";
import { TaskViewTabs } from "@dewo/app/containers/task/views/TaskViewTabs";
import { UserTaskViewProvider } from "@dewo/app/containers/task/views/TaskViewContext";
import { TaskViewLayout } from "@dewo/app/containers/task/views/TaskViewLayout";

const Page: NextPage = () => {
  const username = useRouter().query.username as string;
  const user = useUserByUsername(username);

  const tasks = useUserTasks(user?.id);

  return (
    <Layout>
      <Sidebar />
      <Layout.Content style={{ display: "flex", flexDirection: "column" }}>
        <Header
          title="My Task Board"
          className="bg-body-secondary"
          style={{ paddingBottom: 0 }}
        />
        <UserTaskViewProvider userId={user?.id}>
          <TaskViewTabs userId={user?.id}>
            <TaskViewLayout tasks={tasks} />
          </TaskViewTabs>
        </UserTaskViewProvider>
      </Layout.Content>
    </Layout>
  );
};

export default Page;
