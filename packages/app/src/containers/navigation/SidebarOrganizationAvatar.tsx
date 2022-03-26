import React, { FC, useCallback } from "react";
import { Dropdown, Menu } from "antd";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { Organization } from "@dewo/app/graphql/types";
import { SidebarNavLink } from "./SidebarNavLink";
import * as Icons from "@ant-design/icons";
import { useUnfollowOrganization } from "../rbac/hooks";
import { stopPropagation } from "@dewo/app/util/eatClick";

interface SidebarOrganizationAvatarProps {
  organization: Organization;
}

export const SidebarOrganizationAvatar: FC<SidebarOrganizationAvatarProps> = ({
  organization,
}) => (
  <SidebarNavLink href={organization.permalink} className="dewo-sidebar-item">
    <Dropdown
      trigger={["contextMenu"]}
      overlay={
        <Menu>
          <UnfollowOrganizationMenuItem organization={organization} />
        </Menu>
      }
    >
      <OrganizationAvatar
        size={48}
        organization={organization}
        tooltip={{ visible: false }}
      />
    </Dropdown>
  </SidebarNavLink>
);

const UnfollowOrganizationMenuItem: FC<SidebarOrganizationAvatarProps> = ({
  organization,
}) => {
  const unfollowOrganization = useUnfollowOrganization(organization.id);
  const handleClick = useCallback(
    async (e) => {
      stopPropagation(e.domEvent);
      await unfollowOrganization();
    },
    [unfollowOrganization]
  );

  return (
    <Menu.Item
      icon={<Icons.MinusCircleOutlined />}
      onClick={handleClick}
      danger
    >
      Unfollow {organization?.name}
    </Menu.Item>
  );
};
