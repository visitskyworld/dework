import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { Tag, Row, Typography } from "antd";
import {
  TaskStatusEnum,
  TaskRewardTrigger,
  TaskReward,
} from "@dewo/app/graphql/types";
import { formatTaskReward } from "./hooks";
import {
  paymentStatusToColor,
  paymentStatusToString,
  rewardTriggerToString,
  TaskRewardFormValues,
} from "./TaskRewardFormFields";
import { FormSection } from "@dewo/app/components/FormSection";
import { explorerLink } from "../payment/hooks";

export interface TaskFormValues {
  name: string;
  description: string;
  projectId?: string;
  status: TaskStatusEnum;
  tagIds: string[];
  assigneeIds: string[];
  ownerId?: string;
  reward?: TaskRewardFormValues;
}

interface Props {
  reward: TaskReward;
}

export const TaskRewardSummary: FC<Props> = ({ reward }) => {
  return (
    <FormSection label="Reward">
      <Row>
        <Typography.Text>
          {formatTaskReward(reward)} (
          {rewardTriggerToString[TaskRewardTrigger.CORE_TEAM_APPROVAL]})
        </Typography.Text>
      </Row>
      {!!reward.payment && (
        <>
          <Row>
            <Tag color={paymentStatusToColor[reward.payment.status]}>
              {paymentStatusToString[reward.payment.status]}
            </Tag>
          </Row>
          <Row>
            <a
              target="_blank"
              href={explorerLink(reward.payment)}
              rel="noreferrer"
            >
              <Typography.Text
                type="secondary"
                className="ant-typography-caption"
              >
                View on explorer <Icons.ExportOutlined />
              </Typography.Text>
            </a>
          </Row>
        </>
      )}
    </FormSection>
  );
};
