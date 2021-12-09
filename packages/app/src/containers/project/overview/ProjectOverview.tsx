import { Avatar, Layout, Tabs, Typography } from "antd";
import React, { FC } from "react";
import { useProject } from "../hooks";
import { CoverImageLayout } from "@dewo/app/components/CoverImageLayout";
import { ProjectTaskBoard } from "../board/ProjectTaskBoard";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useOrganization } from "../../organization/hooks";
import Link from "next/link";

interface Props {
  projectId: string;
}

export const ProjectOverview: FC<Props> = ({ projectId }) => {
  const project = useProject(projectId);
  const organization = useOrganization(project?.organizationId);
  return (
    <>
      <CoverImageLayout
        imageUrl="https://image.freepik.com/free-vector/gradient-liquid-abstract-background_23-2148902633.jpg"
        avatar={
          <Avatar.Group maxCount={3} size={128}>
            {organization?.users.map((user, index) => (
              <Link href={`/profile/${user.id}`}>
                <a>
                  <UserAvatar
                    key={user.id}
                    user={user}
                    style={index !== 0 ? { marginLeft: -48 } : undefined}
                  />
                </a>
              </Link>
            ))}
          </Avatar.Group>
        }
      >
        <Typography.Title level={3} style={{ textAlign: "center" }}>
          {project?.name}
        </Typography.Title>
      </CoverImageLayout>
      <Tabs defaultActiveKey="board" centered>
        <Tabs.TabPane tab="Activity" key="activity"></Tabs.TabPane>
        <Tabs.TabPane tab="Board" key="board">
          <Layout.Content className="max-w-lg mx-auto">
            <ProjectTaskBoard projectId={projectId} />
          </Layout.Content>
        </Tabs.TabPane>
        <Tabs.TabPane tab="About" key="about"></Tabs.TabPane>
      </Tabs>
    </>
  );
};
