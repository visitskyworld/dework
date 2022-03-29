import React, { FC, useCallback, useMemo } from "react";
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
import { useProjectPaymentMethods } from "../../../project/hooks";
import _ from "lodash";
import { useToggle } from "@dewo/app/util/hooks";
import { AddProjectPaymentMethodModal } from "../../../payment/project/AddProjectPaymentMethodModal";

export interface TaskRewardFormValues {
  amount: number;
  networkId: string;
  token: PaymentToken;
  trigger: TaskRewardTrigger;
}

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
}

export const TaskRewardFormFields: FC<Props> = ({
  projectId,
  value,
  onChange,
}) => {
  const addPaymentMethod = useToggle();
  const forcefullyShowNetworkSelect = useToggle();
  const handlePaymentMethodModalClosed = useCallback(() => {
    addPaymentMethod.toggleOff();
    forcefullyShowNetworkSelect.toggleOn();
  }, [addPaymentMethod, forcefullyShowNetworkSelect]);

  const paymentMethods = useProjectPaymentMethods(projectId);
  const networks = useMemo(
    () =>
      _(paymentMethods)
        .map((pm) => pm.networks)
        .flatten()
        .uniqBy((n) => n.id)
        .value(),
    [paymentMethods]
  );

  const tokens = useMemo(
    () =>
      _(paymentMethods)
        .map((pm) => pm.tokens)
        .flatten()
        .filter((t) => t.networkId === value?.networkId)
        .uniqBy((t) => t.id)
        .value(),
    [paymentMethods, value?.networkId]
  );

  const handleChangeNetworkId = useCallback(
    (networkId: string) => {
      forcefullyShowNetworkSelect.toggleOff();
      onChange?.({ ...value, networkId, token: undefined });
    },
    [value, onChange, forcefullyShowNetworkSelect]
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

  const handleClear = useCallback(() => {
    onChange?.({});
  }, [onChange]);

  if (!paymentMethods) return null;
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
            placeholder="Select where you'll pay"
            value={value?.networkId}
            allowClear
            open={forcefullyShowNetworkSelect.isOn || undefined}
            onBlur={forcefullyShowNetworkSelect.toggleOff}
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
            min={0}
            placeholder="Enter amount"
            value={value?.amount}
            onChange={handleChangeAmount}
            style={{ width: "100%" }}
            addonAfter={
              <Select
                style={{ minWidth: 100 }}
                value={value?.token?.id}
                placeholder="Token"
                onChange={handleChangeToken}
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
      <AddProjectPaymentMethodModal
        projectId={projectId}
        visible={addPaymentMethod.isOn}
        onClose={handlePaymentMethodModalClosed}
      />
    </>
  );
};
