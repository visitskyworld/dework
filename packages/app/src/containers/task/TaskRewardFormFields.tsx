import React, { ComponentType, FC, useCallback, useMemo } from "react";
import { PaymentToken, TaskRewardTrigger } from "@dewo/app/graphql/types";
import {
  Button,
  ConfigProvider,
  Empty,
  InputNumber,
  Select,
  Space,
} from "antd";
import * as Icons from "@ant-design/icons";
import { useProject } from "../project/hooks";
import _ from "lodash";
import { uuidToBase62 } from "@dewo/app/util/uuid";
import Link from "next/link";

export interface TaskRewardFormValues {
  amount: number;
  networkId: string;
  token: PaymentToken;
  trigger: TaskRewardTrigger;
}

export const rewardTriggerToString: Record<TaskRewardTrigger, string> = {
  [TaskRewardTrigger.CORE_TEAM_APPROVAL]: "Core team approval",
  [TaskRewardTrigger.PULL_REQUEST_MERGED]: "PR merged",
};

interface TaskRewardTriggerOption {
  label: string;
  value: TaskRewardTrigger;
  icon: ComponentType;
}

const rewardTriggerOptions: TaskRewardTriggerOption[] = [
  {
    label: rewardTriggerToString[TaskRewardTrigger.CORE_TEAM_APPROVAL],
    value: TaskRewardTrigger.CORE_TEAM_APPROVAL,
    icon: Icons.TeamOutlined,
  },
  {
    label: rewardTriggerToString[TaskRewardTrigger.PULL_REQUEST_MERGED],
    value: TaskRewardTrigger.PULL_REQUEST_MERGED,
    icon: Icons.GithubOutlined,
  },
];

interface Props {
  projectId: string;
  value?: Partial<TaskRewardFormValues>;
  onChange?(value: Partial<TaskRewardFormValues>): void;
}

export const TaskRewardFormFields: FC<Props> = ({
  projectId,
  value,
  onChange,
}) => {
  const project = useProject(projectId);
  const networks = useMemo(
    () =>
      _(project?.paymentMethods)
        .map((pm) => pm.networks)
        .flatten()
        .uniqBy((n) => n.id)
        .value(),
    [project?.paymentMethods]
  );

  const tokens = useMemo(
    () =>
      _(project?.paymentMethods)
        .map((pm) => pm.tokens)
        .flatten()
        .filter((t) => t.networkId === value?.networkId)
        .value(),
    [project?.paymentMethods, value?.networkId]
  );

  const handleChangeNetworkId = useCallback(
    (networkId: string) =>
      onChange?.({ ...value, networkId, token: undefined }),
    [value, onChange]
  );
  const handleChangeAmount = useCallback(
    (amount: number | null) =>
      onChange?.({ ...value, amount: amount ?? undefined }),
    [onChange, value]
  );
  const handleChangeToken = useCallback(
    (tokenId: string) =>
      onChange?.({ ...value, token: tokens.find((t) => t.id === tokenId) }),
    [onChange, value, tokens]
  );
  const handleChangeTrigger = useCallback(
    (trigger: TaskRewardTrigger) => onChange?.({ ...value, trigger }),
    [onChange, value]
  );

  if (!project) return null;
  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }}>
        <ConfigProvider
          renderEmpty={() => (
            <Empty
              imageStyle={{ display: "none" }}
              description="To add a task reward, you need to connect a wallet to the project"
            >
              <Link
                href={`/o/${uuidToBase62(
                  project.organizationId
                )}/p/${uuidToBase62(projectId)}/settings`}
              >
                <a>
                  <Button type="primary" size="small">
                    Connect now
                  </Button>
                </a>
              </Link>
            </Empty>
          )}
        >
          <Select
            loading={!project}
            placeholder="Select where you'll pay"
            value={value?.networkId}
            onChange={handleChangeNetworkId}
          >
            {networks.map((network) => (
              <Select.Option
                key={network.id}
                value={network.id}
                label={network.name}
              >
                {network.name}
              </Select.Option>
            ))}
          </Select>
        </ConfigProvider>
        {!!value?.networkId && (
          <InputNumber
            placeholder="Enter amount"
            value={value?.amount}
            onChange={handleChangeAmount}
            addonAfter={
              <Select
                style={{ minWidth: 70 }}
                value={value?.token?.id}
                placeholder="Token"
                onChange={handleChangeToken}
              >
                {tokens.map((token) => (
                  <Select.Option
                    key={token.id}
                    value={token.id}
                    label={token.name}
                  >
                    {token.name}
                  </Select.Option>
                ))}
              </Select>
            }
          />
        )}
        {!!value?.amount && !!value?.token && (
          <Select
            value={value?.trigger}
            optionFilterProp="label"
            placeholder="Select payout trigger"
            onChange={handleChangeTrigger}
          >
            {rewardTriggerOptions.map((tag) => (
              <Select.Option
                key={tag.value}
                value={tag.value}
                label={tag.label}
              >
                <Space style={{ alignItems: "center" }}>
                  <tag.icon />
                  {tag.label}
                </Space>
              </Select.Option>
            ))}
          </Select>
        )}
      </Space>
    </>
  );
};
