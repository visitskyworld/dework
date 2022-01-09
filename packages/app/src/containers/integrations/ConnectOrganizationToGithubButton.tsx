import React, { FC } from "react";
import { Button } from "antd";
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
    <Button
      type="ghost"
      style={{ marginTop: 4 }}
      icon={<Icons.GithubOutlined />}
      href={connectToGithubUrl}
    >
      Connect to Github
    </Button>
  );
};
