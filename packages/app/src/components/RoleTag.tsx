import { Tag } from "antd";
import React, { FC } from "react";
import { Role, RoleSource } from "../graphql/types";
import { DiscordIcon } from "./icons/Discord";

interface Props {
  role: Role;
}

export const RoleTag: FC<Props> = ({ role }) => (
  <Tag color={role.color === "grey" ? undefined : role.color}>
    {role.source === RoleSource.DISCORD && (
      <DiscordIcon style={{ marginRight: 4 }} />
    )}
    {role.name}
  </Tag>
);
