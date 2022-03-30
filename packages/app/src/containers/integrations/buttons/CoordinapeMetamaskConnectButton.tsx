import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import * as Icons from "@ant-design/icons";
import {
  OrganizationIntegrationType,
  ThreepidSource,
} from "@dewo/app/graphql/types";
import { ButtonProps, Tooltip } from "antd";
import React, { FC, useMemo } from "react";
import { MetamaskAuthButton } from "../../auth/MetamaskAuthButton";
import { useOrganizationDetails } from "../../organization/hooks";

interface Props extends ButtonProps {
  organizationId: string;
}

export const CoordinapeMetamaskConnectButton: FC<Props> = ({
  organizationId,
  ...buttonProps
}) => {
  const { user } = useAuthContext();
  const integrations =
    useOrganizationDetails(organizationId).organization?.integrations;
  const hasCoordinapeIntegration = useMemo(
    () =>
      integrations?.some(
        (i) => i.type === OrganizationIntegrationType.COORDINAPE
      ),
    [integrations]
  );

  const isConnectedToMetamask = useMemo(
    () => user?.threepids.some((t) => t.source === ThreepidSource.metamask),
    [user?.threepids]
  );

  if (hasCoordinapeIntegration && !!user && !isConnectedToMetamask) {
    return (
      <Tooltip title="This project is connected with Coordinape. Connect your Metamask address to make your Dework tasks show up in Coordinape!">
        <MetamaskAuthButton {...buttonProps}>
          Connect Coordinape
          {"   "}
          <Icons.QuestionCircleOutlined />
        </MetamaskAuthButton>
      </Tooltip>
    );
  }

  return null;
};