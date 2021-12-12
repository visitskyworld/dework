import Link from "next/link";
import React, { FC } from "react";
import { Card, Row, Tag, Typography } from "antd";
import { OrganizationDetails } from "../../graphql/types";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";

interface Props {
  organization: OrganizationDetails;
}

export const OrganizationCard: FC<Props> = ({ organization }) => {
  return (
    <Link href={`/organization/${organization.id}`}>
      <a>
        <Card className="hover:component-highlight">
          <OrganizationAvatar size={100} organization={organization} />
          <Typography.Title
            level={4}
            ellipsis={{
              rows: 1,
            }}
          >
            {organization.name}
          </Typography.Title>
          <Typography.Paragraph>
            {organization.description}
          </Typography.Paragraph>
          <Row align="middle">
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
