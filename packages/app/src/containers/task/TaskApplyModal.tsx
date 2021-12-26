import { Task } from "@dewo/app/graphql/types";
import { Modal, Col } from "antd";
import React, { FC, useCallback } from "react";
import { useClaimTask } from "./hooks";
import { Form, Button, Input } from "antd";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { DatePicker } from "antd";
import moment from "moment";

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
      const claimedTask = await claimTask(task, {
        message: input.message,
        startDate: input.dates[0],
        endDate: input.dates[1],
      });
      await onDone(claimedTask);
    },
    [claimTask, onDone, task]
  );

  const { RangePicker } = DatePicker;

  return (
    <Col onClick={stopPropagation}>
      <Modal
        title="Apply for Task"
        visible={visible}
        onCancel={onCancel}
        footer={null}
      >
        <Form layout="vertical" requiredMark={false} onFinish={handleSubmit}>
          <Form.Item
            name="dates"
            label={"When are you claiming this task for?"}
            rules={[{ required: true, message: "Please enter a date" }]}
          >
            <RangePicker
              name="period"
              disabledDate={(current) => current <= moment().add(-1, "days")}
            />
          </Form.Item>
          <Form.Item
            name="message"
            label={"Message"}
            rules={[{ required: true, message: "Please enter a message" }]}
          >
            <Input.TextArea
              autoSize
              className="dewo-field"
              placeholder="Please tell us or show us something similar you've done in the past (max 200 chars)"
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
