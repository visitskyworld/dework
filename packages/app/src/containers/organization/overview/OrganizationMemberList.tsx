import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import React, { FC } from "react";
import { InviteButton } from "../../invite/InviteButton";
import { useOrganization } from "../hooks";

interface Props {
  organizationId: string;
}

export const OrganizationMemberList: FC<Props> = ({ organizationId }) => {
  const organization = useOrganization(organizationId);
  const canAddMember = usePermission("create", "OrganizationMember");
  const canUpdateMember = usePermission("update", "OrganizationMember");
  const canDeleteMember = usePermission("delete", "OrganizationMember");
  console.warn(organization?.members, {
    canAddMember,
    canUpdateMember,
    canDeleteMember,
  });
  return <InviteButton organizationId={organizationId} />;
};
