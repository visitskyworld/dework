import React, { FC } from "react";
import { Button } from "antd";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useRouter } from "next/router";
import { Constants } from "@dewo/app/util/constants";

interface Props {
  organizationId: string;
}

export const ConnectOrganizationToDiscordButton: FC<Props> = ({
  organizationId,
}) => {
  const { user } = useAuthContext();
  const router = useRouter();
  return (
    <Button
      type="ghost"
      style={{ marginTop: 4 }}
      icon={<DiscordIcon />}
      href={`${
        Constants.GRAPHQL_API_URL
      }/auth/discord-bot?organizationId=${organizationId}&userId=${
        user!.id
      }&redirect=${router.asPath}`}
    >
      Connect to Discord
    </Button>
  );
};
