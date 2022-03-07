import React from "react";
import { Typography } from "antd";
import { isVowel } from "@dewo/app/util/string";

interface InviteMessageProps {
  inviter: string;
  role: string;
  to: string;
}

export const InviteMessage = ({ inviter, role, to }: InviteMessageProps) => (
  <Typography.Text>
    {inviter} has invited you as {isVowel(role.charAt(0)) ? "an " : "a "}
    <Typography.Text strong>{role}</Typography.Text> to{" "}
    <Typography.Text strong>{to}</Typography.Text>
  </Typography.Text>
);
