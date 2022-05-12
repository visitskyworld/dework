import React, { FC } from "react";
import { Form, Row, Space, Typography } from "antd";
import { Task } from "@dewo/app/graphql/types";
import { FormSection } from "@dewo/app/components/FormSection";
import { TaskRewardTag } from "../../TaskRewardTag";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { TaskRewardFormFields, validator } from "./TaskRewardFormFields";
import { TaskRewardFormValues } from "../types";
import { PaymentRow } from "@dewo/app/containers/payment/PaymentRow";
import { formatTaskRewardAsUSD } from "../../hooks";

interface Props {
  projectId: string;
  task: Task | undefined;
  value: TaskRewardFormValues | undefined;
}

export function useCanUpdateTaskReward(task: Task | undefined): boolean {
  const canCreateReward = usePermission("create", "TaskReward");
  return !!canCreateReward && !task?.reward?.payment;
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

  if (!!task?.reward) {
    return (
      <FormSection label="Reward">
        <Space direction="vertical" size={4}>
          <Row>
            <TaskRewardTag reward={task.reward} />
            {!task.reward.payment &&
              !task.reward.peggedToUsd &&
              !!task.reward.token.usdPrice && (
                <Typography.Text
                  type="secondary"
                  className="ant-typography-caption"
                >
                  ({formatTaskRewardAsUSD(task.reward)})
                </Typography.Text>
              )}
          </Row>
          {!!task.reward.payment && (
            <PaymentRow payment={task.reward.payment} />
          )}
        </Space>
      </FormSection>
    );
  }

  return null;
};
