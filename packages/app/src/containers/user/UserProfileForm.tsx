import React, { FC, useCallback, useMemo } from "react";
import { Button, Col, Form, message, Row, Typography } from "antd";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useUpdateUser, useUser, useUpdateUserDetail } from "./hooks";
import { EntityDetailType } from "@dewo/app/graphql/types";
import { EditUserAvatarButton } from "./EditUserAvatarButton";
import { UserDetails } from "./UserDetails";
import { useToggle } from "@dewo/app/util/hooks";

interface Props {
  userId: string;
  defaultEditing?: boolean;
  showDetails?: boolean;
  onSaved?(): void;
}

export const UserProfileForm: FC<Props> = ({
  userId,
  defaultEditing = false,
  showDetails = true,
  onSaved,
}) => {
  const user = useUser(userId);
  const currentUserId = useAuthContext().user?.id;
  const isMe = userId === currentUserId;
  const updateUser = useUpdateUser();
  const updateUserDetail = useUpdateUserDetail();
  const updateUsername = useCallback(
    (username: string) => updateUser({ username }),
    [updateUser]
  );
  const updateBio = useCallback(
    (bio: string) => updateUser({ bio }),
    [updateUser]
  );

  const [form] = Form.useForm();
  const editing = useToggle(defaultEditing);
  const loading = useToggle(false);

  type InititalValues = Record<string, string>;

  const intitialValues: InititalValues = useMemo(
    () =>
      user?.details.reduce((a, v) => ({ ...a, [v.type]: v.value }), {}) ?? {},
    [user?.details]
  );

  const onSubmit = useCallback(
    async (values: InititalValues) => {
      try {
        loading.toggleOn();
        await Promise.all(
          Object.entries(values).map(([type, value]) =>
            updateUserDetail({ type: type as EntityDetailType, value })
          )
        );
        message.success("Profile updated!");
        onSaved?.();
      } catch {
        message.error("Failed to update user details");
      } finally {
        editing.toggleOff();
        loading.toggleOff();
      }
    },
    [editing, loading, updateUserDetail, onSaved]
  );

  if (!user) return null;
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={intitialValues}
      onFinish={onSubmit}
    >
      <Row style={{ display: "grid", placeItems: "center" }}>
        <Row style={{ position: "relative", display: "inline-block" }}>
          <UserAvatar user={user} size={96} />
          {editing.isOn && <EditUserAvatarButton />}
        </Row>
      </Row>

      <Typography.Title
        level={3}
        style={{ marginTop: 8, marginBottom: 0, textAlign: "center" }}
        editable={editing.isOn ? { onChange: updateUsername } : undefined}
      >
        {user.username}
      </Typography.Title>

      <Typography.Paragraph
        type="secondary"
        style={{ textAlign: "center" }}
        editable={editing.isOn ? { onChange: updateBio } : undefined}
      >
        {!!user.bio ? user.bio : "No bio..."}
      </Typography.Paragraph>

      {showDetails && (
        <UserDetails isEditMode={editing.isOn} userDetails={user.details} />
      )}

      {!!isMe && !!editing.isOn && (
        <Row gutter={8} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={loading.isOn}
            >
              Save
            </Button>
          </Col>
          <Col span={12}>
            <Button block onClick={editing.toggle} disabled={loading.isOn}>
              Cancel
            </Button>
          </Col>
        </Row>
      )}
      {!!isMe && !editing.isOn && (
        <Button
          block
          type="ghost"
          style={{ marginTop: 16 }}
          onClick={editing.toggle}
        >
          Edit Profile
        </Button>
      )}
    </Form>
  );
};
