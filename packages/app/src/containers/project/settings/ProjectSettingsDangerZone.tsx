import React, { FC, useCallback, useState } from "react";
import { Button, Card, Form, Input, Typography } from "antd";
import { ProjectDetails } from "@dewo/app/graphql/types";
import { useUpdateProject } from "../hooks";
import { uuidToBase62 } from "@dewo/app/util/uuid";
import { useRouter } from "next/router";
import { useToggle } from "@dewo/app/util/hooks";
import { FormSection } from "@dewo/app/components/FormSection";

interface Props {
  project: ProjectDetails;
}

export const ProjectSettingsDangerZone: FC<Props> = ({ project }) => {
  const updateProject = useUpdateProject();
  const deletingProject = useToggle(false);
  const router = useRouter();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const handleDeleteConfirmation = (e: React.FormEvent<HTMLInputElement>) => {
    setConfirmDelete(e.currentTarget.value === project?.name!);
  };
  const deleteProject = useCallback(async () => {
    await updateProject({
      id: project?.id!,
      deletedAt: new Date().toISOString(),
    });
    router.push({ pathname: `/o/${uuidToBase62(project?.organizationId!)}` });
  }, [updateProject, project?.id, project?.organizationId, router]);

  return (
    <FormSection label="DANGER ZONE">
      <Card
        className="dewo-danger-zone"
        size="small"
        bodyStyle={{ padding: 10 }}
      >
        <Form.Item name="delete" style={{ margin: 0 }}>
          <Button onClick={deletingProject.toggle}>Delete Project</Button>

          {deletingProject.isOn && (
            <>
              <Typography.Paragraph
                type="secondary"
                style={{ marginBottom: 8, marginTop: 8 }}
              >
                Enter the project name to delete the project. This action is not
                reversible.
              </Typography.Paragraph>
              <Input
                placeholder="Type project name to confirm"
                onChange={handleDeleteConfirmation}
                style={{ marginBottom: 16 }}
              />
              <Button danger disabled={!confirmDelete} onClick={deleteProject}>
                I understand the consequences, delete this project
              </Button>
            </>
          )}
        </Form.Item>
      </Card>
    </FormSection>
  );
};
