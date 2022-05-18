import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { useRouter } from "next/router";
import { UserProfile } from "@dewo/app/containers/user/UserProfile";
import { useUserByUsername } from "@dewo/app/containers/user/hooks";
import { UserSeo } from "@dewo/app/containers/seo/UserSeo";
import { Header } from "@dewo/app/containers/navigation/header/Header";

const Page: NextPage = () => {
  const router = useRouter();
  const username = router.query.username as string;
  const user = useUserByUsername(username);

  return (
    <Layout>
      <Layout.Content style={{ overflowY: "auto" }}>
        <Header />
        {!!user && <UserProfile key={username} userId={user?.id} />}
      </Layout.Content>

      {!!user && <UserSeo user={user} />}
    </Layout>
  );
};

export default Page;
