import { Project } from "@dewo/app/graphql/types";
import { Avatar, Card, Row, Tag, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import React, { FC } from "react";
import Link from "next/link";

interface Props {
  project: Project;
}

export const ProjectCard: FC<Props> = ({ project }) => {
  return (
    <Link
      href={`/organization/${project.organizationId}/project/${project.id}`}
    >
      <a>
        <Card>
          <Typography.Title level={4}>{project.name}</Typography.Title>

          <Typography.Paragraph type="secondary" ellipsis={{ rows: 4 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Typography.Paragraph>

          <Row align="middle">
            <Avatar.Group maxCount={3} style={{ flex: 1 }}>
              {[1, 2, 3, 4].map((i) => (
                <Avatar key={i} icon={<Icons.UserOutlined />} />
              ))}
            </Avatar.Group>
            <Tag color="#f00333">2 open bounties</Tag>
          </Row>
        </Card>
      </a>
    </Link>
  );
};
