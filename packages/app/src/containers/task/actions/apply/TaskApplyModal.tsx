import {
  DiscordGuildMembershipState,
  OrganizationIntegrationType,
  Task,
} from "@dewo/app/graphql/types";
import { Modal, notification, Row, Spin, Typography } from "antd";
import React, { FC, useMemo } from "react";
import { useCreateTaskApplication, useTask } from "../../hooks";
import { Form, Button, Input } from "antd";
import { DatePicker } from "antd";
import moment from "moment";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useProject } from "../../../project/hooks";
import { useRouter } from "next/router";
import { ThreepidSource } from "@dewo/app/graphql/types";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { Constants } from "@dewo/app/util/constants";
import {
  useAddUserToDiscordGuild,
  useDiscordGuildMembershipState,
} from "@dewo/app/containers/integrations/hooks";
import { useFollowOrganization } from "@dewo/app/containers/rbac/hooks";
import {
  useOrganization,
  useOrganizationIntegrations,
} from "@dewo/app/containers/organization/hooks";
import { useRunningCallback } from "@dewo/app/util/hooks";

interface FormValues {
  message: string;
  dates: [moment.Moment, moment.Moment];
}

interface Props {
  taskId: string | undefined;
  visible: boolean;
  onCancel(event: any): void;
  onDone(task: Task): unknown;
}

const ApplyToTaskContent: FC<Props> = ({ taskId, onDone }) => {
  const { user } = useAuthContext();
  const router = useRouter();

  const { task } = useTask(taskId);
  const { project } = useProject(task?.projectId);
  const organization = useOrganization(project?.organizationId);
  const isConnectedToDiscord = useMemo(
    () => !!user?.threepids.some((t) => t.source === ThreepidSource.discord),
    [user]
  );
  const hasDiscordIntegration = !!useOrganizationIntegrations(
    project?.organizationId,
    OrganizationIntegrationType.DISCORD
  )?.length;
  const membershipState = useDiscordGuildMembershipState(
    project?.organizationId
  );
  const addUserToDiscordGuild = useAddUserToDiscordGuild(
    project?.organizationId
  );
  const followOrganization = useFollowOrganization(project?.organizationId);

  const createTaskApplication = useCreateTaskApplication();
  const [handleSubmit, submitting] = useRunningCallback(
    async (input: FormValues) => {
      if (membershipState === DiscordGuildMembershipState.HAS_SCOPE) {
        await addUserToDiscordGuild().catch(() => {});
      }
      const claimedTask = await createTaskApplication({
        taskId: task!.id,
        userId: user!.id,
        message: input.message,
        startDate: input.dates[0].toISOString(),
        endDate: input.dates[1].toISOString(),
      });
      await followOrganization();
      await onDone(claimedTask);

      notification.success({
        placement: "top",
        duration: 5,
        message: "Application submitted!",
        description: hasDiscordIntegration
          ? `You will now be able to chat with the task reviewer in a Discord thread we created for you in ${organization?.name}'s server`
          : "Next the task reviewer will review your application. If they assign you, you can start working on the task",
      });
    },
    [
      createTaskApplication,
      onDone,
      followOrganization,
      addUserToDiscordGuild,
      membershipState,
      task,
      user,
      organization,
      hasDiscordIntegration,
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
          {isConnectedToDiscord
            ? `To apply to this task you first need to join ${organization?.name}'s Discord server`
            : "To apply to this task you first need to connect your Discord account"}
        </Typography.Paragraph>
        <Button
          type="primary"
          size="large"
          icon={<DiscordIcon />}
          children={isConnectedToDiscord ? "Join server" : "Connect Discord"}
          href={`${
            Constants.GRAPHQL_API_URL
          }/auth/discord-join-guild?state=${encodeURIComponent(
            encodeURIComponent(JSON.stringify({ redirect: router.asPath }))
          )}`}
        />
      </Row>
    );
  }

  return (
    <Form layout="vertical" requiredMark={false} onFinish={handleSubmit}>
      <Form.Item
        name="dates"
        label="How much time will you need?"
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

      <Button
        loading={submitting}
        type="primary"
        htmlType="submit"
        size="large"
        block
      >
        Apply
      </Button>
    </Form>
  );
};

export const TaskApplyModal: FC<Props> = (props) => {
  return (
    <Modal
      title="Apply to Task"
      visible={props.visible}
      destroyOnClose
      onCancel={props.onCancel}
      footer={null}
    >
      <ApplyToTaskContent {...props} />
    </Modal>
  );
};
