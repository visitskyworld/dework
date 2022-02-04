import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { Tag, Row, Typography, Tooltip } from "antd";
import { PaymentStatus, TaskReward } from "@dewo/app/graphql/types";
import { formatTaskReward } from "../hooks";
import {
  paymentStatusToColor,
  paymentStatusToString,
} from "./TaskRewardFormFields";
import { FormSection } from "@dewo/app/components/FormSection";
import { explorerLink } from "../../payment/hooks";

interface Props {
  reward: TaskReward;
}

export const TaskRewardSummary: FC<Props> = ({ reward }) => {
  return (
    <FormSection label="Reward">
      <Row>
        <Typography.Text>{formatTaskReward(reward)}</Typography.Text>
      </Row>
      {!!reward.payment && (
        <>
          <Row>
            <Tag color={paymentStatusToColor[reward.payment.status]}>
              {paymentStatusToString[reward.payment.status]}
              {reward.payment.status === PaymentStatus.PROCESSING && (
                <Tooltip title="Transactions are checked every minute, so it might take a few minutes before it shows up as confirmed in Dework.">
                  {"  "}
                  <Icons.QuestionCircleOutlined />
                </Tooltip>
              )}
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
