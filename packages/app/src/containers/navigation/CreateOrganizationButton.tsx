import { useToggle } from "@dewo/app/util/hooks";
import { Avatar, Button, Tooltip } from "antd";
import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { OrganizationCreateModal } from "../organization/create/OrganizationCreateModal";
import { useRouter } from "next/router";
import { Organization } from "@dewo/app/graphql/types";

export const CreateOrganizationButton: FC = () => {
  const router = useRouter();
  const createOrganization = useToggle();
  const navigateToOrganization = useCallback(
    async (id: string) =>
      await router.push(
        "/organization/[organizationId]",
        `/organization/${id}`
      ),
    [router]
  );
  const handleOrganizationCreated = useCallback(
    async (organization: Organization) => {
      createOrganization.onToggleOff();
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
          onClick={createOrganization.onToggleOn}
        >
          <Avatar size={48} icon={<Icons.PlusOutlined />} />
        </Button>
      </Tooltip>
      <OrganizationCreateModal
        visible={createOrganization.value}
        onCancel={createOrganization.onToggleOff}
        onCreated={handleOrganizationCreated}
      />
    </>
  );
};
