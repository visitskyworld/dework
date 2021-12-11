import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { useRouter } from "next/router";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { ProjectTaskBoard } from "@dewo/app/containers/project/board/ProjectTaskBoard";
import { ProjectHeader } from "@dewo/app/containers/project/overview/ProjectHeader";

const Page: NextPage = () => {
  const projectId = useRouter().query.projectId as string;
  return (
    <Layout>
      <Sidebar />
      <Layout.Content>
        <ProjectHeader projectId={projectId} />
        <ProjectTaskBoard projectId={projectId} />
      </Layout.Content>
    </Layout>
  );
};

export default Page;
