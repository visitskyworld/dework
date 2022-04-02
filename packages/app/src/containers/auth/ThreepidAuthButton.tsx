import React, { FC, ReactNode, useMemo } from "react";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { ThreepidSource } from "@dewo/app/graphql/types";
import * as Icons from "@ant-design/icons";
import { Constants } from "@dewo/app/util/constants";
import { Button, ButtonProps } from "antd";
import { MetamaskIcon } from "@dewo/app/components/icons/Metamask";
import { NotionIcon } from "@dewo/app/components/icons/Notion";
import { HiroIcon } from "@dewo/app/components/icons/Hiro";
import { TrelloIcon } from "@dewo/app/components/icons/Trello";
import { useRouter } from "next/router";
import { PhantomIcon } from "@dewo/app/components/icons/Phantom";

export const renderThreepidIcon: Record<ThreepidSource, ReactNode> = {
  [ThreepidSource.discord]: <DiscordIcon />,
  [ThreepidSource.github]: <Icons.GithubOutlined />,
  [ThreepidSource.metamask]: <MetamaskIcon />,
  [ThreepidSource.phantom]: <PhantomIcon />,
  [ThreepidSource.notion]: <NotionIcon />,
  [ThreepidSource.trello]: <TrelloIcon />,
  [ThreepidSource.hiro]: <HiroIcon />,
};

export const getThreepidName: Record<ThreepidSource, string> = {
  [ThreepidSource.discord]: "Discord",
  [ThreepidSource.github]: "GitHub",
  [ThreepidSource.metamask]: "Metamask",
  [ThreepidSource.phantom]: "Phantom",
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
  const router = useRouter();
  const stateWithRedirect = useMemo(
    () => ({ redirect: router.asPath, ...state }),
    [router.asPath, state]
  );
  return (
    <Button
      htmlType="button"
      icon={renderThreepidIcon[source]}
      href={`${Constants.GRAPHQL_API_URL}/auth/${source}?state=${JSON.stringify(
        stateWithRedirect
      )}`}
      {...buttonProps}
    />
  );
};
