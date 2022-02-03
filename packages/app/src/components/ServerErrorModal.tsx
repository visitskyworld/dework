import React, { FC, useCallback, useState } from "react";
import { Avatar, Button, Modal, Row, Typography } from "antd";
import { RainbowBucketIcon } from "./icons/RainbowBucket";

interface Props {
  visible: boolean;
}

export const ServerErrorModal: FC<Props> = ({ visible }) => {
  const [refreshing, setRefreshing] = useState(false);
  const refresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }, []);
  return (
    <Modal
      visible={visible}
      footer={null}
      style={{ textAlign: "center" }}
      closable={false}
    >
      <Avatar
        icon={<RainbowBucketIcon style={{ width: 72, height: 72 }} />}
        size={96}
        style={{ display: "grid", placeItems: "center" }}
        className="mx-auto"
      />
      <Typography.Title level={4} style={{ marginTop: 16 }}>
        Server Upgrade in progress
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        We're currently releasing some new features, so all features of Dework
        might not be working properly. Don't worry, none of your data will be
        lost. Everything should be back to normal within a few minutes.
      </Typography.Paragraph>
      <Row style={{ gap: 16, justifyContent: "center" }}>
        <Button type="primary" loading={refreshing} onClick={refresh}>
          Refresh page
        </Button>
      </Row>
    </Modal>
  );
};
