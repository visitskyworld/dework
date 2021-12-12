import Link from "next/link";
import React, { FC } from "react";
import { Avatar, Card, Row, Tag, Typography } from "antd";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { OrganizationDetails, User } from "../../graphql/types";

interface Props {
  organization: OrganizationDetails;
  users: User[];
}

export const OrganizationCard: FC<Props> = ({ organization, users }) => {
  return (
    <Link href={`/organization/${organization.id}`}>
      <a>
        <Card className="hover:component-highlight">
          <img
            src={
              organization.imageUrl ??
              "https://uploads-ssl.webflow.com/60e348808bfdf75f90faaf77/611366105e70cd7e2b27223a_city-green.png"
            }
            alt={organization.name}
            style={{ borderRadius: "50%", width: "100px", height: "100px" }}
          />
          <Typography.Title
            level={4}
            ellipsis={{
              rows: 1,
            }}
          >
            {organization.name}
          </Typography.Title>
          <Typography.Paragraph>
            {organization.description ?? "Lorem ipsum dolor sit amet"}
          </Typography.Paragraph>
          <Row align="middle">
            <Avatar.Group maxCount={3} style={{ flex: 1 }}>
              {users.map((user) => (
                <UserAvatar key={user.id} user={user} />
              ))}
            </Avatar.Group>
            <Tag className="bg-primary">
              {`📦 ${organization.projects.length} projects`}
            </Tag>
            <Tag className="bg-secondary">
              {`🧑‍💻 ${organization.members.length} members`}
            </Tag>
          </Row>
        </Card>
      </a>
    </Link>
  );
};
