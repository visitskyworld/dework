import Link from "next/link";
import React, { FC } from "react";
import { Avatar, AvatarProps, Card, List, Typography } from "antd";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { TitleProps } from "antd/lib/typography/Title";
import { GetFeaturedOrganizationsQuery } from "@dewo/app/graphql/types";
import { UserAvatar } from "@dewo/app/components/UserAvatar";

interface Props {
  organization: GetFeaturedOrganizationsQuery["organizations"][number];
  avatar?: AvatarProps;
  title?: TitleProps;
}

export const OrganizationCard: FC<Props> = ({
  organization,
  avatar,
  title,
}) => (
  <Link href={organization.permalink}>
    <a>
      <Card
        size="small"
        style={{ paddingTop: 8, paddingBottom: 8, height: "100%" }}
        bodyStyle={{ height: "100%" }}
        className="hover:component-highlight"
      >
        <List.Item.Meta
          style={{ height: "100%" }}
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
              <Avatar.Group maxCount={5} size="small">
                {organization.users.map((u) => (
                  <UserAvatar key={u.id} user={u} linkToProfile />
                ))}
              </Avatar.Group>
            </>
          }
        />
      </Card>
    </a>
  </Link>
);
