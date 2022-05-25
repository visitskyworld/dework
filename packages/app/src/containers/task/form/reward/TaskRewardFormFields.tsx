import React, { FC, useCallback } from "react";
import { PaymentToken } from "@dewo/app/graphql/types";
import { Button, InputNumber, Row, Select, Space, Typography } from "antd";
import _ from "lodash";
import { useToggle } from "@dewo/app/util/hooks";

import { useOrganizationTokens } from "@dewo/app/containers/organization/hooks";

import { TaskRewardFormValues } from "../types";
import { PegToUsdCheckbox } from "./PegToUsdCheckbox";
import { AddProjectPaymentMethodModal } from "@dewo/app/containers/payment/project/AddProjectPaymentMethodModal";
import { paymentMethodTypeToString } from "@dewo/app/containers/payment/util";
import { HeadlessCollapse } from "@dewo/app/components/HeadlessCollapse";
import { OnboardingAlert } from "@dewo/app/components/OnboardingAlert";
import { useProject } from "@dewo/app/containers/project/hooks";
import { useProjectPaymentMethods } from "@dewo/app/containers/payment/hooks";
import { TokenSelect } from "@dewo/app/containers/payment/token/TokenSelect";

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
  id?: string;
  value?: Partial<TaskRewardFormValues>;
  onChange?(value: Partial<TaskRewardFormValues>): void;
}

export const TaskRewardFormFields: FC<Props> = ({
  id,
  projectId,
  value,
  onChange,
}) => {
  const { project } = useProject(projectId);
  const addPaymentMethod = useToggle();

  const tokens = useOrganizationTokens(project?.organizationId);
  const pms = useProjectPaymentMethods(projectId);

  const handleChangeAmount = useCallback(
    (amount: number | null) =>
      onChange?.({ ...value, amount: amount ?? undefined }),
    [onChange, value]
  );
  const handleChangeToken = useCallback(
    (token?: PaymentToken) =>
      onChange?.({
        ...value,
        token,
        networkId: token?.networkId,
        peggedToUsd: value?.peggedToUsd && !!token?.usdPrice,
      }),
    [onChange, value]
  );
  const handleChangeTokenId = useCallback(
    (tokenId: string) => {
      const token = tokens.find((t) => t.id === tokenId);
      handleChangeToken(token);
    },
    [handleChangeToken, tokens]
  );
  const handleChangePeggedToUsd = useCallback(
    (peggedToUsd: boolean) => onChange?.({ ...value, peggedToUsd }),
    [onChange, value]
  );

  const handleClear = useCallback(() => {
    onChange?.({});
  }, [onChange]);

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }}>
        {!!project && (
          <TokenSelect
            id={`${id}_tokenId`}
            value={value?.token?.id}
            allowClear
            onChange={handleChangeTokenId}
            onClear={handleClear}
            organizationId={project.organizationId}
          />
        )}
        {!!value?.token && (
          <InputNumber
            min={0}
            placeholder="Enter amount"
            value={value?.amount}
            onChange={handleChangeAmount}
            style={{ width: "100%" }}
            addonAfter={
              <Select
                id={`${id}_tokenId`}
                style={{ minWidth: 100 }}
                value={value?.token?.id}
                placeholder="Token"
                onChange={handleChangeTokenId}
                disabled
                showArrow={false}
              >
                {tokens.map((token) => (
                  <Select.Option key={token.id} value={token.id}>
                    {value?.peggedToUsd ? `$ in ${token.symbol}` : token.symbol}
                  </Select.Option>
                ))}
              </Select>
            }
          />
        )}
        {!!value?.networkId && (
          <PegToUsdCheckbox value={value} onChange={handleChangePeggedToUsd} />
        )}
        <HeadlessCollapse expanded={!!value?.token && !!value?.amount}>
          {!!pms?.length ? (
            <OnboardingAlert
              name="Task Form: connected payment methods"
              message={
                <>
                  {_.uniq(
                    pms.map((pm) => paymentMethodTypeToString[pm.type])
                  ).join(", ")}{" "}
                  connected. <a onClick={addPaymentMethod.toggleOn}>Add more</a>
                </>
              }
            />
          ) : (
            <Row align="middle" style={{ columnGap: 12 }}>
              <Button
                size="small"
                type="primary"
                onClick={addPaymentMethod.toggleOn}
              >
                Setup payment
              </Button>
              <Typography.Text
                type="secondary"
                className="ant-typography-caption"
              >
                (Can also be set up later)
              </Typography.Text>
            </Row>
          )}
        </HeadlessCollapse>
      </Space>
      <AddProjectPaymentMethodModal
        projectId={projectId}
        visible={addPaymentMethod.isOn}
        onClose={addPaymentMethod.toggleOff}
      />
    </>
  );
};
