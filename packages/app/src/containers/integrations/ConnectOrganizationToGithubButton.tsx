import React, { FC } from "react";
import { Button } from "antd";
import * as Icons from "@ant-design/icons";
import { useConnectToGithubUrl } from "./hooks";

interface Props {
  organizationId: string;
}

export const ConnectOrganizationToGithubButton: FC<Props> = ({
  organizationId,
}) => {
  const connectToGithubUrl = useConnectToGithubUrl(organizationId);
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
