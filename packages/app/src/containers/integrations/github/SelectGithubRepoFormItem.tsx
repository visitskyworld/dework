import React from "react";
import { Form, Select, Typography } from "antd";
import { GithubRepo } from "@dewo/app/graphql/types";
import { useConnectToGithubUrl } from "../hooks";

interface SelectGihubRepoFormItemProps {
  organizationId: string;
  repos: GithubRepo[] | undefined;
}

export const SelectGihubRepoFormItem = ({
  organizationId,
  repos,
}: SelectGihubRepoFormItemProps) => {
  const connectToGithubUrl = useConnectToGithubUrl(organizationId);
  return (
    <>
      {repos ? (
        <Typography.Paragraph type="secondary">
          Can't find your repository?{" "}
          <a href={connectToGithubUrl} target="_blank" rel="noreferrer">
            Add it
          </a>{" "}
          to your installation configuration.
        </Typography.Paragraph>
      ) : (
        <Typography.Paragraph type="secondary">
          Link a Github repo to automatically make pull requests show up in
          tasks.
        </Typography.Paragraph>
      )}
      <Form.Item
        name="repoIds"
        style={{ marginBottom: 0 }}
        rules={[{ required: true, message: "Please select a Github repo" }]}
      >
        <Select
          mode="multiple"
          loading={!repos}
          placeholder="Select Github Repo..."
          allowClear
          showSearch
          optionFilterProp="label"
        >
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
      </Form.Item>
    </>
  );
};
