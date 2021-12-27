import React, { FC, ReactNode } from "react";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { ThreepidSource } from "@dewo/app/graphql/types";
import * as Icons from "@ant-design/icons";
import { Constants } from "@dewo/app/util/constants";
import { Button, ButtonProps } from "antd";

export const renderThreepidIcon: Record<ThreepidSource, ReactNode> = {
  [ThreepidSource.discord]: <DiscordIcon />,
  [ThreepidSource.github]: <Icons.GithubOutlined />,
};

export const getThreepidName: Record<ThreepidSource, string> = {
  [ThreepidSource.discord]: "Discord",
  [ThreepidSource.github]: "GitHub",
};

interface Props extends ButtonProps {
  source: ThreepidSource;
  state?: object;
}

export const ThreepidAuthButton: FC<Props> = ({
  source,
  state,
  ...buttonProps
}) => {
  return (
    <Button
      {...buttonProps}
      icon={renderThreepidIcon[source]}
      href={`${Constants.GRAPHQL_API_URL}/auth/${source}?state=${
        !!state ? JSON.stringify(state) : ""
      }`}
    />
  );
};
