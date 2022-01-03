import React, { FC } from "react";
import { Select, SelectProps } from "antd";
import { DiscordIntegrationChannel } from "@dewo/app/graphql/types";

interface Props extends SelectProps<string> {
  organizationId: string;
  channels: DiscordIntegrationChannel[] | undefined;
}

export const ConnectProjectToDiscordSelect: FC<Props> = ({
  organizationId,
  channels,
  ...selectProps
}) => {
  return (
    <Select
      {...selectProps}
      loading={!channels}
      placeholder="Select Discord Channel"
    >
      {channels?.map((channel) => (
        <Select.Option
          key={channel.id}
          value={channel.id}
          label={`#${channel.name}`}
        >
          {`#${channel.name}`}
        </Select.Option>
      ))}
    </Select>
  );
};
