import React, { FC, Fragment, useMemo } from "react";
import { Form, Row, Space, Typography } from "antd";
import { Task } from "@dewo/app/graphql/types";
import { FormSection } from "@dewo/app/components/FormSection";
import { TaskRewardTag } from "../../TaskRewardTag";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { TaskRewardFormFields, validator } from "./TaskRewardFormFields";
import { TaskRewardFormValues } from "../types";
import { PaymentRow } from "@dewo/app/containers/payment/PaymentRow";
import { formatTaskRewardAsUSD } from "../../hooks";
import _ from "lodash";

interface Props {
  projectId: string;
  task: Task | undefined;
  value: TaskRewardFormValues | undefined;
}

export function useCanUpdateTaskReward(task: Task | undefined): boolean {
  const canCreateReward = usePermission("create", "TaskReward");
  const hasPaidReward = useMemo(
    () => !!task?.rewards.some((r) => !!r.payments.length),
    [task?.rewards]
  );
  return !!canCreateReward && !hasPaidReward;
}

export const TaskRewardSection: FC<Props> = ({ projectId, task, value }) => {
  const canUpdate = useCanUpdateTaskReward(task);

  if (canUpdate) {
    return (
      <Form.Item
        name="reward"
        label="Bounty"
        rules={[{ validator, validateTrigger: "onSubmit" }]}
      >
        <TaskRewardFormFields projectId={projectId} value={value} />
      </Form.Item>
    );
  }

  if (!!task?.rewards.length) {
    return (
      <FormSection label="Reward">
        <Space direction="vertical" size={4}>
          {task.rewards.map((reward) => (
            <Fragment key={reward.id}>
              <Row>
                <TaskRewardTag reward={reward} />
                {!reward.payments.length &&
                  !reward.peggedToUsd &&
                  !!reward.token.usdPrice && (
                    <Typography.Text
                      type="secondary"
                      className="ant-typography-caption"
                    >
                      ({formatTaskRewardAsUSD(reward)})
                    </Typography.Text>
                  )}
              </Row>
              {_.uniqBy(reward.payments, (p) => p.payment.id).map((p) => (
                <PaymentRow key={p.id} payment={p.payment} />
              ))}
            </Fragment>
          ))}
        </Space>
      </FormSection>
    );
  }

  return null;
};
