import { User } from "@dewo/app/graphql/types";
import { Avatar, Select, SelectProps, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import React, { FC } from "react";
import { UserSelectOption } from "./UserSelectOption";
import styles from "./UserSelect.module.less";

interface Props {
  id?: string;
  mode?: "multiple" | undefined;
  placeholder?: string;
  users: User[] | undefined;
  disabled?: boolean;
  value?: string[];
  showUnassigned?: boolean;
  onChange?(value: string[]): void;
  onClear?(): void;
  dropdownRender?: SelectProps["dropdownRender"];
}

export const UserSelect: FC<Props> = ({
  id,
  mode,
  placeholder,
  users,
  disabled,
  value,
  showUnassigned,
  onChange,
  onClear,
  dropdownRender,
}) => {
  const unassigned = (
    <>
      <Avatar size="small" icon={<Icons.UserDeleteOutlined />} />
      <Typography.Text style={{ marginLeft: 8 }}>Unassigned</Typography.Text>
    </>
  );
  return (
    <Select
      id={id}
      mode={mode}
      showSearch
      className={styles.select}
      loading={!users}
      disabled={disabled}
      allowClear
      optionFilterProp="label"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onClear={onClear}
      dropdownRender={dropdownRender}
      tagRender={(props) => {
        if (props.value === null) return unassigned;
        const user = users?.find((u) => u.id === props.value);
        if (!user) return <div />;
        return <UserSelectOption user={user} />;
      }}
    >
      {showUnassigned && (
        <Select.Option value={null} label="Unassigned">
          {unassigned}
        </Select.Option>
      )}
      {users?.map((user) => (
        <Select.Option key={user.id} value={user.id} label={user.username}>
          <UserSelectOption user={user} />
        </Select.Option>
      ))}
    </Select>
  );
};
