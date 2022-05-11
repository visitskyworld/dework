import React, { FC, useMemo } from "react";
import { PageHeader, Tabs, Typography } from "antd";
import { TaskUpdateModalListener } from "../task/TaskUpdateModal";
import { ProjectDiscoveryList } from "../discovery/ProjectDiscoveryList";
import styles from "./LandingPage.module.less";
import { TaskDiscoveryList } from "../discovery/TaskDiscoveryList";
import { RecommendedDAOsList } from "../discovery/RecommendedDAOsList";
import { ThreepidSource } from "@dewo/app/graphql/types";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { ThreepidAuthButton } from "../auth/buttons/ThreepidAuthButton";

export const LandingPage: FC = () => {
  const { user } = useAuthContext();
  const isConnectedToDiscord = useMemo(
    () => !!user?.threepids.some((t) => t.source === ThreepidSource.discord),
    [user]
  );
  return (
    <>
      <PageHeader />
      <Tabs centered className={styles.tabs}>
        <Tabs.TabPane tab="🌍 Popular DAOs" key="projects">
          <ProjectDiscoveryList />
        </Tabs.TabPane>
        <Tabs.TabPane tab="🔥 Open Bounties" key="bounties">
          <TaskDiscoveryList />
        </Tabs.TabPane>
        <Tabs.TabPane tab="🧭 Recommended" key="recommended">
          <div className="max-w-md mx-auto" style={{ textAlign: "center" }}>
            {isConnectedToDiscord ? (
              <RecommendedDAOsList />
            ) : (
              <>
                <Typography.Title level={3}>Recommended DAOs</Typography.Title>
                <Typography.Paragraph type="secondary" style={{ padding: 16 }}>
                  Link your Discord account to see a list of DAOs recommended
                  for you
                </Typography.Paragraph>
                <ThreepidAuthButton
                  source={ThreepidSource.discord}
                  children="Connect Discord"
                  type="primary"
                  size="large"
                />
              </>
            )}
          </div>
        </Tabs.TabPane>
      </Tabs>
      <TaskUpdateModalListener />
    </>
  );
};
