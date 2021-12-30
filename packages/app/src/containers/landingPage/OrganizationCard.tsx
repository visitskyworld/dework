import Link from "next/link";
import React, { FC, useMemo } from "react";
import { AvatarProps, Card, List, Row, Tag, Typography } from "antd";
import { OrganizationDetails } from "../../graphql/types";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { TitleProps } from "antd/lib/typography/Title";

interface Props {
  organization: OrganizationDetails;
  avatar?: AvatarProps;
  title?: TitleProps;
}

export const OrganizationCard: FC<Props> = ({
  organization,
  avatar,
  title,
}) => {
  const openBountiesCount = useMemo(
    () =>
      organization.projects
        .map((p) => p.openBountyTaskCount)
        .reduce((a, b) => a + b, 0),
    [organization]
  );
  return (
    <Link href={organization.permalink}>
      <a>
        <Card
          size="small"
          style={{ paddingTop: 8, paddingBottom: 8 }}
          className="hover:component-highlight"
        >
          <List.Item.Meta
            avatar={
              <OrganizationAvatar {...avatar} organization={organization} />
            }
            title={
              <Typography.Title
                {...title}
                ellipsis={{ rows: 1 }}
                style={{ marginBottom: 0 }}
              >
                {organization.name}
              </Typography.Title>
            }
            description={
              <>
                <Typography.Paragraph
                  type="secondary"
                  ellipsis={{ rows: 3 }}
                  style={{ lineHeight: "130%", marginBottom: 4 }}
                >
                  {organization.description}
                </Typography.Paragraph>
                <Row align="middle" gutter={[8, 8]}>
                  {!!openBountiesCount && (
                    <Tag color="green">
                      {`${openBountiesCount} open bounties`}
                    </Tag>
                  )}
                  <Tag color="yellow">
                    {`${organization.members.length} contributors`}
                  </Tag>
                </Row>
              </>
            }
          />
        </Card>
      </a>
    </Link>
  );
};
