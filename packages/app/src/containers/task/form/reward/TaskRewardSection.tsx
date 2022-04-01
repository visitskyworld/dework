import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { Form, Row, Typography } from "antd";
import { Task } from "@dewo/app/graphql/types";
import { FormSection } from "@dewo/app/components/FormSection";
import { explorerLink } from "../../../payment/hooks";
import { PaymentStatusTag } from "@dewo/app/components/PaymentStatusTag";
import { TaskRewardTag } from "../../TaskRewardTag";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { TaskRewardFormFields, validator } from "./TaskRewardFormFields";
import { TaskRewardFormValues } from "../types";

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
        label="Task Reward"
        rules={[{ validator, validateTrigger: "onSubmit" }]}
      >
        <TaskRewardFormFields projectId={projectId} value={value} />
      </Form.Item>
    );
  }

  if (!!task?.reward) {
    return (
      <FormSection label="Reward">
        <Row>
          <TaskRewardTag reward={task.reward} />
        </Row>
        {!!task.reward.payment && (
          <>
            <Row>
              <PaymentStatusTag status={task.reward.payment.status} />
            </Row>
            <Row>
              <a
                target="_blank"
                href={explorerLink(task.reward.payment)}
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
  }

  return null;
};
