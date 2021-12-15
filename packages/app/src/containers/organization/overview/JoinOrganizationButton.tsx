import React, { FC, useCallback, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import { Button } from "antd";
import { useOrganization, useUpdateOrganizationMember } from "../hooks";
import { OrganizationRole } from "@dewo/app/graphql/types";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useRouter } from "next/router";

interface Props {
  organizationId: string;
}

export const JoinOrganizationButton: FC<Props> = ({ organizationId }) => {
  const [loading, setLoading] = useState(false);

  const { user } = useAuthContext();

  const organization = useOrganization(organizationId);
  const isMember = useMemo(
    () => organization?.members.some((m) => m.userId === user?.id),
    [organization, user]
  );

  const router = useRouter();
  const updateOrganizationMember = useUpdateOrganizationMember();
  const joinOrganization = useCallback(async () => {
    if (!user) {
      router.push("/auth");
      return;
    }

    try {
      setLoading(true);
      await updateOrganizationMember({
        role: OrganizationRole.MEMBER,
        userId: user.id,
        organizationId,
      });
    } finally {
      setLoading(false);
    }
  }, [router, user, organizationId, updateOrganizationMember]);

  if (isMember) return null;
  return (
    <Button
      type="ghost"
      loading={loading}
      icon={<Icons.UsergroupAddOutlined />}
      onClick={joinOrganization}
    >
      Join {organization?.name}
    </Button>
  );
};
