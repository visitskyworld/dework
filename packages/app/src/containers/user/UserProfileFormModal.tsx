import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Button, Input, Modal, Row, Skeleton, Space } from "antd";
import React, { FC, useCallback, useState } from "react";
import { EditUserAvatarButton } from "./EditUserAvatarButton";
import { useUpdateUser } from "./hooks";

interface Props {
  visible: boolean;
  showDetails?: boolean;
  onDone?(): void;
}

export const UserProfileFormModal: FC<Props> = ({ visible, onDone }) => {
  const { user } = useAuthContext();

  const [username, setUsername] = useState(
    user?.username.startsWith("deworker") ? "" : user?.username ?? ""
  );
  const updateUser = useUpdateUser();
  const hanleSave = useCallback(
    async () => updateUser({ username }).then(onDone),
    [updateUser, username, onDone]
  );

  return (
    <Modal
      visible={visible}
      footer={null}
      title="Create Profile"
      width={368}
      closable={false}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Row style={{ display: "grid", placeItems: "center" }}>
          <Row style={{ position: "relative", display: "inline-block" }}>
            {!!user ? (
              <UserAvatar user={{ ...user, username }} size={96} />
            ) : (
              <Skeleton.Avatar active size={96} />
            )}
            <EditUserAvatarButton />
          </Row>
        </Row>

        <Input
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ textAlign: "center" }}
          className="dewo-field dewo-field-focus-border ant-typography-h3"
          placeholder="Enter a username..."
        />

        <Button type="primary" block disabled={!username} onClick={hanleSave}>
          Save
        </Button>
      </Space>
    </Modal>
  );
};
