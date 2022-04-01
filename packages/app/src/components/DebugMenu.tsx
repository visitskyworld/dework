import { Button, Dropdown, Menu, Typography } from "antd";
import React, { FC, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { useAuthContext } from "../contexts/AuthContext";
import { useUserRoles } from "../containers/user/hooks";
import { useCopyToClipboardAndShowToast } from "../util/hooks";
import { Constants } from "../util/constants";
import { isSSR } from "../util/isSSR";

// Team Dework role ID
const DEBUG_ROLE = Constants.DEV_ROLE_ID;

interface Props {
  projectId?: string;
  organizationId?: string;
}
export const DebugMenu: FC<Props> = ({ projectId, organizationId }) => {
  const copy = useCopyToClipboardAndShowToast();

  const { user } = useAuthContext();
  const userRoles = useUserRoles(isSSR ? undefined : user?.id);
  const isDev = useMemo(
    () =>
      global?.localStorage?.getItem("DEWO_DEV") ||
      userRoles?.roles.some((role) => role.id === DEBUG_ROLE),
    [userRoles]
  );

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
      <Button type="ghost">
        <Icons.ToolFilled />
      </Button>
    </Dropdown>
  );
};
