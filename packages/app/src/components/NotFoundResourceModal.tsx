import React, { FC } from "react";
import { Avatar, Button, Modal, Row, Typography } from "antd";
import { IncognitoIcon } from "@dewo/app/components/icons/Incognito";

interface Props {
  visible: boolean;
  message: string;
  onClose(): void;
}

export const NotFoundResourceModal: FC<Props> = ({
  visible,
  message,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      footer={null}
      style={{ textAlign: "center" }}
      onCancel={onClose}
      closable={true}
    >
      <Avatar
        icon={<IncognitoIcon style={{ width: 72, height: 72 }} />}
        size={96}
        style={{ display: "grid", placeItems: "center" }}
        className="mx-auto"
      />
      <Typography.Title level={4} style={{ marginTop: 16 }}>
        Not found
      </Typography.Title>
      <Typography.Paragraph type="secondary">{message}</Typography.Paragraph>
      <Row style={{ gap: 8, justifyContent: "center" }}>
        <Button onClick={onClose}>Close</Button>
      </Row>
    </Modal>
  );
};
