import React, { FC } from "react";
import { Form, Input, Row } from "antd";
import { RuleType } from "rc-field-form/lib/interface";
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
  placeholder?: string;
  ruleType?: RuleType;
}

export const OrganizationDetailFormItem: FC<Props> = ({
  type,
  placeholder = placeholderByType[type],
  ruleType = "url",
}) => (
  <Row align="middle">
    {iconByType[type]}
    <Form.Item
      name={type}
      style={{ flex: 1, margin: 0, marginLeft: 8 }}
      rules={[
        {
          type: ruleType,
          required: false,
          message: "Please enter a valid URL.",
        },
      ]}
    >
      <Input placeholder={placeholder} />
    </Form.Item>
  </Row>
);
