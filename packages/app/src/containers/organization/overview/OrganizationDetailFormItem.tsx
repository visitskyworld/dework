import React, { FC } from "react";
import { Form, Input, Row } from "antd";
import {
  iconByType,
  placeholderByType,
} from "@dewo/app/components/EntityDetailAvatar";
import { EntityDetailType } from "../../../graphql/types";

interface Props {
  type:
    | EntityDetailType.discord
    | EntityDetailType.twitter
    | EntityDetailType.website;
}

export const OrganizationDetailFormItem: FC<Props> = ({ type }) => {
  return (
    <Row align="middle">
      {iconByType[type]}
      <Form.Item name={type} style={{ flex: 1, margin: 0, marginLeft: 8 }}>
        <Input placeholder={placeholderByType[type]} />
      </Form.Item>
    </Row>
  );
};
