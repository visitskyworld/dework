import React from "react";
import { Typography } from "antd";

interface InviteMessageProps {
  permission?: string;
  to: string;
  inviter: string;
}

export const InviteMessage = ({
  inviter,
  permission,
  to,
}: InviteMessageProps) => (
  <Typography.Text>
    {inviter} has invited you to {!!permission && `${permission} `}
    <Typography.Text strong>{to}</Typography.Text>
  </Typography.Text>
);
