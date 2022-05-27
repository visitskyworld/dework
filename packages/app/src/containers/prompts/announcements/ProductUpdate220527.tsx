import { Button, Row, Typography } from "antd";
import React, { FC } from "react";
import { Emojione } from "react-emoji-render";

interface Props {
  onNext(): Promise<void>;
}

export const ProductUpdate220527: FC<Props> = ({ onNext }) => {
  return (
    <>
      <Typography.Title level={2} style={{ textAlign: "center" }}>
        What's New
      </Typography.Title>
      <Typography.Text
        type="secondary"
        style={{ textAlign: "center", fontSize: "130%" }}
      >
        We're starting a weekly changelog to show the latest things we've
        shipped!
      </Typography.Text>

      <Row align="middle" justify="center" style={{ flex: 1, fontSize: 100 }}>
        <Emojione svg text="🚢" className="emojione" />
      </Row>

      <Button
        type="primary"
        target="_blank"
        href="https://mirror.xyz/0x761996F7258A19B6aCcF6f22e9Ca8CdAA92D75A6/-fB_XMz0y3ipqiUbLlQ_sHdexg5Ydd_2upxuFcZNhfc"
        name="Product Update 220527: mirror link"
        onClick={onNext}
      >
        See what's new
      </Button>

      <Button
        target="_blank"
        href="https://discord.gg/rPEsPzShd7"
        style={{ marginTop: 8 }}
        name="Product Update 220527: discord link"
        onClick={onNext}
      >
        Got questions? Join our Discord server
      </Button>
      <Button
        type="text"
        size="small"
        style={{ marginTop: 8 }}
        className="text-secondary"
        name="Product Update 220527: close"
        onClick={onNext}
      >
        Close
      </Button>
    </>
  );
};
