import { TaskViewType } from "@dewo/app/graphql/types";
import { Form, Radio } from "antd";
import React, { FC } from "react";
import * as Icons from "@ant-design/icons";

export const TaskViewTypeRadioGroup: FC = () => (
  <Form.Item key="type" name="type" style={{ margin: 0 }}>
    <Radio.Group buttonStyle="solid" size="small">
      <Radio.Button
        value={TaskViewType.BOARD}
        style={{
          minWidth: 80,
          display: "inline-grid",
          placeItems: "center",
        }}
      >
        <Icons.ProjectOutlined style={{ marginRight: 4 }} />
        Board
      </Radio.Button>
      <Radio.Button
        value={TaskViewType.LIST}
        style={{
          minWidth: 80,
          display: "inline-grid",
          placeItems: "center",
        }}
      >
        <Icons.UnorderedListOutlined style={{ marginRight: 4 }} />
        List
      </Radio.Button>
    </Radio.Group>
  </Form.Item>
);
