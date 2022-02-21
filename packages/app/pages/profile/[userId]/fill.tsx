import React, { useCallback, useEffect, useMemo } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import * as qs from "query-string";
import {
  Alert,
  Button,
  Form,
  Input,
  Layout,
  message,
  Modal,
  Row,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { FormSection } from "@dewo/app/components/FormSection";
import { useToggle } from "@dewo/app/util/hooks";
import {
  useUpdateUser,
  useUpdateUserDetail,
} from "@dewo/app/containers/user/hooks";
import { EntityDetailType, ThreepidSource } from "@dewo/app/graphql/types";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { EditUserAvatarButton } from "@dewo/app/containers/user/EditUserAvatarButton";
import {
  renderThreepidIcon,
  ThreepidAuthButton,
} from "@dewo/app/containers/auth/ThreepidAuthButton";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";

const ProfileFill: NextPage = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const redirectPath = router.query.redirect as string;
  const prefilledUsername = router.query.username as string;

  const updateUser = useUpdateUser();
  const updateUserDetail = useUpdateUserDetail();

  const [form] = Form.useForm();
  const loading = useToggle(false);

  type InititalValues = Record<string, string>;
  const intitialValues: InititalValues = useMemo(
    () => ({
      username: prefilledUsername ? prefilledUsername : user?.username ?? "",
      discord: user?.details.find((d) => d.type === "discord")?.value ?? "",
    }),
    [prefilledUsername, user?.username, user?.details]
  );

  const state = useMemo(
    () => ({
      redirect: user?.username.startsWith("deworker")
        ? qs.stringifyUrl({
            url: router.asPath,
            query: { username: user?.username },
          })
        : redirectPath,
    }),
    [redirectPath, router.asPath, user?.username]
  );

  useEffect(() => {
    if (!user || !redirectPath) {
      router.push("/");
    }
  }, [router, redirectPath, user]);

  const onSubmit = useCallback(
    async (values: InititalValues) => {
      try {
        loading.toggleOn();
        await updateUser({
          username: values.username,
        });
        await updateUserDetail({
          type: EntityDetailType.discord,
          value: values.discord,
        });
        await router.push(redirectPath);
      } catch {
        message.error("Failed to update user details");
      } finally {
        loading.toggleOff();
      }
    },
    [loading, redirectPath, router, updateUser, updateUserDetail]
  );

  const onCancel = useCallback(async () => {
    await router.push(redirectPath);
  }, [redirectPath, router]);

  return (
    <Layout>
      <Layout.Content>
        <Modal
          title="Introduce yourself"
          visible
          footer={null}
          style={{ maxWidth: 340 }}
          onCancel={onCancel}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={intitialValues}
            onFinish={onSubmit}
            key={user?.id}
          >
            <Space
              direction="vertical"
              size="small"
              style={{
                width: "100%",
              }}
            >
              <Row
                style={{
                  display: "grid",
                  placeItems: "center",
                  marginBottom: 8,
                }}
              >
                <Row style={{ position: "relative", display: "inline-block" }}>
                  {!!user ? (
                    <UserAvatar user={user} size={80} />
                  ) : (
                    <Skeleton.Avatar active size={80} />
                  )}
                  <EditUserAvatarButton />
                </Row>
              </Row>
              <FormSection label="Username">
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: "Username can't be blank" },
                  ]}
                >
                  <Input placeholder="What should we call you?" />
                </Form.Item>
              </FormSection>
              {user?.threepids.some(
                (t) => t.source === ThreepidSource.discord
              ) ? (
                <Alert
                  key="discord-connected"
                  message={`Connected with Discord`}
                  icon={renderThreepidIcon[ThreepidSource.discord]}
                  type="success"
                  showIcon
                />
              ) : (
                <ThreepidAuthButton
                  key="connect-discord"
                  source={ThreepidSource.discord}
                  children="Connect with Discord"
                  style={{ width: "100%" }}
                  state={state}
                />
              )}

              <Typography.Paragraph type="secondary">
                Connecting to Discord helps organization members recognize who
                you are.
              </Typography.Paragraph>
              <Button
                block
                type="primary"
                htmlType="submit"
                loading={loading.isOn}
                style={{ width: "100%" }}
              >
                Continue
              </Button>
            </Space>
          </Form>
        </Modal>
      </Layout.Content>
    </Layout>
  );
};

export default ProfileFill;
