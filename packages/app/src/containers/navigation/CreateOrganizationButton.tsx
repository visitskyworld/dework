import { useToggle } from "@dewo/app/util/hooks";
import { Avatar, Button, Tooltip } from "antd";
import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { OrganizationCreateModal } from "../organization/create/OrganizationCreateModal";
import { Organization } from "@dewo/app/graphql/types";
import { useNavigateToOrganization } from "@dewo/app/util/navigation";

export const CreateOrganizationButton: FC = () => {
  const createOrganization = useToggle();
  const navigateToOrganization = useNavigateToOrganization();
  const handleOrganizationCreated = useCallback(
    async (organization: Organization) => {
      createOrganization.toggleOff();
      await navigateToOrganization(organization.id);
    },
    [createOrganization, navigateToOrganization]
  );

  return (
    <>
      <Tooltip title="Create Organization" placement="right">
        <Button
          type="text"
          className="dewo-sidebar-item"
          onClick={createOrganization.toggleOn}
        >
          <Avatar size={48} icon={<Icons.PlusOutlined />} />
        </Button>
      </Tooltip>
      <OrganizationCreateModal
        visible={createOrganization.value}
        onCancel={createOrganization.toggleOff}
        onCreated={handleOrganizationCreated}
      />
    </>
  );
};
