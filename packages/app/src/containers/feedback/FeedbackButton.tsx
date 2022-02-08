import React, { FC } from "react";
import { Avatar, Modal, Space } from "antd";
import * as Icons from "@ant-design/icons";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useToggle } from "@dewo/app/util/hooks";
import { deworkSocialLinks } from "@dewo/app/util/constants";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { FeedbackForm } from "./FeedbackForm";

export const FeedbackButton: FC = () => {
  const { user } = useAuthContext();
  const modal = useToggle();

  if (!user) return null;
  return (
    <>
      <Space style={{ position: "absolute", bottom: 16, right: 16 }}>
        <a
          href={deworkSocialLinks.discord}
          target="_blank"
          rel="noreferrer"
          className="hide-xs"
        >
          <Avatar>
            <DiscordIcon />
          </Avatar>
        </a>
        <a
          href={deworkSocialLinks.twitter}
          target="_blank"
          rel="noreferrer"
          className="hide-xs"
        >
          <Avatar>
            <Icons.TwitterOutlined />
          </Avatar>
        </a>
        <a title="Submit feedback" onClick={modal.toggleOn}>
          <Avatar>
            <Icons.MessageOutlined />
          </Avatar>
        </a>
      </Space>

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
