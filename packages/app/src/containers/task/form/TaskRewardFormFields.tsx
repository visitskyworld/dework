import React, { FC, FocusEventHandler, useCallback, useMemo } from "react";
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
import { useProject } from "../../project/hooks";
import _ from "lodash";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { AddPaymentMethodModal } from "../../payment/AddPaymentMethodButton";
import { useToggle } from "@dewo/app/util/hooks";

export interface TaskRewardFormValues {
  amount: number;
  networkId: string;
  token: PaymentToken;
  trigger: TaskRewardTrigger;
}

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

export async function validator(
  _rule: unknown, // RuleObject,
  value: Partial<TaskRewardFormValues> | undefined
) {
  if (!value || _.isEmpty(value)) return;
  if (!value.networkId) return;
  if (!value.amount) return;

  if (!value.token) throw new Error("Please enter a token");
}

interface Props {
  projectId: string;
  value?: Partial<TaskRewardFormValues>;
  onChange?(value: Partial<TaskRewardFormValues>): void;
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
      onChange?.({
        ...value,
        trigger: TaskRewardTrigger.CORE_TEAM_APPROVAL,
        token: tokens.find((t) => t.id === tokenId),
      }),
    [onChange, value, tokens]
  );

  const handleBlur = useCallback<FocusEventHandler<unknown>>(
    (event) => {
      const allValuesSet =
        !!value?.networkId && !!value?.amount && !!value?.token;
      if (!allValuesSet) {
        stopPropagation(event);
      }
    },
    [value]
  );

  const handleClear = useCallback(() => {
    onChange?.({});
    requestAnimationFrame(onClear);
  }, [onChange, onClear]);

  const addPaymentMethod = useToggle();
  const paymentMethodInputOverride = useMemo(
    () => ({ projectId }),
    [projectId]
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
              <Button
                type="primary"
                size="small"
                children="Connect now"
                onClick={addPaymentMethod.toggleOn}
              />
            </Empty>
          )}
        >
          <Select
            loading={!project}
            placeholder="Select where you'll pay"
            value={value?.networkId}
            allowClear
            dropdownRender={(menu) => (
              <>
                {menu}
                {!!networks.length && (
                  <Button
                    block
                    type="text"
                    style={{ textAlign: "left", marginTop: 4 }}
                    className="text-secondary"
                    icon={<Icons.PlusCircleOutlined />}
                    children="Add another"
                    onClick={addPaymentMethod.toggleOn}
                  />
                )}
              </>
            )}
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
                    label={token.symbol}
                  >
                    {token.symbol}
                  </Select.Option>
                ))}
              </Select>
            }
          />
        )}
      </Space>
      <AddPaymentMethodModal
        selectTokens
        inputOverride={paymentMethodInputOverride}
        toggle={addPaymentMethod}
      />
    </>
  );
};
