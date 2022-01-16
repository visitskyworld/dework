import { Modal } from "antd";
import React, { FC } from "react";
import { UserProfileForm } from "./UserProfileForm";

interface Props {
  userId: string;
  visible: boolean;
  showDetails?: boolean;
  defaultEditing?: boolean;
  onCancel(): void;
  onSaved?(): void;
}

export const UserProfileFormModal: FC<Props> = ({
  userId,
  visible,
  showDetails,
  defaultEditing,
  onCancel,
  onSaved,
}) => {
  return (
    <Modal
      visible={visible}
      footer={null}
      title="Create Profile"
      width={368}
      onCancel={onCancel}
    >
      <UserProfileForm
        userId={userId}
        showDetails={showDetails}
        defaultEditing={defaultEditing}
        onSaved={onSaved}
      />
    </Modal>
  );
};
