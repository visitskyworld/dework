import React, { FC, useCallback, useMemo, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Space,
  Typography,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { FormSection } from "@dewo/app/components/FormSection";
import * as Icons from "@ant-design/icons";
import {
  useOrganizationDetails,
  useUpdateOrganization,
  useUpdateOrganizationDetail,
} from "../hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { EntityDetailType } from "@dewo/app/graphql/types";
import { OrganizationDetailFormItem } from "../overview/OrganizationDetailFormItem";
import { OrganizationTagSelectField } from "./OrganizationTagSelectField";
import { ImageUploadInput } from "../../fileUploads/ImageUploadInput";
import { MarkdownEditor } from "@dewo/app/components/markdownEditor/MarkdownEditor";

export interface FormValues {
  name: string;
  tagline?: string;
  description?: string;
  imageUrl?: string;
  tagIds: string[];
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
  const [form] = useForm<FormValues>();
  const { organization } = useOrganizationDetails(organizationId);
  const canUpdateOrganization = usePermission("update", "Organization");

  const updateOrganization = useUpdateOrganization();
  const updateOrganizationDetail = useUpdateOrganizationDetail();

  const tagIds = useMemo(
    () => organization?.tags.map((t) => t.id) ?? [],
    [organization?.tags]
  );
  const initialValues = useMemo<FormValues>(
    () => ({
      name: organization?.name ?? "",
      tagline: organization?.tagline ?? undefined,
      description: organization?.description ?? undefined,
      imageUrl: organization?.imageUrl ?? undefined,
      tagIds,
      discord: organization?.details.find((d) => d.type === "discord")?.value,
      twitter: organization?.details.find((d) => d.type === "twitter")?.value,
      website: organization?.details.find((d) => d.type === "website")?.value,
    }),
    [organization, tagIds]
  );

  const [values, setValues] = useState<FormValues>(initialValues);
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback(
    (_changed: Partial<FormValues>, values: FormValues) => {
      setValues(values);
      form.setFieldsValue(values);
    },
    [form]
  );

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
    <Form<FormValues>
      form={form}
      layout="vertical"
      requiredMark={false}
      onFinish={handleSubmit}
      onValuesChange={handleChange}
      style={{ maxWidth: 550 }}
      initialValues={initialValues}
    >
      <Typography.Title level={4} style={{ marginBottom: 4 }}>
        Organization profile
      </Typography.Title>
      <Divider style={{ marginTop: 0 }} />

      <Row gutter={[20, 16]} style={{ flexDirection: "row-reverse" }}>
        <Col xs={48} md={6} style={{ width: "100%" }}>
          <FormSection
            label="Profile Image"
            style={{ display: "inline-block", padding: 0 }}
          >
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
        </Col>

        <Col xs={48} md={18} flex={1}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter a display name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Tagline" name="tagline">
            <Input placeholder="No tagline..." />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <MarkdownEditor
              initialValue={initialValues?.description ?? undefined}
              editable
              mode="update"
            />
          </Form.Item>

          <OrganizationTagSelectField organizationId={organizationId} />

          <Form.Item
            label="Socials"
            style={{ marginTop: 20, marginBottom: 24 }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <OrganizationDetailFormItem
                type={EntityDetailType.discord}
                placeholder="https://discord.gg/invitecode"
              />
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
        </Col>
      </Row>
    </Form>
  );
};
