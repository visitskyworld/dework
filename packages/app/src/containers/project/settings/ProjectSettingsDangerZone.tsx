import React, { FC, useCallback, useState } from "react";
import { Button, Form, Input, Typography } from "antd";
import { ProjectDetails } from "@dewo/app/graphql/types";
import { useUpdateProject } from "../hooks";
import { Can } from "@dewo/app/contexts/PermissionsContext";
import { uuidToBase62 } from "@dewo/app/util/uuid";
import { useRouter } from "next/router";
import { useToggle } from "@dewo/app/util/hooks";

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
    <Can I="delete" a="Project">
      <Form.Item name="delete" label="Danger Zone">
        <Button danger onClick={deletingProject.toggle}>
          Delete Project
        </Button>

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
    </Can>
  );
};
