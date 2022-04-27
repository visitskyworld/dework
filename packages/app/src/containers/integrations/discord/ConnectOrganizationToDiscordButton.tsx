import React, { FC } from "react";
import { Button, ButtonProps } from "antd";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useRouter } from "next/router";
import { Constants } from "@dewo/app/util/constants";
import * as qs from "query-string";
import Link from "next/link";

interface Props extends ButtonProps {
  organizationId: string;
  style?: React.CSSProperties;
  guildId?: string;
}

export const ConnectOrganizationToDiscordButton: FC<Props> = ({
  organizationId,
  children = "Connect to Discord",
  icon = <DiscordIcon />,
  guildId,
  ...buttonProps
}) => {
  const { user } = useAuthContext();
  const router = useRouter();
  return (
    <Link
      href={`${Constants.GRAPHQL_API_URL}/auth/discord-bot?${qs.stringify({
        organizationId,
        userId: user?.id,
        redirect: router.asPath,
        ...(guildId ? { guildId } : {}),
      })}`}
    >
      <Button {...buttonProps} icon={icon} children={children} />
    </Link>
  );
};
