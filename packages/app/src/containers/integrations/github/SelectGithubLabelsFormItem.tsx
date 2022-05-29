import { QuestionmarkTooltip } from "@dewo/app/components/QuestionmarkTooltip";
import { GithubRepo } from "@dewo/app/graphql/types";
import { Form, Select } from "antd";
import React, { FC } from "react";
import { useOrganizationGithubRepoLabels } from "../../organization/hooks";

interface Props {
  repo: GithubRepo;
  organizationId: string;
}

export const SelectGithubLabelsFormItem: FC<Props> = ({
  repo,
  organizationId,
}) => {
  const githubLabels = useOrganizationGithubRepoLabels(repo, organizationId);
  return (
    <Form.Item
      name="labelIds"
      label={
        <QuestionmarkTooltip
          title="By default Dework syncs all Github issues. If you only want to sync issues with specific labels, select them here."
          marginLeft={8}
        >
          Optional: only sync issues with these labels
        </QuestionmarkTooltip>
      }
    >
      <Select
        mode="multiple"
        loading={!githubLabels}
        placeholder="If you want to sync all issues, leave this empty"
        allowClear
        showSearch
        optionFilterProp="label"
      >
        {githubLabels?.map((label) => (
          <Select.Option key={label.id} value={label.id} label={label.name}>
            {label.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};
