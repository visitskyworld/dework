import React, { useCallback, useEffect, useMemo } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Button,
  Form,
  Input,
  Layout,
  message,
  Modal,
  Row,
  Skeleton,
  Space,
} from "antd";
import { FormSection } from "@dewo/app/components/FormSection";
import { useToggle } from "@dewo/app/util/hooks";
import {
  useUpdateUser,
  useUpdateUserDetail,
  useUser,
} from "@dewo/app/containers/user/hooks";
import { EntityDetailType } from "@dewo/app/graphql/types";
import { OrganizationDetailFormItem } from "@dewo/app/containers/organization/overview/OrganizationDetailFormItem";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { EditUserAvatarButton } from "@dewo/app/containers/user/EditUserAvatarButton";

const ProfileFill: NextPage = () => {
  const router = useRouter();
  const userId = useRouter().query.userId as string;
  const redirectPath = router.query.redirect as string;
  const user = useUser(userId);
  const updateUser = useUpdateUser();
  const updateUserDetail = useUpdateUserDetail();

  const [form] = Form.useForm();
  const loading = useToggle(false);
  type InititalValues = Record<string, string>;
  const intitialValues: InititalValues = useMemo(
    () => ({
      username: user?.username ?? "",
      discord: user?.details.find((d) => d.type === "discord")?.value ?? "",
    }),
    [user?.username, user?.details]
  );

  useEffect(() => {
    if (!userId || !redirectPath) {
      router.push("/");
    }
  }, [router, redirectPath, userId]);

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

  return (
    <Layout key={userId}>
      <Layout.Content>
        <Modal visible footer={null} closable={false} style={{ maxWidth: 320 }}>
          <Form
            form={form}
            layout="vertical"
            initialValues={intitialValues}
            onFinish={onSubmit}
          >
            <Space
              direction="vertical"
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
              <div>
                <FormSection label="Username">
                  <Form.Item
                    name="username"
                    rules={[
                      { required: true, message: "Username can't be blank" },
                    ]}
                  >
                    <Input placeholder="Enter a username..." />
                  </Form.Item>
                </FormSection>
                <FormSection label="Discord">
                  <OrganizationDetailFormItem
                    type={EntityDetailType.discord}
                    ruleType="string"
                  />
                </FormSection>
              </div>
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
