import React, { FC } from "react";
import { Select, SelectProps } from "antd";
import { GithubRepo } from "@dewo/app/graphql/types";

interface Props extends SelectProps<string> {
  organizationId: string;
  repos: GithubRepo[] | undefined;
}

export const ConnectProjectToGithubSelect: FC<Props> = ({
  organizationId,
  repos,
  ...selectProps
}) => {
  return (
    <Select {...selectProps} loading={!repos} placeholder="Select Github Repo">
      {repos?.map((repo) => (
        <Select.Option
          key={repo.id}
          value={repo.id}
          label={`${repo.organization}/${repo.name}`}
        >
          {`${repo.organization}/${repo.name}`}
        </Select.Option>
      ))}
    </Select>
  );
};
