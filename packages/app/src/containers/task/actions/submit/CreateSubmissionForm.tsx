import { RichMarkdownEditor } from "@dewo/app/components/richMarkdownEditor/RichMarkdownEditor";
import { MetamaskAuthButton } from "@dewo/app/containers/auth/buttons/MetamaskAuthButton";
import { getThreepidName } from "@dewo/app/containers/auth/buttons/ThreepidAuthButton";
import { WalletConnectButton } from "@dewo/app/containers/auth/buttons/WalletConnectButton";
import { useFollowOrganization } from "@dewo/app/containers/rbac/hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { ThreepidSource } from "@dewo/app/graphql/types";
import { useRunningCallback } from "@dewo/app/util/hooks";
import { Button, message, Space, Spin, Typography } from "antd";
import React, { FC, useMemo, useState } from "react";
import {
  useCreateTaskSubmission,
  useTask,
  useUpdateTaskSubmission,
} from "../../hooks";

interface Props {
  taskId: string;
  onDone(): void;
}

export const CreateSubmissionForm: FC<Props> = ({ taskId, onDone }) => {
  const { user } = useAuthContext();
  const { task } = useTask(taskId);

  const currentSubmission = useMemo(
    () => task?.submissions.find((s) => s.userId === user?.id),
    [task?.submissions, user?.id]
  );

  const hasConnectedWallet = useMemo(
    () => user?.threepids?.some((t) => t.source === ThreepidSource.metamask),
    [user]
  );

  const [content, setContent] = useState<string>();
  const followOrganization = useFollowOrganization(
    task?.project.organizationId
  );
  const createSubmission = useCreateTaskSubmission();
  const updateSubmission = useUpdateTaskSubmission();
  const [submit, submitting] = useRunningCallback(async () => {
    try {
      if (!currentSubmission) {
        await createSubmission({
          taskId,
          content: content!,
        });
        followOrganization();
        message.success("Submission created");
      } else {
        await updateSubmission({
          taskId,
          userId: user!.id,
          content: content!,
        });
        message.success("Submission updated");
      }
    } finally {
      onDone();
    }
  }, [
    content,
    createSubmission,
    updateSubmission,
    followOrganization,
    user,
    currentSubmission,
    taskId,
    onDone,
  ]);

  if (!task) {
    return (
      <div style={{ display: "grid", placeItems: "center" }}>
        <Spin />
      </div>
    );
  }

  if (!!task.reward && !hasConnectedWallet) {
    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        <Typography.Title
          level={3}
          style={{ textAlign: "center", marginBottom: 0 }}
        >
          Connect your Wallet
        </Typography.Title>

        <Typography.Paragraph
          type="secondary"
          style={{ textAlign: "center", fontSize: "130%" }}
        >
          To submit work, you need to connect a wallet so you can get paid.
        </Typography.Paragraph>
        <MetamaskAuthButton
          children={getThreepidName[ThreepidSource.metamask]}
          size="large"
          block
        />
        <WalletConnectButton children="WalletConnect" size="large" block />
      </Space>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Typography.Title
        level={3}
        style={{ textAlign: "center", marginBottom: 0 }}
      >
        Submission
      </Typography.Title>
      <RichMarkdownEditor
        initialValue={currentSubmission?.content ?? ""}
        placeholder="Write your submission here"
        editable
        bordered
        mode="create"
        onChange={setContent}
        onSave={submit}
        key={currentSubmission?.content}
        buttons={({ disabled, onSave }) => (
          <Button
            block
            type="primary"
            onClick={onSave}
            disabled={!content || disabled}
            loading={submitting}
          >
            {currentSubmission ? "Save" : "Submit"}
          </Button>
        )}
      />
    </Space>
  );
};
