import { Project } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { Button, Menu } from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback } from "react";
import Link from "next/link";
import { useOrganization } from "../hooks";
import { ProjectCreateModal } from "../../project/create/ProjectCreateModal";

interface OrganizationOverviewProps {
  organizationId: string;
}

export const OrganizationOverview: FC<OrganizationOverviewProps> = ({
  organizationId,
}) => {
  const organization = useOrganization(organizationId);

  const createProject = useToggle();
  const router = useRouter();
  const handleProjectCreated = useCallback(
    async (project: Project) => {
      createProject.onToggleOff();
      await router.push(
        "/organization/[organizationId]/project/[projectId]",
        `/organization/${organizationId}/project/${project.id}`
      );
    },
    [router, createProject, organizationId]
  );

  return (
    <>
      Projects
      <Menu>
        {organization?.projects.map((project) => (
          <Menu.Item key={project.id}>
            <Link
              href={`/organization/${organizationId}/project/${project.id}`}
            >
              <a>{project.name}</a>
            </Link>
          </Menu.Item>
        ))}
      </Menu>
      <Button onClick={createProject.onToggleOn}>Create Project</Button>
      <ProjectCreateModal
        visible={createProject.value}
        organizationId={organizationId}
        onCancel={createProject.onToggleOff}
        onCreated={handleProjectCreated}
      />
    </>
  );
};
