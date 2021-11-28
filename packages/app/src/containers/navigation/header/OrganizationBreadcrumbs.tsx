import { Breadcrumb } from "antd";
import React, { FC, useMemo } from "react";
import Link from "next/link";
import { useOrganization } from "../../organization/hooks";

interface OrganizationBreadcrumbProps {
  organizationId: string;
  projectId?: string;
}

export const OrganizationBreadcrumbs: FC<OrganizationBreadcrumbProps> = ({
  organizationId,
  projectId,
}) => {
  const organization = useOrganization(organizationId);
  const project = useMemo(
    () =>
      !!projectId
        ? organization?.projects.find((p) => p.id === projectId)
        : undefined,
    [organization, projectId]
  );
  if (!organization) return null;
  return (
    <>
      <Breadcrumb.Item>
        <Link href={`/organization/${organization.id}`}>
          <a>{organization.name}</a>
        </Link>
      </Breadcrumb.Item>
      {!!project && (
        <Breadcrumb.Item>
          <Link href={`/organization/${organization.id}/project/${project.id}`}>
            <a>{project.name}</a>
          </Link>
        </Breadcrumb.Item>
      )}
    </>
  );
};
