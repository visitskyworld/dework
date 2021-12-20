import React, { FC } from "react";
import {
  TaskRewardTrigger,
  UpdateTaskRewardInput,
} from "@dewo/app/graphql/types";
import { Form, InputNumber, Select, Space } from "antd";
import * as Icons from "@ant-design/icons";

export const rewardTriggerToString: Record<TaskRewardTrigger, string> = {
  [TaskRewardTrigger.CORE_TEAM_APPROVAL]: "Core team approval",
  [TaskRewardTrigger.PULL_REQUEST_MERGED]: "PR merged",
};

interface Props {
  value?: UpdateTaskRewardInput;
}

export const TaskRewardFormFields: FC<Props> = ({ value }) => {
  return (
    <>
      <Form.Item name={["reward", "amount"]} label="Bounty">
        <InputNumber
          placeholder="Enter amount"
          value={value?.amount}
          addonAfter={
            <Form.Item
              name={["reward", "currency"]}
              noStyle
              rules={[
                {
                  required: !!value?.amount,
                  message: "Select a currency",
                },
              ]}
            >
              <Select style={{ minWidth: 70 }} placeholder="Currency">
                <Select.Option value="ETH">ETH</Select.Option>
                <Select.Option value="USDC">USDC</Select.Option>
                <Select.Option value="SOL">SOL</Select.Option>
                <Select.Option value="HNY">HNY</Select.Option>
              </Select>
            </Form.Item>
          }
        />
      </Form.Item>
      <Form.Item
        name={["reward", "trigger"]}
        label="Payout trigger"
        rules={[
          {
            required: !!value?.amount,
            message: "Please enter a payout trigger",
          },
        ]}
        hidden={!value?.amount}
      >
        <Select optionFilterProp="label" placeholder="Select payout trigger">
          {[
            {
              label:
                rewardTriggerToString[TaskRewardTrigger.CORE_TEAM_APPROVAL],
              value: TaskRewardTrigger.CORE_TEAM_APPROVAL,
              icon: Icons.TeamOutlined,
            },
            {
              label:
                rewardTriggerToString[TaskRewardTrigger.PULL_REQUEST_MERGED],
              value: TaskRewardTrigger.PULL_REQUEST_MERGED,
              icon: Icons.GithubOutlined,
            },
          ].map((tag) => (
            <Select.Option key={tag.value} value={tag.value} label={tag.label}>
              <Space style={{ alignItems: "center" }}>
                <tag.icon />
                {tag.label}
              </Space>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};
