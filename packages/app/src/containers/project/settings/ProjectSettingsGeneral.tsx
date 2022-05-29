import { FormSection } from "@dewo/app/components/FormSection";
import { ProjectDetails, UpdateProjectInput } from "@dewo/app/graphql/types";
import { Typography, Divider, Space, Form, Input } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import { useUpdateProject } from "../hooks";
import { ProjectSettingsContributorSuggestions } from "./ProjectSettingsContributorSuggestions";
import { ProjectTaskExports } from "./ProjectTaskExports";

type FormValues = Omit<UpdateProjectInput, "id">;

interface Props {
  project: ProjectDetails;
}

export const ProjectSettingsGeneral: FC<Props> = ({ project }) => {
  const [form] = useForm<UpdateProjectInput>();
  const [projectName, setProjectName] = useState(project.name);
  const updateProject = useUpdateProject();

  const handleUpdateProject = useCallback(
    (changed: Partial<FormValues>) =>
      updateProject({ id: project.id, ...changed }),
    [project.id, updateProject]
  );

  const initialValues = useMemo<FormValues>(
    () => ({ options: project.options }),
    [project]
  );

  const onChangeProjectName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setProjectName(e.target.value);
    },
    []
  );
  const onBlurProjectName = useCallback(() => {
    if (projectName !== project.name)
      handleUpdateProject({ name: projectName });
  }, [projectName, handleUpdateProject, project?.name]);
  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={initialValues}
      onValuesChange={handleUpdateProject}
    >
      <Typography.Title level={4} style={{ marginBottom: 4 }}>
        General
      </Typography.Title>

      <Divider style={{ marginTop: 0 }} />

      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <FormSection label="Project Name">
          <Input
            value={projectName}
            onChange={onChangeProjectName}
            onBlur={onBlurProjectName}
          />
        </FormSection>
        <ProjectSettingsContributorSuggestions />
        <ProjectTaskExports projectId={project.id} projectName={project.name} />
      </Space>
    </Form>
  );
};
