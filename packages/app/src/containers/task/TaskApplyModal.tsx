import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Task } from "@dewo/app/graphql/types";
import { Modal } from "antd";
import React, { FC, useCallback } from "react";
import { useClaimTask } from "./hooks";
import { Form, Button, Input } from "antd";

interface TaskApplyModalProps {
  task: Task;
  visible: boolean;
  onCancel(event: any): void;
  onDone(task: Task): unknown;
}

export const TaskApplyModal: FC<TaskApplyModalProps> = ({
  task,
  visible,
  onCancel,
  onDone,
}) => {
  const { user } = useAuthContext();
  const claimTask = useClaimTask();
  const handleSubmit = useCallback(
    async (input) => {
      const claimedTask = await claimTask(task, input.description);
      await onDone(claimedTask);
    },
    [claimTask, onDone]
  );
  return (
    <Modal
      title="Apply for Task"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={768}
    >
      <Form layout="vertical" requiredMark={false} onFinish={handleSubmit}>
        <Form.Item name="description" label={"Description"}>
          <Input.TextArea
            autoSize
            className="dewo-field"
            placeholder="Enter a description..."
            style={{ minHeight: 120 }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" size="large" block>
            Apply
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
