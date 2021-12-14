import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { User } from "@dewo/app/graphql/types";
import { Row, Typography } from "antd";
import React, { CSSProperties, FC } from "react";

interface Props {
  user: User;
  style?: CSSProperties;
}

export const UserSelectOption: FC<Props> = ({ user, style }) => (
  <Row align="middle" style={style}>
    <UserAvatar user={user} size="small" />
    <Typography.Text style={{ marginLeft: 8 }}>{user.username}</Typography.Text>
  </Row>
);
