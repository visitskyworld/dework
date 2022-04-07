import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Avatar, Button, Form, Input, Row, Typography } from "antd";
import React, { FC, useCallback, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import { ImageUploadInput } from "../../fileUploads/ImageUploadInput";
import { useForm } from "antd/lib/form/Form";
import { ThreepidSource, UpdateUserInput } from "@dewo/app/graphql/types";
import { useRunningCallback } from "@dewo/app/util/hooks";
import { useUpdateUser } from "../../user/hooks";
import { ThreepidAuthButton } from "../../auth/buttons/ThreepidAuthButton";

interface Props {
  onNext(): void;
}

export const OnboardingProfile: FC<Props> = ({ onNext }) => {
  const { user, logout } = useAuthContext();
  const initialValues = useMemo(
    () => ({
      username: user?.username.startsWith("deworker")
        ? undefined
        : user?.username,
      imageUrl: user?.imageUrl,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [!!user]
  );

  const [form] = useForm<UpdateUserInput>();
  const [values, setValues] = useState<UpdateUserInput>(initialValues);
  const handleChange = useCallback(
    (_changed: Partial<UpdateUserInput>, values: UpdateUserInput) =>
      setValues(values),
    []
  );

  const showDiscord = useMemo(
    () => !user?.threepids.some((t) => t.source === ThreepidSource.discord),
    [user?.threepids]
  );

  const updateUser = useUpdateUser();
  const [submit, submitting] = useRunningCallback(
    async (values: UpdateUserInput) => await updateUser(values).then(onNext),
    [updateUser, onNext]
  );

  if (!user) return null;
  return (
    <Form
      form={form}
      initialValues={initialValues}
      className="mx-auto w-full"
      style={{
        flex: 1,
        gap: 8,
        display: "flex",
        flexDirection: "column",
        maxWidth: 368,
      }}
      onValuesChange={handleChange}
      onFinish={submit}
    >
      <Typography.Title level={2} style={{ textAlign: "center" }}>
        What do you go by, anon?
      </Typography.Title>
      <Row
        align="middle"
        justify="center"
        style={{ rowGap: 16, flex: 1, flexDirection: "column" }}
      >
        <Form.Item name="imageUrl">
          <ImageUploadInput>
            <Avatar
              size={128}
              style={{ fontSize: 36 }}
              src={values.imageUrl}
              className="bg-component hover:component-highlight hover:cursor-pointer"
              icon={<Icons.UserAddOutlined style={{ opacity: 0.5 }} />}
            />
          </ImageUploadInput>
        </Form.Item>

        <Form.Item
          name="username"
          style={{ width: "100%", textAlign: "center" }}
          rules={[{ required: true, message: "Please enter a username" }]}
        >
          <Input
            size="large"
            autoComplete="off"
            spellCheck={false}
            style={{ textAlign: "center" }}
            className="ant-typography-h3"
            placeholder="Enter username..."
          />
        </Form.Item>
      </Row>

      {showDiscord && (
        <ThreepidAuthButton
          block
          size="large"
          source={ThreepidSource.discord}
          children="Import from Discord"
          type="primary"
        />
      )}
      <Button
        block
        size="large"
        type={showDiscord ? "default" : "primary"}
        htmlType="submit"
        loading={submitting}
        style={{ alignSelf: "center" }}
      >
        Continue
      </Button>

      <Button
        type="text"
        size="small"
        className="text-secondary"
        style={{ alignSelf: "center" }}
        onClick={logout}
      >
        Already have an account?
      </Button>
    </Form>
  );
};
