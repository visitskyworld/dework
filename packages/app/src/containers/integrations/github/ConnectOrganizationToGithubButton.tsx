import React, { FC } from "react";
import { Button, ButtonProps, Tooltip } from "antd";
import * as Icons from "@ant-design/icons";
import { useConnectToGithubUrl } from "../hooks";

export interface ConnectOrganizationToGithubProps extends ButtonProps {
  organizationId: string;
  stateOverride?: object;
}

export const ConnectOrganizationToGithubButton: FC<
  ConnectOrganizationToGithubProps
> = ({
  organizationId,
  stateOverride,
  icon = <Icons.GithubOutlined />,
  children = "Connect to Github",
  ...buttonProps
}) => {
  const connectToGithubUrl = useConnectToGithubUrl(
    organizationId,
    stateOverride
  );

  return (
    <Tooltip
      title="You need admin permissions in your Github organization to add the Dework app"
      placement="bottom"
    >
      <Button
        {...buttonProps}
        style={buttonProps.style}
        icon={icon}
        href={connectToGithubUrl}
      >
        {children}
      </Button>
    </Tooltip>
  );
};
