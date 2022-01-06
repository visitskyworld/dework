import React, { FC, useCallback, useState } from "react";
import { useToggle } from "@dewo/app/util/hooks";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Radio,
  Typography,
} from "antd";
import * as Icons from "@ant-design/icons";
import { ProjectDetails, ProjectVisibility } from "@dewo/app/graphql/types";
import { useUpdateProject } from "../hooks";
import { Can } from "@dewo/app/contexts/PermissionsContext";
import { uuidToBase62 } from "@dewo/app/util/uuid";
import { useRouter } from "next/router";

interface Props {
  mode: "create" | "update";
  project?: ProjectDetails;
}

export const ProjectSettingsFormFields: FC<Props> = ({ mode, project }) => {
  const advancedOptions = useToggle(true);
  const updateProject = useUpdateProject();
  const router = useRouter();
  const [deletingProject, setDeletingProject] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const handleDeleteConfirmation = (e: React.FormEvent<HTMLInputElement>) => {
    setConfirmDelete(e.currentTarget.value === project?.name!);
  };
  const deleteProject = useCallback(() => {
    updateProject({ id: project?.id!, deletedAt: new Date().toISOString() });
    router.push({ pathname: `/o/${uuidToBase62(project?.organizationId!)}` });
  }, [updateProject, project?.id, project?.organizationId, router]);

  return (
    <>
      <Form.Item
        label="Visibility"
        name="visibility"
        tooltip="By default all projects are public. Make a project private if you only want to share it with invited contributors."
      >
        <Radio.Group>
          <Radio.Button value={ProjectVisibility.PUBLIC}>Public</Radio.Button>
          <Radio.Button value={ProjectVisibility.PRIVATE}>Private</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Divider plain>
        <Button
          type="text"
          style={{ padding: "0 8px", height: "unset" }}
          className="text-secondary"
          onClick={advancedOptions.toggle}
        >
          Advanced
          {advancedOptions.isOn ? <Icons.UpOutlined /> : <Icons.DownOutlined />}
        </Button>
      </Divider>

      <Form.Item hidden={!advancedOptions.isOn}>
        <Form.Item
          name={["options", "showBacklogColumn"]}
          valuePropName="checked"
          label="Contributor Suggestions"
          tooltip="Show a column to the left of 'To Do' where contributors can suggest and vote on tasks."
        >
          <Checkbox>Enable Suggestions Column</Checkbox>
        </Form.Item>
      </Form.Item>

      {mode === "update" && (
        <Can I="delete" a="Task">
          <Form.Item hidden={!advancedOptions.isOn}>
            <Form.Item name="delete" label="Danger Zone">
              <Button danger onClick={() => setDeletingProject(true)}>
                Delete Project
              </Button>

              {deletingProject && (
                <>
                  <Typography.Paragraph
                    type="secondary"
                    style={{ marginBottom: 8, marginTop: 8 }}
                  >
                    Enter the project name to delete the project. This action is
                    not reversible.
                  </Typography.Paragraph>
                  <Input
                    placeholder="Type project name to confirm"
                    onChange={handleDeleteConfirmation}
                    style={{ marginBottom: 16 }}
                  />
                  <Button
                    danger
                    disabled={!confirmDelete}
                    onClick={deleteProject}
                  >
                    I understand the consequences, delete this project
                  </Button>
                </>
              )}
            </Form.Item>
          </Form.Item>
        </Can>
      )}
    </>
  );
};
