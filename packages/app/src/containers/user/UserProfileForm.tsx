import React, { FC, useCallback, useMemo } from "react";
import { Button, Col, Form, message, Row, Typography, Space } from "antd";
import { InputWithLabel } from "./InputWithLabel";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useUpdateUser, useUpdateUserDetail, useUser } from "./hooks";
import { EntityDetailType } from "@dewo/app/graphql/types";
import { EditUserAvatarButton } from "./EditUserAvatarButton";
import { UserDetails } from "./UserDetails";
import { useToggle } from "@dewo/app/util/hooks";
import router from "next/router";

interface Props {
  userId: string;
  onSaved?(): void;
}

export const UserProfileForm: FC<Props> = ({ userId, onSaved }) => {
  const user = useUser(userId);
  const currentUserId = useAuthContext().user?.id;
  const isMe = userId === currentUserId;
  const updateUser = useUpdateUser();
  const updateUserDetail = useUpdateUserDetail();

  const [form] = Form.useForm();
  const editing = useToggle();
  const loading = useToggle(false);

  type InititalValues = Record<string, string>;

  const intitialValues: InititalValues = useMemo(
    () => ({
      username: user?.username ?? "",
      bio: user?.bio ?? "",
      ...(user?.details.reduce((a, v) => ({ ...a, [v.type]: v.value }), {}) ??
        {}),
    }),
    [user?.username, user?.bio, user?.details]
  );

  const onSubmit = useCallback(
    async (values: InititalValues) => {
      try {
        loading.toggleOn();
        const changedUsername = values.username !== intitialValues.username;
        const changedBio = values.bio !== intitialValues.bio;
        const changedDetails = Object.entries(values).filter(
          ([t, v]) => t !== "bio" && t !== "username" && v !== intitialValues[t]
        );

        if (changedUsername || changedBio) {
          await updateUser({ username: values.username, bio: values.bio });
        }
        if (changedDetails) {
          await Promise.all(
            Object.values(changedDetails).map(([type, value]) =>
              updateUserDetail({ type: type as EntityDetailType, value })
            )
          );
        }
        if (changedUsername || changedBio || changedDetails.length) {
          message.success("Profile updated!");
          onSaved?.();
        }

        if (changedUsername) {
          router.replace({ query: { username: values.username } });
        }
      } catch {
        message.error("Failed to update user details");
      } finally {
        editing.toggleOff();
        loading.toggleOff();
      }
    },
    [editing, loading, intitialValues, onSaved, updateUser, updateUserDetail]
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

      {editing.isOn ? (
        <Space
          direction="vertical"
          style={{ width: "100%", marginTop: 12, marginBottom: 16 }}
        >
          <InputWithLabel
            name="username"
            label="Username"
            placeholder="Type your username..."
          />
          <InputWithLabel name="bio" label="Bio" placeholder="Add a bio..." />
        </Space>
      ) : (
        <>
          <Typography.Title
            level={3}
            style={{ marginTop: 8, marginBottom: 0, textAlign: "center" }}
          >
            {user.username}
          </Typography.Title>
          <Typography.Paragraph
            type="secondary"
            style={{ textAlign: "center" }}
          >
            {!!user.bio ? user.bio : "No bio..."}
          </Typography.Paragraph>
        </>
      )}

      <UserDetails isEditMode={editing.isOn} userDetails={user.details} />

      {!!isMe && !!editing.isOn && (
        <Row gutter={8} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Button block onClick={editing.toggle} disabled={loading.isOn}>
              Cancel
            </Button>
          </Col>
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
