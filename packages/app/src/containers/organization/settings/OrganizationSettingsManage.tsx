import { Divider, Typography } from "antd";
import React, { FC } from "react";
import { OrganizationSettingsDangerZone } from "../../project/settings/OrganizationSettingsDangerZone";

interface Props {
  organizationId: string;
}

export const OrganizationSettingsManage: FC<Props> = ({ organizationId }) => {
  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: 4 }}>
        Manage
      </Typography.Title>
      <Divider style={{ marginTop: 0 }} />
      <OrganizationSettingsDangerZone organizationId={organizationId} />
    </>
  );
};
