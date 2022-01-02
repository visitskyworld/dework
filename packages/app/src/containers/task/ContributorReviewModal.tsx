import { Task } from "@dewo/app/graphql/types";
import { Modal, Col, Rate } from "antd";
import React, { FC, useCallback, useState } from "react";
import { useUpdateTask } from "./hooks";
import { Form, Button, Input } from "antd";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";

interface ContributorReviewModalProps {
  task: Task;
  visible: boolean;
  onCancel(event: any): void;
  onDone(): void;
}

export const ContributorReviewModal: FC<ContributorReviewModalProps> = ({
  task,
  visible,
  onCancel,
  onDone,
}) => {
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { user } = useAuthContext();
  const updateTask = useUpdateTask();
  const handleSubmit = useCallback(
    async (input) => {
      if (isSubmittingReview) {
        await updateTask(
          {
            id: task.id,
            review: {
              message: input.message,
              rating: input.rating,
              reviewerId: user?.id,
            },
          },
          task
        );
      }
      onDone();
    },
    [task, updateTask, onDone, isSubmittingReview, user]
  );

  return (
    <Col onClick={stopPropagation}>
      <Modal
        title="Review Task"
        visible={visible}
        onCancel={onCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          requiredMark={false}
          onFinish={handleSubmit}
          onValuesChange={(_, allVals) =>
            setIsSubmittingReview(allVals.message || allVals.rating)
          }
        >
          <Form.Item name="rating" label="Rating">
            <Rate />
          </Form.Item>
          <Form.Item name="message" label="Review">
            <Input.TextArea
              autoSize
              className="dewo-field"
              placeholder="How did the contributor do? (max 160 chars)"
              style={{ minHeight: 120 }}
              maxLength={160}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large" block>
            {isSubmittingReview ? "Submit review" : "Submit without review"}
          </Button>
        </Form>
      </Modal>
    </Col>
  );
};
