import React, { useState } from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { TaskBoard } from "@dewo/app/components/TaskBoard";
import { Task } from "@dewo/app/types/api";
import { Header } from "@dewo/app/components/Header";

const Home: NextPage = () => {
  const [tasks, setTasks] = useState<Task[]>(
    require("@dewo/demos/test.json").tasks
  );

  return (
    <Layout>
      {/* <Layout.Header> */}
      <Header />
      {/* </Layout.Header> */}
      <Layout.Content>
        <TaskBoard tasks={tasks} onChange={setTasks} />
      </Layout.Content>
    </Layout>
  );
};

export default Home;
