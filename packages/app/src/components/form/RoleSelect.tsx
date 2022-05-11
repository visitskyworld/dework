import React, { FC, useCallback, useMemo } from "react";
import { Button, message, Row, Select, SelectProps } from "antd";
import _ from "lodash";
import { Role } from "@dewo/app/graphql/types";
import { RoleTag } from "../RoleTag";
import { useUpdateOrganizationDiscordRoles } from "@dewo/app/containers/integrations/hooks";
import { useRunning } from "@dewo/app/util/hooks";
import { ReloadOutlined } from "@ant-design/icons";

interface Props extends SelectProps {
  roles?: Role[];
  organizationId: string;
}

export const RoleSelect: FC<Props> = ({
  roles,
  organizationId,
  ...selectProps
}) => {
  const roleById = useMemo(() => _.keyBy(roles, (r) => r.id), [roles]);
  const updateOrganizationDiscordRoles = useUpdateOrganizationDiscordRoles();

  const [refresh, refreshing] = useRunning(
    useCallback(async () => {
      await updateOrganizationDiscordRoles(organizationId);
      message.success("Latest Discord roles fetched!");
    }, [organizationId, updateOrganizationDiscordRoles])
  );

  return (
    <Select
      mode="multiple"
      showSearch
      optionFilterProp="label"
      loading={!roles}
      dropdownRender={(children) => (
        <>
          {children}
          <Row style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 4 }}>
            <Button
              loading={refreshing}
              onClick={refresh}
              size="small"
              type="text"
              icon={<ReloadOutlined />}
            >
              Fetch latest Discord roles
            </Button>
          </Row>
        </>
      )}
      tagRender={(props) =>
        !!roleById[props.value] && (
          <RoleTag {...props} role={roleById[props.value]} />
        )
      }
      {...selectProps}
    >
      {roles?.map((role) => (
        <Select.Option key={role.id} value={role.id} label={role.name}>
          <RoleTag role={role} />
        </Select.Option>
      ))}
    </Select>
  );
};
