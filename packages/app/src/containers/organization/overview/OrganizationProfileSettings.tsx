import React, { FC, useCallback, useMemo, useState } from "react";
import { Button, Divider, Form, Input, message, Space, Typography } from "antd";
import {
  useOrganization,
  useUpdateOrganization,
  useUpdateOrganizationDetail,
} from "../hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { EntityDetailType } from "@dewo/app/graphql/types";
import { OrganizationDetailFormItem } from "./OrganizationDetailFormItem";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { useForm } from "antd/lib/form/Form";
import { FormSection } from "@dewo/app/components/FormSection";
import * as Icons from "@ant-design/icons";
import { ImageUploadInput } from "../../fileUploads/ImageUploadInput";

interface FormValues {
  name: string;
  tagline?: string;
  description?: string;
  imageUrl?: string;
  discord?: string;
  twitter?: string;
  website?: string;
}

interface OrganizationProfileSettingsProps {
  organizationId: string;
}

export const OrganizationProfileSettings: FC<
  OrganizationProfileSettingsProps
> = ({ organizationId }) => {
  const organization = useOrganization(organizationId);
  const initialValues = useMemo<FormValues>(
    () => ({
      name: organization?.name ?? "",
      tagline: organization?.tagline ?? undefined,
      description: organization?.description ?? undefined,
      discord: organization?.details.find((d) => d.type === "discord")?.value,
      twitter: organization?.details.find((d) => d.type === "twitter")?.value,
      website: organization?.details.find((d) => d.type === "website")?.value,
    }),
    [organization]
  );

  const [form] = useForm<FormValues>();
  const [values, setValues] = useState<FormValues>(initialValues);
  const handleChange = useCallback(
    (_changed: Partial<FormValues>, values: FormValues) => {
      setValues(values);
      form.setFieldsValue(values);
    },
    [form]
  );

  const canUpdateOrganization = usePermission("update", "Organization");

  const updateOrganization = useUpdateOrganization();
  const updateOrganizationDetail = useUpdateOrganizationDetail();

  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        setLoading(true);
        const { discord, twitter, website, ...organizationValues } = values;

        await Promise.all([
          discord !== initialValues.discord &&
            updateOrganizationDetail({
              organizationId,
              type: EntityDetailType.discord,
              value: discord,
            }),
          twitter !== initialValues.twitter &&
            updateOrganizationDetail({
              organizationId,
              type: EntityDetailType.twitter,
              value: twitter,
            }),
          website !== initialValues.website &&
            updateOrganizationDetail({
              organizationId,
              type: EntityDetailType.website,
              value: website,
            }),
          updateOrganization({ id: organizationId, ...organizationValues }),
        ]);

        message.success({
          content: "Organization profile updated!",
          type: "success",
        });
      } catch {
        message.error({
          content: "Failed to update organization profile",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    [
      organizationId,
      initialValues,
      updateOrganization,
      updateOrganizationDetail,
    ]
  );

  if (!organization) return null;

  return (
    <Space
      direction="vertical"
      style={{ width: "100%", paddingLeft: 16, paddingRight: 16 }}
    >
      <Form<FormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleSubmit}
        onValuesChange={handleChange}
        style={{ maxWidth: 480 }}
        initialValues={initialValues}
      >
        <Typography.Title level={4} style={{ marginBottom: 4 }}>
          Organization profile
        </Typography.Title>
        <Divider style={{ marginTop: 0 }} />

        <FormSection label="Profile Image" style={{ display: "inline-block" }}>
          <OrganizationAvatar
            size={96}
            organization={{
              id: organization.id,
              name: values.name,
              imageUrl: values.imageUrl ?? null,
            }}
          />
          <Form.Item
            name="imageUrl"
            style={{ position: "absolute", right: 0, bottom: 0, margin: 0 }}
          >
            <ImageUploadInput>
              <Button
                icon={<Icons.EditOutlined />}
                shape="circle"
                type="primary"
                className="bg-body"
              />
            </ImageUploadInput>
          </Form.Item>
        </FormSection>

        <Form.Item
          label="Name"
          name="name"
          initialValue={organization.name}
          rules={[{ required: true, message: "Please enter a display name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tagline"
          name="tagline"
          initialValue={organization.tagline}
        >
          <Input placeholder="No tagline..." />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          initialValue={organization.description}
        >
          <Input.TextArea placeholder="No description..." />
        </Form.Item>

        <Form.Item label="Socials" style={{ marginTop: 20, marginBottom: 24 }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <OrganizationDetailFormItem type={EntityDetailType.discord} />
            <OrganizationDetailFormItem type={EntityDetailType.twitter} />
            <OrganizationDetailFormItem type={EntityDetailType.website} />
          </Space>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="middle"
          loading={loading}
          disabled={!canUpdateOrganization}
        >
          Update profile
        </Button>
      </Form>
    </Space>
  );
};
