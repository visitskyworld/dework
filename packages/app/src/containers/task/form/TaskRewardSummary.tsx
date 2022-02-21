import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { Row, Typography } from "antd";
import { TaskReward } from "@dewo/app/graphql/types";
import { formatTaskReward } from "../hooks";
import { FormSection } from "@dewo/app/components/FormSection";
import { explorerLink } from "../../payment/hooks";
import { PaymentStatusTag } from "@dewo/app/components/PaymentStatusTag";

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
            <PaymentStatusTag status={reward.payment.status} />
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
