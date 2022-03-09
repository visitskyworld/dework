import React from "react";
import { Typography } from "antd";
import { isVowel } from "@dewo/app/util/string";

interface AlreadyInvitedMessageProps {
  role: string;
  to: string;
}

export const AlreadyInvitedMessage = ({
  role,
  to,
}: AlreadyInvitedMessageProps) => (
  <Typography.Text>
    You're already {isVowel(role.charAt(0)) ? "an " : "a "}
    <Typography.Text strong>{role}</Typography.Text> in{" "}
    <Typography.Text strong>{to}</Typography.Text>
  </Typography.Text>
);

interface InviteMessageProps extends AlreadyInvitedMessageProps {
  inviter: string;
}

export const InviteMessage = ({ inviter, role, to }: InviteMessageProps) => (
  <Typography.Text>
    {inviter} has invited you as {isVowel(role.charAt(0)) ? "an " : "a "}
    <Typography.Text strong>{role}</Typography.Text> to{" "}
    <Typography.Text strong>{to}</Typography.Text>
  </Typography.Text>
);
