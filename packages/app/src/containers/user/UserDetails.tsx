import React, { FC, useMemo } from "react";
import { Form, Input, Space, Typography, Row } from "antd";

import { EntityDetailType, EntityDetail } from "../../graphql/types";
import {
  EntityDetailAvatar,
  iconByType,
  placeholderByType,
} from "@dewo/app/components/EntityDetailAvatar";

interface EntityDetailsProps {
  isEditMode: boolean;
  userDetails: EntityDetail[];
}

export const UserDetails: FC<EntityDetailsProps> = ({
  isEditMode,
  userDetails,
}) => {
  const locationDetailType = EntityDetailType.location;
  const locationDetail = useMemo(
    () => userDetails.find((detail) => detail.type === locationDetailType),
    [userDetails, locationDetailType]
  );
  const discordDetailType = EntityDetailType.discord;
  const discordDetail = useMemo(
    () => userDetails.find((detail) => detail.type === discordDetailType),
    [userDetails, discordDetailType]
  );

  if (userDetails.length === 0 && !isEditMode) return null;

  if (isEditMode) {
    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        {Object.values(EntityDetailType).map(
          (type) =>
            ![locationDetailType, discordDetailType].includes(type) && (
              <Row align="middle">
                {iconByType[type]}
                <Form.Item
                  name={type}
                  style={{ flex: 1, margin: "0 0 0 8px" }}
                  rules={[
                    {
                      type: "url",
                      required: false,
                      message: "Please enter a valid URL.",
                    },
                  ]}
                >
                  <Input
                    placeholder={placeholderByType[type]}
                    className="dewo-field dewo-field-profile ant-typography-p"
                  />
                </Form.Item>
              </Row>
            )
        )}
        <Row align="middle">
          {iconByType[discordDetailType]}
          <Form.Item
            name={discordDetailType}
            style={{ flex: 1, margin: "0 0 0 8px" }}
            rules={[
              {
                type: "regexp",
                required: false,
                pattern: /.*#[0-9]{4}/,
                message: "Please enter a valid Discord username.",
              },
            ]}
          >
            <Input
              placeholder={placeholderByType[discordDetailType]}
              className="dewo-field dewo-field-profile ant-typography-p"
            />
          </Form.Item>
        </Row>
        <Row align="middle">
          {iconByType[locationDetailType]}
          <Form.Item
            name={locationDetailType}
            style={{ flex: 1, margin: "0 0 0 8px" }}
            rules={[{ required: false, type: "string" }]}
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
        (detail) =>
          ![locationDetailType, discordDetailType].includes(detail.type) && (
            <EntityDetailAvatar entityDetail={detail} key={detail.id} />
          )
      )}
      {discordDetail && (
        <EntityDetailAvatar
          key={discordDetail.id}
          entityDetail={discordDetail}
          copyToClipboard
        />
      )}
      {locationDetail && (
        <Space
          align="center"
          size={4}
          style={{ marginTop: 2 }}
          key={locationDetail.id}
        >
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
