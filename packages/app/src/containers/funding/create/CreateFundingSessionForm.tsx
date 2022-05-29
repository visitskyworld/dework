import { useRunning } from "@dewo/app/util/hooks";
import { parseFixed } from "@ethersproject/bignumber";
import { Button, DatePicker, Form, InputNumber, Select } from "antd";
import React, { FC, useCallback } from "react";
import {
  useOrganizationDetails,
  useOrganizationTokens,
} from "../../organization/hooks";
import { TokenSelect } from "../../payment/token/TokenSelect";
import { useCreateFundingSession } from "../hooks";

interface FormValues {
  tokenId: string;
  amount: number;
  projectIds: string[];
  dates: [moment.Moment, moment.Moment];
}

interface Props {
  organizationId: string;
  onDone(): void;
}

export const CreateFundingSessionForm: FC<Props> = ({
  organizationId,
  onDone,
}) => {
  const tokens = useOrganizationTokens(organizationId);
  const projects =
    useOrganizationDetails(organizationId).organization?.projects;
  const createFundingSession = useCreateFundingSession();
  const [handleSubmit, submitting] = useRunning(
    useCallback(
      (values: FormValues) =>
        createFundingSession({
          organizationId,
          startDate: values.dates[0].toISOString(),
          endDate: values.dates[1].toISOString(),
          projectIds: values.projectIds,
          tokenId: values.tokenId,
          amount: parseFixed(
            String(values.amount),
            tokens.find((t) => t.id === values.tokenId)?.exp
          ).toString(),
        }).then(onDone),
      [organizationId, createFundingSession, tokens, onDone]
    )
  );
  return (
    <Form<FormValues>
      layout="vertical"
      requiredMark={false}
      initialValues={{ projectIds: projects?.map((p) => p.id) }}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="dates"
        label="Task completion period"
        rules={[{ required: true, message: "Please select dates" }]}
      >
        <DatePicker.RangePicker name="period" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="projectIds"
        label="Projects in the Reward session"
        rules={[
          { type: "array", min: 1, message: "Select at least one project" },
        ]}
      >
        <Select
          mode="multiple"
          placeholder="Select projects"
          showSearch
          optionFilterProp="label"
          loading={!projects}
        >
          {projects?.map((project) => (
            <Select.Option
              key={project.id}
              value={project.id}
              label={project.name}
            >
              {project.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="tokenId"
        label="Session Budget size"
        rules={[{ required: true, message: "Please select a token" }]}
      >
        <TokenSelect organizationId={organizationId} />
      </Form.Item>
      <Form.Item
        name="amount"
        rules={[{ required: true, message: "Please select amount" }]}
      >
        <InputNumber
          min={0}
          placeholder="Enter amount"
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Button loading={submitting} type="primary" htmlType="submit" block>
        Start Tipping
      </Button>
    </Form>
  );
};
