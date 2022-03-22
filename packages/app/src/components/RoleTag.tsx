import { Tag, TagProps } from "antd";
import React, { FC } from "react";
import * as Colors from "@ant-design/colors";
import { Role, RoleSource } from "../graphql/types";
import { DiscordIcon } from "./icons/Discord";

interface Props extends Omit<TagProps, "role"> {
  role: Role;
}

export const RoleTag: FC<Props> = ({ role, ...tagProps }) => (
  <Tag {...tagProps}>
    {role.source === RoleSource.DISCORD && (
      <DiscordIcon
        style={{ marginRight: 4, color: Colors[role.color as "red"]?.primary }}
      />
    )}
    {role.name}
  </Tag>
);
