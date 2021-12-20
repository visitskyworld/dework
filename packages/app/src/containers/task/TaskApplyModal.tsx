import { Task } from "@dewo/app/graphql/types";
import { Modal, Col } from "antd";
import React, { FC, useCallback } from "react";
import { useClaimTask } from "./hooks";
import { Form, Button, Input } from "antd";
import { stopPropagation } from "@dewo/app/util/eatClick";

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
  const claimTask = useClaimTask();
  const handleSubmit = useCallback(
    async (input) => {
      const claimedTask = await claimTask(task, input.description);
      await onDone(claimedTask);
    },
    [claimTask, onDone, task]
  );
  return (
    <Col onClick={stopPropagation}>
      <Modal
        title="Apply for Task"
        visible={visible}
        onCancel={onCancel}
        footer={null}
        width={768}
      >
        <Form layout="vertical" requiredMark={false} onFinish={handleSubmit}>
          <Form.Item
            name="description"
            label={"Application Message"}
            rules={[{ required: true, message: "Please enter a message" }]}
          >
            <Input.TextArea
              autoSize
              className="dewo-field"
              placeholder="Enter a message on why you should be picked to do this task (max 200 chars)"
              style={{ minHeight: 120 }}
              maxLength={200}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" size="large" block>
              Apply
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Col>
  );
};
