import { useToggle } from "@dewo/app/util/hooks";
import { Button, ButtonProps } from "antd";
import React, { FC, useCallback } from "react";
import { OrganizationCreateModal } from "../organization/create/OrganizationCreateModal";

export const CreateOrganizationButton: FC<ButtonProps> = (buttonProps) => {
  const createOrganization = useToggle();
  const onClick = buttonProps.onClick;
  const handleClick = useCallback(
    (event) => {
      onClick?.(event);
      createOrganization.toggleOn();
    },
    [onClick, createOrganization]
  );
  return (
    <>
      <Button {...buttonProps} onClick={handleClick} />
      <OrganizationCreateModal
        visible={createOrganization.isOn}
        onClose={createOrganization.toggleOff}
        onCreated={createOrganization.toggleOff}
      />
    </>
  );
};
