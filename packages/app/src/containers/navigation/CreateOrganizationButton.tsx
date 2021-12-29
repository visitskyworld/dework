import { useToggle } from "@dewo/app/util/hooks";
import { Button, ButtonProps } from "antd";
import React, { FC, useCallback } from "react";
import { OrganizationCreateModal } from "../organization/create/OrganizationCreateModal";
import { Organization } from "@dewo/app/graphql/types";
import { useNavigateToOrganization } from "@dewo/app/util/navigation";

export const CreateOrganizationButton: FC<ButtonProps> = (buttonProps) => {
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
      <Button {...buttonProps} onClick={createOrganization.toggleOn} />
      <OrganizationCreateModal
        visible={createOrganization.isOn}
        onCancel={createOrganization.toggleOff}
        onCreated={handleOrganizationCreated}
      />
    </>
  );
};
