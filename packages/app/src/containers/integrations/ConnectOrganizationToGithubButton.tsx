import React, { FC } from "react";
import { Button, Tooltip } from "antd";
import * as Icons from "@ant-design/icons";
import { useConnectToGithubUrl } from "./hooks";

export interface ConnectOrganizationToGithubProps {
  organizationId: string;
  stateOverride?: unknown;
}

export const ConnectOrganizationToGithubButton: FC<
  ConnectOrganizationToGithubProps
> = ({ organizationId, stateOverride }) => {
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
        type="ghost"
        style={{ marginTop: 4 }}
        icon={<Icons.GithubOutlined />}
        href={connectToGithubUrl}
      >
        Connect to Github
      </Button>
    </Tooltip>
  );
};
