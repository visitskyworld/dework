import { User } from "@dewo/app/graphql/types";
import { Select } from "antd";
import React, { FC } from "react";
import { UserSelectOption } from "./UserSelectOption";

interface Props {
  mode?: "multiple" | undefined;
  placeholder?: string;
  users: User[] | undefined;
  disabled?: boolean;
  value?: string[];
  onChange?(value: string[]): void;
  onClear?(): void;
}

export const UserSelect: FC<Props> = ({
  mode,
  placeholder,
  users,
  disabled,
  value,
  onChange,
  onClear,
}) => {
  return (
    <Select
      mode={mode}
      showSearch
      className="dewo-select-item-full-width"
      loading={!users}
      disabled={disabled}
      allowClear
      optionFilterProp="label"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onClear={onClear}
      tagRender={(props) => {
        const user = users?.find((u) => u.id === props.value);
        if (!user) return <div />;
        return <UserSelectOption user={user} style={{ paddingRight: 12 }} />;
      }}
    >
      {users?.map((user) => (
        <Select.Option key={user.id} value={user.id} label={user.username}>
          <UserSelectOption user={user} />
        </Select.Option>
      ))}
    </Select>
  );
};
