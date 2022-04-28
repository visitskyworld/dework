import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { User } from "@dewo/app/graphql/types";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { Typography } from "antd";
import Link from "next/link";
import React, { CSSProperties, FC } from "react";

interface Props {
  user: User;
  style?: CSSProperties;
}

export const UserSelectOption: FC<Props> = ({ user, style }) => (
  <span style={{ ...style, display: "flex" }}>
    <Link href={user.permalink}>
      <a target="_blank" onClick={stopPropagation}>
        <UserAvatar
          user={user}
          size="small"
          tooltip={{ title: "View profile" }}
        />
      </a>
    </Link>
    <Typography.Text style={{ marginLeft: 8 }}>{user.username}</Typography.Text>
  </span>
);
