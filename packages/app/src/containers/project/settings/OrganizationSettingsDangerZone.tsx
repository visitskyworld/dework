import React, { FC, useCallback, useState } from "react";
import { Button, Card, Form, Input, message, Typography } from "antd";

import { useRouter } from "next/router";
import { useToggle } from "@dewo/app/util/hooks";
import { FormSection } from "@dewo/app/components/FormSection";
import {
  useOrganization,
  useUpdateOrganization,
} from "../../organization/hooks";

interface Props {
  organizationId: string;
}

export const OrganizationSettingsDangerZone: FC<Props> = ({
  organizationId,
}) => {
  const organization = useOrganization(organizationId);

  const updateOrganization = useUpdateOrganization();
  const deletingOrganization = useToggle(false);
  const router = useRouter();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChangeName = (e: React.FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };
  const deleteOrganization = useCallback(async () => {
    setLoading(true);
    try {
      await updateOrganization({
        id: organizationId,
        deletedAt: new Date().toISOString(),
      });
      setLoading(false);
      message.success("Organization deleted!");
      await router.push("/");
    } catch (e) {
      message.error("Could not delete organization!");
      setLoading(false);
    }
  }, [updateOrganization, organizationId, router]);
  const toggle = useCallback(() => {
    setName("");
    deletingOrganization.toggle();
  }, [deletingOrganization]);
  return (
    <FormSection label="DANGER ZONE">
      <Card
        className="dewo-danger-zone bg-body-secondary"
        size="small"
        bodyStyle={{ padding: 10 }}
      >
        <Form.Item name="delete" style={{ margin: 0 }}>
          <Button onClick={toggle}>Delete Organization</Button>

          {deletingOrganization.isOn && (
            <>
              <Typography.Paragraph
                type="secondary"
                style={{ marginBottom: 8, marginTop: 8 }}
              >
                Enter the organization name to delete the organization. This
                action is not reversible.
              </Typography.Paragraph>
              <Input
                placeholder="Type organization name to confirm"
                onChange={handleChangeName}
                style={{ marginBottom: 16 }}
              />
              <Button
                danger
                loading={loading}
                disabled={name !== organization?.name}
                onClick={deleteOrganization}
              >
                I understand the consequences, delete this organization
              </Button>
            </>
          )}
        </Form.Item>
      </Card>
    </FormSection>
  );
};
