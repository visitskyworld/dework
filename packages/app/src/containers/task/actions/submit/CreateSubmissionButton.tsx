import React, { FC, useCallback, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import { Typography, Button, ButtonProps, message, Space } from "antd";
import { useRunningCallback, useToggle } from "@dewo/app/util/hooks";
import { Task, ThreepidSource } from "@dewo/app/graphql/types";
import Modal from "antd/lib/modal/Modal";
import { MarkdownEditor } from "@dewo/app/components/markdownEditor/MarkdownEditor";
import { useCreateTaskSubmission, useUpdateTaskSubmission } from "../../hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { LoginButton } from "@dewo/app/containers/auth/buttons/LoginButton";
import { useFollowOrganization } from "@dewo/app/containers/rbac/hooks";
import { useProject } from "../../../project/hooks";
import { MetamaskAuthButton } from "@dewo/app/containers/auth/buttons/MetamaskAuthButton";
import { getThreepidName } from "@dewo/app/containers/auth/buttons/ThreepidAuthButton";
import { WalletConnectButton } from "@dewo/app/containers/auth/buttons/WalletConnectButton";

interface Props extends ButtonProps {
  task: Task;
}

export const CreateSubmissionButton: FC<Props> = ({ task, ...buttonProps }) => {
  const submissionModalVisible = useToggle();
  const connectWalletModalVisible = useToggle();

  const [content, setContent] = useState<string>();

  const { user } = useAuthContext();
  const { project } = useProject(task?.projectId);
  const currentSubmission = useMemo(
    () => task.submissions.find((s) => s.userId === user?.id),
    [task.submissions, user]
  );

  const hasConnectedWallet = useMemo(
    () => user?.threepids?.some((t) => t.source === ThreepidSource.metamask),
    [user]
  );
  const followOrganization = useFollowOrganization(project?.organizationId);

  const createSubmission = useCreateTaskSubmission();
  const updateSubmission = useUpdateTaskSubmission();
  const [handleCreate, creating] = useRunningCallback(async () => {
    if (!currentSubmission) {
      await createSubmission({ taskId: task.id, content: content! });
      await followOrganization();
      message.success("Submission created");
    } else {
      await updateSubmission({
        userId: user!.id,
        taskId: task.id,
        content: content!,
      });

      message.success("Submission updated");
    }

    submissionModalVisible.toggleOff();
  }, [
    content,
    createSubmission,
    updateSubmission,
    followOrganization,
    user,
    currentSubmission,
    submissionModalVisible,
    task.id,
  ]);

  const handleSubmitOrEditWork = useCallback(() => {
    const needToConnectWallet =
      !hasConnectedWallet && !currentSubmission && !!task.reward;
    if (needToConnectWallet) {
      connectWalletModalVisible.toggleOn();
    } else {
      submissionModalVisible.toggleOn();
    }
  }, [
    hasConnectedWallet,
    currentSubmission,
    task.reward,
    connectWalletModalVisible,
    submissionModalVisible,
  ]);

  const handleAuthedWithWallet = useCallback(() => {
    connectWalletModalVisible.toggleOff();
    submissionModalVisible.toggleOn();
  }, [connectWalletModalVisible, submissionModalVisible]);

  if (!user) {
    return (
      <LoginButton
        {...buttonProps}
        icon={<Icons.UnlockOutlined />}
        name="Submit work (unauthenticated)"
      >
        Submit Work
      </LoginButton>
    );
  }
  return (
    <>
      <Button
        {...buttonProps}
        icon={<Icons.EditOutlined />}
        name={!!currentSubmission ? "Edit submission" : "Submit work"}
        onClick={handleSubmitOrEditWork}
      >
        {!!currentSubmission ? "Edit Submission" : "Submit Work"}
      </Button>
      <Modal
        onCancel={connectWalletModalVisible.toggleOff}
        visible={connectWalletModalVisible.isOn}
        footer={null}
      >
        <Typography.Title level={2} style={{ textAlign: "center" }}>
          Connect your Wallet
        </Typography.Title>

        <Typography.Paragraph
          type="secondary"
          style={{ textAlign: "center", fontSize: "130%" }}
        >
          To submit work, you need to connect a wallet so you can get paid.
        </Typography.Paragraph>

        <Space
          direction="vertical"
          style={{ width: "100%", marginTop: "24px" }}
        >
          <MetamaskAuthButton
            children={getThreepidName[ThreepidSource.metamask]}
            size="large"
            block
            onAuthed={handleAuthedWithWallet}
          />
          <WalletConnectButton
            children="WalletConnect"
            size="large"
            block
            onAuthed={handleAuthedWithWallet}
          />
        </Space>
      </Modal>
      <Modal
        title="Submission"
        visible={submissionModalVisible.isOn}
        onCancel={submissionModalVisible.toggleOff}
        footer={null}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <MarkdownEditor
            key={currentSubmission?.content}
            initialValue={currentSubmission?.content}
            buttonText={false ? "Edit submission" : "Add submission"}
            placeholder="Submit your work here..."
            editable
            mode="create"
            onChange={setContent}
          />
          <Button
            block
            type="primary"
            disabled={!content}
            loading={creating}
            onClick={handleCreate}
          >
            Save
          </Button>
        </Space>
      </Modal>
    </>
  );
};
