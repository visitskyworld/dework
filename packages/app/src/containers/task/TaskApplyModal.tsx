import { DiscordGuildMembershipState, Task } from "@dewo/app/graphql/types";
import { Modal, Row, Spin, Typography } from "antd";
import React, { FC, useCallback } from "react";
import { useCreateTaskApplication, useTask } from "./hooks";
import { Form, Button, Input } from "antd";
import { DatePicker } from "antd";
import moment from "moment";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useProject } from "../project/hooks";
import {
  useAddUserToDiscordGuild,
  useDiscordGuildMembershipState,
} from "../integrations/hooks";
import { useRouter } from "next/router";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { Constants } from "@dewo/app/util/constants";

interface Props {
  taskId: string;
  visible: boolean;
  onCancel(event: any): void;
  onDone(task: Task): unknown;
}

const ApplyToTaskContent: FC<Props> = ({ taskId, onDone }) => {
  const { user } = useAuthContext();
  const router = useRouter();

  const task = useTask(taskId);
  const { project } = useProject(task?.projectId);
  const membershipState = useDiscordGuildMembershipState(
    project?.organizationId
  );
  const addUserToDiscordGuild = useAddUserToDiscordGuild(
    project?.organizationId
  );

  const createTaskApplication = useCreateTaskApplication();
  const handleSubmit = useCallback(
    async (input) => {
      const claimedTask = await createTaskApplication({
        taskId: task!.id,
        userId: user!.id,
        message: input.message,
        startDate: input.dates[0],
        endDate: input.dates[1],
      });
      if (membershipState === DiscordGuildMembershipState.HAS_SCOPE) {
        await addUserToDiscordGuild().catch();
      }
      await onDone(claimedTask);
    },
    [
      createTaskApplication,
      onDone,
      addUserToDiscordGuild,
      membershipState,
      task,
      user,
    ]
  );

  if (!membershipState) {
    return (
      <div style={{ display: "grid" }}>
        <Spin />
      </div>
    );
  }

  if (membershipState === DiscordGuildMembershipState.MISSING_SCOPE) {
    return (
      <Row align="middle" style={{ flexDirection: "column" }}>
        <Typography.Paragraph style={{ textAlign: "center" }}>
          To apply to this task you need to first join our Discord server!
        </Typography.Paragraph>
        <Button
          type="primary"
          size="large"
          icon={<DiscordIcon />}
          children="Connect to Discord"
          href={`${
            Constants.GRAPHQL_API_URL
          }/auth/discord-join-guild?state=${JSON.stringify({
            redirect: router.asPath,
          })}`}
        />
      </Row>
    );
  }

  return (
    <Form layout="vertical" requiredMark={false} onFinish={handleSubmit}>
      <Form.Item
        name="dates"
        label="When are you claiming this task for?"
        rules={[{ required: true, message: "Please enter a date" }]}
      >
        <DatePicker.RangePicker
          name="period"
          disabledDate={(current) => current <= moment().add(-1, "days")}
        />
      </Form.Item>
      <Form.Item name="message" label="Message">
        <Input.TextArea
          autoSize
          className="dewo-field"
          placeholder="Please tell us or show us something similar you've done in the past (max 200 chars)"
          style={{ minHeight: 120 }}
          maxLength={200}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" size="large" block>
        I'm Interested
      </Button>
    </Form>
  );
};

export const TaskApplyModal: FC<Props> = (props) => {
  return (
    <Modal
      title="Apply for Task"
      visible={props.visible}
      destroyOnClose
      onCancel={props.onCancel}
      footer={null}
    >
      <ApplyToTaskContent {...props} />
    </Modal>
  );
};
