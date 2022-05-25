import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { Button, ButtonProps } from "antd";
import { useToggle } from "@dewo/app/util/hooks";
import { Task } from "@dewo/app/graphql/types";
import Modal from "antd/lib/modal/Modal";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { LoginButton } from "@dewo/app/containers/auth/buttons/LoginButton";
import { CreateSubmissionForm } from "./CreateSubmissionForm";

interface Props extends ButtonProps {
  task: Task;
}

export const CreateSubmissionButton: FC<Props> = ({ task, ...buttonProps }) => {
  const modal = useToggle();
  const { user } = useAuthContext();

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
        name="Submit work"
        onClick={modal.toggleOn}
      >
        Submit Work
      </Button>
      <Modal visible={modal.isOn} onCancel={modal.toggleOff} footer={null}>
        <CreateSubmissionForm taskId={task.id} onDone={modal.toggleOff} />
      </Modal>
    </>
  );
};
