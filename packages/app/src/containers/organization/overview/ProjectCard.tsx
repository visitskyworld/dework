import { Project, User } from "@dewo/app/graphql/types";
import { Avatar, Card, Progress, Row, Tag, Typography } from "antd";
import React, { FC } from "react";
import Link from "next/link";
import { UserAvatar } from "@dewo/app/components/UserAvatar";

interface Props {
  project: Project;
  // TODO(fant): get this from the project instead of from the org through a prop
  users: User[];
}

export const ProjectCard: FC<Props> = ({ project, users }) => {
  return (
    <Link
      href={`/organization/${project.organizationId}/project/${project.id}`}
    >
      <a>
        <Card className="hover:component-highlight">
          <Typography.Title level={4} style={{ marginBottom: 0 }}>
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
              {users.map((user) => (
                <UserAvatar key={user.id} user={user} linkToProfile />
              ))}
            </Avatar.Group>
            <Tag className="bg-primary">2 open bounties</Tag>
          </Row>
        </Card>
      </a>
    </Link>
  );
};
