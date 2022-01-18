import React, { FC, useState } from "react";
import * as Icons from "@ant-design/icons";
import { Button, Space } from "antd";
import { useToggle } from "@dewo/app/util/hooks";
import { Task } from "@dewo/app/graphql/types";
import Modal from "antd/lib/modal/Modal";
import { MarkdownEditor } from "@dewo/app/components/markdownEditor/MarkdownEditor";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";

interface Props {
  task: Task;
}

export const CreateOpenBountySubmissionButton: FC<Props> = ({ task }) => {
  const { user } = useAuthContext();
  const modalVisible = useToggle();
  const [, setSubmission] = useState<string>();

  return (
    <>
      <Button
        size="small"
        icon={<Icons.UnlockOutlined />}
        onClick={modalVisible.toggleOn}
      >
        Create Submission
      </Button>
      <Modal
        title="Create Submission"
        visible={modalVisible.isOn}
        onCancel={modalVisible.toggleOff}
        footer={null}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <MarkdownEditor
            initialValue={"TODO" ?? undefined}
            buttonText={false ? "Edit submission" : "Add submission"}
            placeholder="Submit your work here..."
            editable
            mode="create"
            onChange={setSubmission}
          />
          <Button block type="primary">
            Create Submission
          </Button>
        </Space>
      </Modal>
    </>
  );
};
