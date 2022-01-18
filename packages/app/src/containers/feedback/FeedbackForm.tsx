import React, { FC } from "react";
import { Input, Typography, Form, Col, Button, message, Row } from "antd";
import { useToggle } from "@dewo/app/util/hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { EntityDetailType } from "../../graphql/types";
import { useForm } from "antd/lib/form/Form";
import { usePostFeedbackToDiscord } from "./hooks";

interface FeedbackFormValues {
  discordUsername?: string;
  feedbackContent: string;
}

interface FeedbackFormProps {
  onClose(): void;
}

export const FeedbackForm: FC<FeedbackFormProps> = ({ onClose }) => {
  const [form] = useForm<FeedbackFormValues>();
  const { user } = useAuthContext();
  const loading = useToggle();
  const postFeedbackToDiscord = usePostFeedbackToDiscord();
  const initialValues: FeedbackFormValues = {
    discordUsername: user?.details.find(
      (d) => d.type === EntityDetailType.discord
    )?.value,
    feedbackContent: "",
  };

  const handleSubmitForm = async (values: FeedbackFormValues) => {
    loading.toggleOn();
    try {
      await postFeedbackToDiscord(values);
      message.success("Feedback submitted successfully!");
    } catch {
      message.error("Feedback submission failed");
    } finally {
      onClose();
      form.setFieldsValue(initialValues);
      loading.toggleOff();
    }
  };

  const handleCancelForm = () => {
    loading.toggleOff();
    onClose();
  };

  return (
    <Form form={form} initialValues={initialValues} onFinish={handleSubmitForm}>
      <Col>
        <Typography.Title level={5}>Discord username</Typography.Title>
        <Form.Item name="discordUsername">
          <Input placeholder="vitalik.eth#4242" />
        </Form.Item>
      </Col>
      <Col>
        <Typography.Title level={5}>Suggestion or question</Typography.Title>
        <Form.Item
          name="feedbackContent"
          rules={[
            {
              required: true,
              message: "Please input your feedback",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
      </Col>
      <Row style={{ marginTop: 32, flexDirection: "row-reverse", gap: 16 }}>
        <Button
          type="primary"
          size="middle"
          loading={loading.isOn}
          htmlType="submit"
        >
          Submit
        </Button>
        <Button
          type="text"
          size="middle"
          disabled={loading.isOn}
          onClick={handleCancelForm}
        >
          Cancel
        </Button>
      </Row>
    </Form>
  );
};
