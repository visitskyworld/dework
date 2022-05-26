import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { useRouter } from "next/router";

import { Header } from "@dewo/app/containers/navigation/header/Header";
import { TaskViewTabs } from "@dewo/app/containers/task/views/TaskViewTabs";
import { WorkspaceTaskViewProvider } from "@dewo/app/containers/task/views/TaskViewContext";
import { TaskViewLayout } from "@dewo/app/containers/task/views/TaskViewLayout";
import {
  useWorkspaceDetails,
  useWorkspaceTasks,
} from "@dewo/app/containers/workspace/hooks";

const Page: NextPage = () => {
  const workspaceSlug = useRouter().query.workspaceSlug as string;
  const workspace = useWorkspaceDetails(workspaceSlug);
  const tasks = useWorkspaceTasks(workspaceSlug);
  return (
    <Layout>
      <Layout.Content style={{ display: "flex", flexDirection: "column" }}>
        <Header
          title="Combined Board"
          className="bg-body-secondary"
          style={{ paddingBottom: 0 }}
        />
        {!!workspace && (
          <WorkspaceTaskViewProvider workspace={workspace}>
            <TaskViewTabs workspaceId={workspace.id}>
              <TaskViewLayout tasks={tasks} />
            </TaskViewTabs>
          </WorkspaceTaskViewProvider>
        )}
      </Layout.Content>
    </Layout>
  );
};

export default Page;
