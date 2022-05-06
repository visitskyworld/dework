import React, { FC, useCallback, useState } from "react";
import { Button, Card, Form, Input, message, Typography } from "antd";

import { useRouter } from "next/router";
import { useRunning, useToggle } from "@dewo/app/util/hooks";
import { FormSection } from "@dewo/app/components/FormSection";
import {
  useDeleteOrganization,
  useOrganization,
} from "../../organization/hooks";

interface Props {
  organizationId: string;
}

export const OrganizationSettingsDangerZone: FC<Props> = ({
  organizationId,
}) => {
  const organization = useOrganization(organizationId);

  const deleteOrganization = useDeleteOrganization();
  const router = useRouter();
  const [handleDelete, deleting] = useRunning(
    useCallback(
      async () =>
        await deleteOrganization(organizationId)
          .then(() => {
            message.success("Organization deleted!");
            router.push("/");
          })
          .catch(() => message.error("Could not delete organization!")),
      [deleteOrganization, organizationId, router]
    )
  );

  const deletingOrganization = useToggle(false);

  const [name, setName] = useState("");
  const handleChangeName = (e: React.FormEvent<HTMLInputElement>) =>
    setName(e.currentTarget.value);
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
                loading={deleting}
                disabled={name !== organization?.name}
                onClick={handleDelete}
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
