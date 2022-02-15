import { useToggle } from "@dewo/app/util/hooks";
import { Button, ButtonProps } from "antd";
import React, { FC } from "react";
import { OrganizationCreateModal } from "../organization/create/OrganizationCreateModal";

export const CreateOrganizationButton: FC<ButtonProps> = (buttonProps) => {
  const createOrganization = useToggle();
  return (
    <>
      <Button {...buttonProps} onClick={createOrganization.toggleOn} />
      <OrganizationCreateModal
        visible={createOrganization.isOn}
        onClose={createOrganization.toggleOff}
      />
    </>
  );
};
