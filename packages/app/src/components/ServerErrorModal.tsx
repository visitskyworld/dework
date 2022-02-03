import React, {
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Avatar, Button, message, Modal, Row, Typography } from "antd";
import { RainbowBucketIcon } from "./icons/RainbowBucket";
import { useApolloClient } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";

interface Props {
  onErrorRef: MutableRefObject<ErrorLink.ErrorHandler | undefined>;
}

export const ServerErrorModal: FC<Props> = ({ onErrorRef }) => {
  const [visible, setVisible] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const apolloClient = useApolloClient();
  const reconnect = useCallback(async () => {
    try {
      setReconnecting(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await apolloClient
        .reFetchObservableQueries()
        .catch(window.location.reload);
      setVisible(false);
    } catch (error) {
      message.error(
        "Failed to reconnect. Application upgrade still in progress."
      );
    } finally {
      setReconnecting(false);
    }
  }, [apolloClient]);

  useEffect(() => {
    onErrorRef.current = (error) => {
      const statusCode =
        !!error.networkError && "statusCode" in error.networkError
          ? error.networkError.statusCode
          : undefined;
      setVisible(!!statusCode && 500 <= statusCode && statusCode < 599);
    };
  }, [onErrorRef]);

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
        Application upgrade in progress
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        We're currently releasing some new features, so Dework might not be
        working properly. Everything should be back to normal within a few
        minutes.
      </Typography.Paragraph>
      <Row style={{ gap: 16, justifyContent: "center" }}>
        <Button type="primary" loading={reconnecting} onClick={reconnect}>
          Reconnect
        </Button>
      </Row>
    </Modal>
  );
};
