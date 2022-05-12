import { Button, Dropdown, Menu, Typography } from "antd";
import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { useIsDev } from "../containers/user/hooks";
import { useCopyToClipboardAndShowToast } from "../util/hooks";

interface Props {
  projectId?: string;
  organizationId?: string;
}
export const DebugMenu: FC<Props> = ({ projectId, organizationId }) => {
  const copy = useCopyToClipboardAndShowToast();
  const isDev = useIsDev();
  if (!isDev) return null;
  return (
    <Dropdown
      trigger={["click"]}
      overlay={
        <Menu>
          {!!projectId && (
            <Menu.Item onClick={() => copy(projectId)}>
              {"Project ID: "}
              <Typography.Text code copyable>
                {projectId}
              </Typography.Text>
            </Menu.Item>
          )}
          {!!organizationId && (
            <Menu.Item onClick={() => copy(organizationId)}>
              Organization ID:{" "}
              <Typography.Text code copyable>
                {organizationId}
              </Typography.Text>
            </Menu.Item>
          )}
        </Menu>
      }
    >
      <Button>
        <Icons.ToolFilled />
      </Button>
    </Dropdown>
  );
};
