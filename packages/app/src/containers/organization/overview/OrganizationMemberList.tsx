import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import React, { FC, useMemo } from "react";
import { InviteButton } from "../../invite/InviteButton";
import { useOrganization } from "../hooks";
import { Table, Space, Row, Avatar, Button, Select } from 'antd';
import Column from "antd/lib/table/Column";
import { DeleteOutlined } from "@ant-design/icons";
import { OrganizationRole, User } from "@dewo/app/graphql/types";
import { useNavigateToProfile } from "@dewo/app/util/navigation";
interface Props {
  organizationId: string;
}
const { Option } = Select
export const OrganizationMemberList: FC<Props> = ({ organizationId }) => {
  const organization = useOrganization(organizationId);
  const canAddMember = usePermission("create", "OrganizationMember");
  const canUpdateMember = usePermission("update", "OrganizationMember");
  const canDeleteMember = usePermission("delete", "OrganizationMember");
  const navigateToProfile = useNavigateToProfile()
  console.warn(organization?.members, {
    canAddMember,
    canUpdateMember,
    canDeleteMember,
  });
  const handleNavigate = (user: User) => () => {
    navigateToProfile(user)
  }
  const members = useMemo(() => organization?.members || [], [organization?.members])
  return <>
    {
      canAddMember && <Row justify="end" >
        <InviteButton organizationId={organizationId} />
      </Row>
    }

    <Table rowSelection={{
      type: 'checkbox',
      onChange: (selectedRowKeys: React.Key[], selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      }
    }} showHeader={false} dataSource={members} >

      <Column
        title="Avatar"
        key="avatar"
        render={(member) => <Space size='small'> < Avatar src={member?.user.imageUrl} alt={member.user.username} /> <Button type="text" onClick={handleNavigate(member.user)}> {member.user.username}</Button></Space>

        }
      />
      {
        canUpdateMember && <Column title="Update Role" align="right" render={(member) => <Select defaultValue={member.role} onChange={() => { }}>

          <Option value={OrganizationRole.OWNER}>{OrganizationRole.OWNER}</Option>
          <Option value={OrganizationRole.ADMIN}>{OrganizationRole.ADMIN}</Option>
          <Option value={OrganizationRole.MEMBER}>{OrganizationRole.MEMBER}</Option>
        </Select>} />
      }

      {
        canDeleteMember && <Column title="Delete" align="right" render={() => <Button icon={<DeleteOutlined />} />} />
      }


    </Table>
  </>;
};
