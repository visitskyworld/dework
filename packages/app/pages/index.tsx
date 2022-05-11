import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { LandingPage } from "@dewo/app/containers/landingPage/LandingPage";
import { Header } from "@dewo/app/containers/navigation/header/Header";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";

const Page: NextPage = () => {
  const { user } = useAuthContext();
  return (
    <Layout>
      {!!user && <Sidebar />}
      <Layout.Content style={{ display: "flex", flexDirection: "column" }}>
        <Header />
        <LandingPage />
      </Layout.Content>
    </Layout>
  );
};

export default Page;
