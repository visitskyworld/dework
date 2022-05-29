import React, { FC } from "react";
import { ButtonProps, Button } from "antd";
import { useToggle } from "@dewo/app/util/hooks";
import { CreateWorkspaceModal } from "./CreateWorkspaceModal";

interface Props extends ButtonProps {
  organizationId: string;
}

export const CreateWorkSpaceButton: FC<Props> = ({
  organizationId,
  ...buttonProps
}) => {
  const createModal = useToggle();

  return (
    <>
      <Button {...buttonProps} onClick={createModal.toggleOn} />
      <CreateWorkspaceModal
        organizationId={organizationId}
        visible={createModal.isOn}
        onClose={createModal.toggleOff}
      />
    </>
  );
};
