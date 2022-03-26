import React, { FC } from "react";
import { Button, ButtonProps } from "antd";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useRouter } from "next/router";
import { Constants } from "@dewo/app/util/constants";

interface Props extends ButtonProps {
  organizationId: string;
  style?: React.CSSProperties;
}

export const ConnectOrganizationToDiscordButton: FC<Props> = ({
  organizationId,
  children = "Connect to Discord",
  icon = <DiscordIcon />,
  ...buttonProps
}) => {
  const { user } = useAuthContext();
  const router = useRouter();
  return (
    <Button
      {...buttonProps}
      icon={icon}
      href={`${Constants.GRAPHQL_API_URL}/auth/discord-bot?organizationId=${organizationId}&userId=${user?.id}&redirect=${router.asPath}`}
    >
      {children}
    </Button>
  );
};
