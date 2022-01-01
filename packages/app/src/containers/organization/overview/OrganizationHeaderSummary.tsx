import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { List, Skeleton, Typography } from "antd";
import React, { FC } from "react";
import { useOrganization } from "../hooks";

interface Props {
  organizationId: string;
}

export const OrganizationHeaderSummary: FC<Props> = ({ organizationId }) => {
  const organization = useOrganization(organizationId);

  if (!organization) {
    return (
      <List.Item.Meta
        avatar={<Skeleton.Avatar active size={192} />}
        title={
          <Skeleton loading active paragraph={{ style: { maxWidth: 480 } }} />
        }
      />
    );
  }

  return (
    <List.Item.Meta
      avatar={<OrganizationAvatar organization={organization} size={192} />}
      title={
        <Typography.Title level={2} style={{ marginBottom: 0 }}>
          {organization.name}
        </Typography.Title>
      }
      description={
        <>
          <Typography.Paragraph
            type="secondary"
            style={{ marginBottom: 8, maxWidth: 480 }}
            ellipsis={{ rows: 4 }}
          >
            {organization.description}
          </Typography.Paragraph>
          {/* <UserDetails
            isEditMode={false}
            userDetails={[
              {
                __typename: "UserDetail",
                id: "1",
                type: UserDetailType.website,
                value: "https://www.citydao.io",
              },
              {
                __typename: "UserDetail",
                id: "1",
                type: UserDetailType.github,
                value: "https://github.com/deworkxyz",
              },
            ]}
          /> */}
        </>
      }
    />
  );
};
