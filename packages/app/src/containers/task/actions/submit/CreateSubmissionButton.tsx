import React, { FC, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import { Button, ButtonProps, message, Space } from "antd";
import { useRunningCallback, useToggle } from "@dewo/app/util/hooks";
import { Task } from "@dewo/app/graphql/types";
import Modal from "antd/lib/modal/Modal";
import { MarkdownEditor } from "@dewo/app/components/markdownEditor/MarkdownEditor";
import { useCreateTaskSubmission, useUpdateTaskSubmission } from "../../hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { LoginButton } from "../../../auth/LoginButton";

interface Props extends ButtonProps {
  task: Task;
}

export const CreateSubmissionButton: FC<Props> = ({ task, ...buttonProps }) => {
  const modalVisible = useToggle();

  const [content, setContent] = useState<string>();

  const { user } = useAuthContext();
  const currentSubmission = useMemo(
    () => task.submissions.find((s) => s.userId === user?.id),
    [task.submissions, user]
  );

  const createSubmission = useCreateTaskSubmission();
  const updateSubmission = useUpdateTaskSubmission();
  const [handleCreate, creating] = useRunningCallback(async () => {
    if (!currentSubmission) {
      await createSubmission({ taskId: task.id, content: content! });
      message.success("Submission created");
    } else {
      await updateSubmission({
        userId: user!.id,
        taskId: task.id,
        content: content!,
      });

      message.success("Submission updated");
    }

    modalVisible.toggleOff();
  }, [
    content,
    createSubmission,
    updateSubmission,
    user,
    currentSubmission,
    modalVisible,
    task.id,
  ]);

  if (!user) {
    return (
      <LoginButton {...buttonProps} icon={<Icons.UnlockOutlined />}>
        Submit Work
      </LoginButton>
    );
  }
  return (
    <>
      <Button
        {...buttonProps}
        icon={<Icons.EditOutlined />}
        onClick={modalVisible.toggleOn}
      >
        {!!currentSubmission ? "Edit Submission" : "Submit Work"}
      </Button>
      <Modal
        title="Submission"
        visible={modalVisible.isOn}
        onCancel={modalVisible.toggleOff}
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
