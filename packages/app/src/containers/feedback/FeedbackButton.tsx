import React, { FC } from "react";
import { Avatar, Modal } from "antd";
import * as Icons from "@ant-design/icons";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useToggle } from "@dewo/app/util/hooks";
import { FeedbackForm } from "./FeedbackForm";

export const FeedbackButton: FC = () => {
  const { user } = useAuthContext();
  const modal = useToggle();

  if (!user) return null;
  return (
    <>
      <a
        title="Submit feedback"
        style={{ position: "absolute", bottom: 16, right: 16 }}
        onClick={modal.toggleOn}
      >
        <Avatar>
          <Icons.MessageOutlined />
        </Avatar>
      </a>

      <Modal
        visible={modal.isOn}
        title="Feedback"
        footer={null}
        onCancel={modal.toggleOff}
      >
        <FeedbackForm onClose={modal.toggleOff} />
      </Modal>
    </>
  );
};
