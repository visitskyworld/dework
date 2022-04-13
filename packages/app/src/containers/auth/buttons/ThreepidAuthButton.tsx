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
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import classNames from "classnames";
import Link from "next/link";
import styles from "./ThreepidAuthButton.module.less";
// const styles: any = {};

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
  className,
  ...buttonProps
}) => {
  const { user } = useAuthContext();
  const connected = useMemo(
    () => user?.threepids?.some((t) => t.source === source),
    [user, source]
  );

  const router = useRouter();
  const stateWithRedirect = useMemo(
    () => ({ redirect: router.asPath, ...state }),
    [router.asPath, state]
  );

  const href = Object.keys(buttonProps).includes("href")
    ? buttonProps.href
    : `${Constants.GRAPHQL_API_URL}/auth/${source}?state=${encodeURIComponent(
        JSON.stringify(stateWithRedirect)
      )}`;

  const button = (
    <Button
      htmlType="button"
      icon={renderThreepidIcon[source]}
      {...buttonProps}
      disabled={buttonProps.disabled || connected}
      className={classNames({ className, [styles.connected]: connected })}
    />
  );

  return !!href ? <Link href={href} children={button} /> : button;
};
