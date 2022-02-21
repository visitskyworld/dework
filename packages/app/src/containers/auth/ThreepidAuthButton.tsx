import React, { FC, ReactNode } from "react";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { ThreepidSource } from "@dewo/app/graphql/types";
import * as Icons from "@ant-design/icons";
import { Constants } from "@dewo/app/util/constants";
import { Button, ButtonProps } from "antd";
import { MetamaskIcon } from "@dewo/app/components/icons/Metamask";
import { NotionIcon } from "@dewo/app/components/icons/Notion";
import { HiroIcon } from "@dewo/app/components/icons/Hiro";
import { TrelloIcon } from "@dewo/app/components/icons/Trello";

export const renderThreepidIcon: Record<ThreepidSource, ReactNode> = {
  [ThreepidSource.discord]: <DiscordIcon />,
  [ThreepidSource.github]: <Icons.GithubOutlined />,
  [ThreepidSource.metamask]: <MetamaskIcon />,
  [ThreepidSource.notion]: <NotionIcon />,
  [ThreepidSource.trello]: <TrelloIcon />,
  [ThreepidSource.hiro]: <HiroIcon />,
};

export const getThreepidName: Record<ThreepidSource, string> = {
  [ThreepidSource.discord]: "Discord",
  [ThreepidSource.github]: "GitHub",
  [ThreepidSource.metamask]: "Metamask",
  [ThreepidSource.notion]: "Notion",
  [ThreepidSource.trello]: "Trello",
  [ThreepidSource.hiro]: "Hiro Wallet",
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
      htmlType="button"
      icon={renderThreepidIcon[source]}
      href={`${Constants.GRAPHQL_API_URL}/auth/${source}?state=${
        !!state ? JSON.stringify(state) : ""
      }`}
      {...buttonProps}
    />
  );
};
