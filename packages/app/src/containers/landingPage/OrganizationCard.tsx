import Link from "next/link";
import React, { FC } from "react";
import { Card, Col, Row, Space, Tag, Typography } from "antd";
import { OrganizationDetails } from "../../graphql/types";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";

interface Props {
  organization: OrganizationDetails;
}

export const OrganizationCard: FC<Props> = ({ organization }) => {
  return (
    <Link href={`/o/${organization.slug}`}>
      <a>
        <Card
          size="small"
          style={{ paddingTop: 8, paddingBottom: 8 }}
          className="hover:component-highlight"
        >
          <Space>
            <OrganizationAvatar size={72} organization={organization} />
            <Col>
              <Typography.Title
                level={4}
                ellipsis={{ rows: 1 }}
                style={{ marginBottom: 0 }}
              >
                {organization.name}
              </Typography.Title>
              <Typography.Paragraph type="secondary" ellipsis={{ rows: 3 }}>
                {organization.description}
              </Typography.Paragraph>
              <Row align="middle" gutter={[8, 8]}>
                {!!organization.projects.length && (
                  <Tag color="green">
                    {`${organization.projects.length} open bounties`}
                  </Tag>
                )}
                <Tag color="yellow">
                  {`${organization.members.length} contributors`}
                </Tag>
                <Tag color="blue">{`17 tasks last week`}</Tag>
              </Row>
            </Col>
          </Space>
        </Card>
      </a>
    </Link>
  );
};
