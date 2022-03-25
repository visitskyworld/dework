import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import * as Icons from "@ant-design/icons";
import { RoleTag } from "@dewo/app/components/RoleTag";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Organization } from "@dewo/app/graphql/types";
import { Button, Card, Row, Tooltip, Typography } from "antd";
import Link from "next/link";
import React, { FC, useMemo } from "react";
import { useUpdateOrganizationHidden, useUserRoles } from "./hooks";
import { eatClick } from "@dewo/app/util/eatClick";
import { useRunningCallback } from "@dewo/app/util/hooks";

interface Props {
  userId: string;
  organization: Organization;
}

export const UserOrganizationCard: FC<Props> = ({ userId, organization }) => {
  const isMe = useAuthContext().user?.id === userId;
  const user = useUserRoles(userId);
  const fallbackRole = useMemo(
    () =>
      user?.roles.find(
        (r) => r.fallback && r.organizationId === organization.id
      ),
    [user, organization]
  );
  const roles = useMemo(
    () =>
      user?.roles.filter(
        (r) => !r.userId && !r.fallback && r.organizationId === organization.id
      ),
    [user?.roles, organization.id]
  );
  const hidden = useMemo(
    () =>
      !!user?.userRoles.find((ur) => ur.roleId === fallbackRole?.id)?.hidden,
    [user?.userRoles, fallbackRole]
  );

  const updateOrganizationHidden = useUpdateOrganizationHidden();
  const [toggleHidden, togglingHidden] = useRunningCallback(
    async (e) => {
      eatClick(e);
      await updateOrganizationHidden({
        userId,
        roleId: fallbackRole!.id,
        hidden: !hidden,
      });
    },
    [updateOrganizationHidden, userId, fallbackRole, hidden]
  );

  return (
    <Link href={organization.permalink}>
      <a>
        <Card
          size="small"
          style={{ opacity: hidden ? 0.5 : undefined }}
          bodyStyle={{ padding: 8 }}
          className="hover:component-highlight hover:cursor-pointer"
        >
          <Row>
            <OrganizationAvatar size={20} organization={organization} />
            <Typography.Text strong style={{ flex: 1, marginLeft: 8 }}>
              {organization.name}
            </Typography.Text>
            {isMe && (
              <Tooltip
                title={
                  hidden
                    ? "This organization is hidden from your profile. Only you can see it."
                    : "This organization is visible on your profile. Click to hide it for other users."
                }
              >
                <Button
                  loading={togglingHidden}
                  icon={
                    hidden ? <Icons.EyeInvisibleFilled /> : <Icons.EyeFilled />
                  }
                  type="text"
                  size="small"
                  onClick={toggleHidden}
                />
              </Tooltip>
            )}
          </Row>
          {!!roles?.length && (
            <Row style={{ rowGap: 4, marginTop: 4 }}>
              {roles.map((role) => (
                <RoleTag key={role.id} dot role={role} />
              ))}
            </Row>
          )}
        </Card>
      </a>
    </Link>
  );
};
