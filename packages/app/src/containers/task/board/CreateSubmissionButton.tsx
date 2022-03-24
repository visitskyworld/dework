import React, { FC, useCallback, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import { Button, message, Space } from "antd";
import { useToggle } from "@dewo/app/util/hooks";
import { Task } from "@dewo/app/graphql/types";
import Modal from "antd/lib/modal/Modal";
import { MarkdownEditor } from "@dewo/app/components/markdownEditor/MarkdownEditor";
import { useCreateTaskSubmission, useUpdateTaskSubmission } from "../hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { LoginButton } from "../../auth/LoginButton";

interface Props {
  task: Task;
}

export const CreateSubmissionButton: FC<Props> = ({ task }) => {
  const modalVisible = useToggle();
  const [loading, setLoading] = useState(false);

  const [content, setContent] = useState<string>();

  const { user } = useAuthContext();
  const currentSubmission = useMemo(
    () => task.submissions.find((s) => s.userId === user?.id),
    [task.submissions, user]
  );

  const createSubmission = useCreateTaskSubmission();
  const updateSubmission = useUpdateTaskSubmission();
  const handleCreate = useCallback(async () => {
    setLoading(true);
    try {
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
    } finally {
      setLoading(false);
    }
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
      <LoginButton size="small" icon={<Icons.UnlockOutlined />}>
        Create Submission
      </LoginButton>
    );
  }
  return (
    <>
      <Button
        size="small"
        type="text"
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
            loading={loading}
            onClick={handleCreate}
          >
            Save
          </Button>
        </Space>
      </Modal>
    </>
  );
};
