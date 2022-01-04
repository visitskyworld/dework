import React, { FC, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { Form, Avatar, Input, Space, Typography, Row } from "antd";

import { EntityDetailType, EntityDetail } from "../../graphql/types";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";

const iconByType: Record<EntityDetailType, JSX.Element> = {
  [EntityDetailType.twitter]: <Icons.TwitterOutlined />,
  [EntityDetailType.github]: <Icons.GithubOutlined />,
  [EntityDetailType.discord]: <DiscordIcon />,
  [EntityDetailType.linkedin]: <Icons.LinkedinFilled />,
  [EntityDetailType.website]: <Icons.LinkOutlined />,
  [EntityDetailType.location]: <Icons.EnvironmentOutlined />,
};

const placeholderByType: Record<EntityDetailType, string> = {
  [EntityDetailType.twitter]: "https://twitter.com/lastcontrarian",
  [EntityDetailType.github]: "https://github.com/vbuterin",
  [EntityDetailType.discord]: "https://discord.com/users/123",
  [EntityDetailType.linkedin]: "https://www.linkedin.com/in/balajissrinivasan",
  [EntityDetailType.website]: "https://my-site.com",
  [EntityDetailType.location]: "Lisbon, Portugal",
};

interface EntityDetailsProps {
  isEditMode: boolean;
  userDetails: EntityDetail[];
}

export const UserDetails: FC<EntityDetailsProps> = ({
  isEditMode,
  userDetails,
}) => {
  const locationDetailType = useMemo(() => EntityDetailType.location, []);
  const locationDetail = useMemo(
    () => userDetails.find((detail) => detail.type === locationDetailType),
    [userDetails, locationDetailType]
  );

  if (userDetails.length === 0 && !isEditMode) return null;

  if (isEditMode) {
    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        {Object.values(EntityDetailType).map(
          (type) =>
            type !== locationDetailType && (
              <Row align="middle">
                {iconByType[type]}
                <Form.Item name={type} style={{ flex: 1, margin: "0 0 0 8px" }}>
                  <Input
                    placeholder={placeholderByType[type]}
                    className="dewo-field dewo-field-profile ant-typography-p"
                  />
                </Form.Item>
              </Row>
            )
        )}
        <Row align="middle">
          {iconByType[locationDetailType]}
          <Form.Item
            name={locationDetailType}
            style={{ flex: 1, margin: "0 0 0 8px" }}
          >
            <Input
              placeholder={placeholderByType[locationDetailType]}
              className="dewo-field dewo-field-profile ant-typography-p"
            />
          </Form.Item>
        </Row>
      </Space>
    );
  }

  return (
    <Space>
      {userDetails.map(
        (detail, index) =>
          detail.type !== locationDetailType && (
            <a href={detail.value} target="_blank" key={index} rel="noreferrer">
              <Avatar size="small">{iconByType[detail.type]}</Avatar>
            </a>
          )
      )}
      {locationDetail && (
        <Space align="center" size={4} style={{ marginTop: 2 }}>
          {iconByType[locationDetailType]}
          <Typography.Text
            type="secondary"
            ellipsis
            style={{ maxWidth: "160px" }}
          >
            {locationDetail.value}
          </Typography.Text>
        </Space>
      )}
    </Space>
  );
};
