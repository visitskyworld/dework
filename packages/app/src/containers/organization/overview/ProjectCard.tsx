import { ProjectDetails, ProjectVisibility } from "@dewo/app/graphql/types";
import { Avatar, Card, Progress, Row, Tag, Typography } from "antd";
import React, { FC } from "react";
import Link from "next/link";
import * as Icons from "@ant-design/icons";
import { UserAvatar } from "@dewo/app/components/UserAvatar";

interface Props {
  project: ProjectDetails;
}

export const ProjectCard: FC<Props> = ({ project }) => {
  return (
    <Link href={project.permalink}>
      <a>
        <Card className="hover:component-highlight h-full">
          <Typography.Title level={4} style={{ marginBottom: 0 }}>
            {project.visibility === ProjectVisibility.PRIVATE && (
              <Typography.Text type="secondary">
                <Icons.LockOutlined />
                {"  "}
              </Typography.Text>
            )}
            {project.name}
          </Typography.Title>
          <Progress
            size="small"
            percent={
              !!project.taskCount
                ? (project.doneTaskCount / project.taskCount) * 100
                : undefined
            }
            showInfo={false}
          />

          {/* <Typography.Paragraph type="secondary" ellipsis={{ rows: 4 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Typography.Paragraph> */}

          <Row align="middle">
            <Avatar.Group maxCount={3} style={{ flex: 1 }}>
              {project.members.map((member) => (
                <UserAvatar key={member.id} user={member.user} linkToProfile />
              ))}
            </Avatar.Group>
            {!!project.openBountyTaskCount && (
              <Tag className="bg-primary">
                {project.openBountyTaskCount === 1
                  ? "1 open bounty"
                  : `${project.openBountyTaskCount} open bounties`}
              </Tag>
            )}
          </Row>
        </Card>
      </a>
    </Link>
  );
};
