import React, { FC } from "react";
import { Button, Modal, Space, Tooltip } from "antd";
import * as Icons from "@ant-design/icons";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useToggle } from "@dewo/app/util/hooks";
import { deworkSocialLinks } from "@dewo/app/util/constants";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { FeedbackForm } from "./FeedbackForm";
import { useIsEmbedded } from "@dewo/app/util/navigation";

export const FloatingFooterButtons: FC = () => {
  const { user } = useAuthContext();
  const modal = useToggle();
  const embedded = useIsEmbedded();

  if (!user) return null;
  if (embedded) return null;
  return (
    <>
      <Space style={{ position: "absolute", bottom: 16, right: 16 }}>
        <a
          href={deworkSocialLinks.discord}
          target="_blank"
          rel="noreferrer"
          className="hide-xs"
        >
          <Button
            icon={<DiscordIcon />}
            shape="circle"
            name="Discord Floating Footer Button"
          />
        </a>
        <a
          href={deworkSocialLinks.twitter}
          target="_blank"
          rel="noreferrer"
          className="hide-xs"
        >
          <Button
            icon={<Icons.TwitterOutlined />}
            shape="circle"
            name="Twitter Floating Footer Button"
          />
        </a>
        <Tooltip title="Send Feedback" placement="topRight">
          <a title="Submit feedback" onClick={modal.toggleOn}>
            <Button
              icon={<Icons.MessageOutlined />}
              shape="circle"
              name="Feedback Floating Footer Button"
            />
          </a>
        </Tooltip>

        <Tooltip title="Read Documentation" placement="topRight">
          <a
            href={deworkSocialLinks.gitbook.index}
            target="_blank"
            rel="noreferrer"
            className="hide-xs"
          >
            <Button
              icon={<Icons.QuestionCircleOutlined />}
              shape="circle"
              name="Documentation Floating Footer Button"
            />
          </a>
        </Tooltip>
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
