import React, {
  ComponentType,
  FC,
  FocusEventHandler,
  useCallback,
  useMemo,
} from "react";
import {
  PaymentStatus,
  PaymentToken,
  TaskRewardTrigger,
} from "@dewo/app/graphql/types";
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
import Link from "next/link";
import { stopPropagation } from "@dewo/app/util/eatClick";

export interface TaskRewardFormValues {
  amount: number;
  networkId: string;
  token: PaymentToken;
  trigger: TaskRewardTrigger;
}

export const rewardTriggerToString: Record<TaskRewardTrigger, string> = {
  [TaskRewardTrigger.CORE_TEAM_APPROVAL]: "Manually by Core Team",
  [TaskRewardTrigger.PULL_REQUEST_MERGED]: "On PR merged",
};

export const paymentStatusToString: Record<PaymentStatus, string> = {
  [PaymentStatus.PROCESSING]: "Payment Processing",
  [PaymentStatus.CONFIRMED]: "Payment Completed",
  [PaymentStatus.FAILED]: "Payment Failed",
};

export const paymentStatusToColor: Record<PaymentStatus, string> = {
  [PaymentStatus.PROCESSING]: "volcano",
  [PaymentStatus.CONFIRMED]: "green",
  [PaymentStatus.FAILED]: "red",
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

export async function validator(
  _rule: unknown, // RuleObject,
  value: Partial<TaskRewardFormValues> | undefined
) {
  if (!value) return;
  if (!value.networkId) return;
  if (!value.amount) return;

  if (!value.token) throw new Error("Please enter a token");
  if (!value.trigger) throw new Error("Please enter approval criteria");
}

interface Props {
  projectId: string;
  value?: Partial<TaskRewardFormValues>;
  onChange?(value: Partial<TaskRewardFormValues> | null): void;
  onClear(): void;
}

export const TaskRewardFormFields: FC<Props> = ({
  projectId,
  value,
  onChange,
  onClear,
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
        .uniqBy((t) => t.id)
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

  const handleBlur = useCallback<FocusEventHandler<unknown>>(
    (event) => {
      const allValuesSet =
        !!value?.networkId &&
        !!value?.amount &&
        !!value?.token &&
        !!value?.trigger;
      if (!allValuesSet) {
        stopPropagation(event);
      }
    },
    [value]
  );

  const handleClear = useCallback(() => {
    onChange?.(null);
    onClear();
  }, [onChange, onClear]);

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
              <Link href={`${project.permalink}/settings`}>
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
            allowClear
            onChange={handleChangeNetworkId}
            onBlur={handleBlur}
            onClear={handleClear}
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
            onBlur={handleBlur}
            style={{ width: "100%" }}
            addonAfter={
              <Select
                style={{ minWidth: 100 }}
                value={value?.token?.id}
                placeholder="Token"
                onChange={handleChangeToken}
                onBlur={handleBlur}
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
            onBlur={handleBlur}
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
