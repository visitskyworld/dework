import { Avatar, Card, Progress, Row, Tag, Typography } from "antd";
import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { ProjectDetails, ProjectVisibility } from "@dewo/app/graphql/types";
import Link from "next/link";
import { UserAvatar } from "@dewo/app/components/UserAvatar";

interface Props {
  project: ProjectDetails;
}

export const ProjectListRow: FC<Props> = ({ project }) => (
  <Link href={project.permalink}>
    <a>
      <Card
        size="small"
        className="hover:component-highlight"
        style={{ padding: 8 }}
      >
        <Row style={{ alignItems: "center" }}>
          <Row style={{ flex: 1 }}>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              {project.name}
            </Typography.Title>
            {project.visibility === ProjectVisibility.PRIVATE && (
              <Tag
                className="bg-component"
                style={{ marginLeft: 16 }}
                icon={<Icons.LockOutlined />}
              >
                Private
              </Tag>
            )}
            {!!project.openBountyTaskCount && (
              <Tag className="bg-primary" style={{ marginLeft: 16 }}>
                {project.openBountyTaskCount === 1
                  ? "1 open bounty"
                  : `${project.openBountyTaskCount} open bounties`}
              </Tag>
            )}
          </Row>
          <div style={{ flex: 1 }} />
          <Progress
            size="small"
            percent={
              !!project.taskCount
                ? (project.doneTaskCount / project.taskCount) * 100
                : undefined
            }
            showInfo={false}
            style={{ flex: 1 }}
          />
          <Avatar.Group
            size="small"
            maxCount={5}
            style={{
              width: 104,
              marginLeft: 16,
              justifyContent: "flex-end",
            }}
          >
            {project.members.map((member) => (
              <UserAvatar key={member.id} user={member.user} linkToProfile />
            ))}
          </Avatar.Group>
        </Row>
      </Card>
    </a>
  </Link>
);
