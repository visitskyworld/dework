import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { Header } from "@dewo/app/containers/navigation/header/Header";
import { useRouter } from "next/router";
import { ProjectBoard } from "@dewo/app/containers/project/board/ProjectBoard";

const Page: NextPage = () => {
  // const [tasks, setTasks] = useState<Task[]>(
  //   require("@dewo/demos/citydao.json").tasks
  // );

  const projectId = useRouter().query.projectId as string;
  return (
    <Layout>
      {/* <Layout.Header> */}
      <Header />
      {/* </Layout.Header> */}
      <Layout.Content>
        {/* <TaskBoard tasks={tasks} onChange={setTasks} /> */}
        <ProjectBoard projectId={projectId} />
      </Layout.Content>
    </Layout>
  );
};

export default Page;
