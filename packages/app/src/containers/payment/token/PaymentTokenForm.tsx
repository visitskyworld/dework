import React, { FC, useCallback, useMemo, useState } from "react";
import { useRunningCallback, UseToggleHook } from "@dewo/app/util/hooks";
import { Button, ButtonProps, Form, Modal, Select } from "antd";
import {
  CreatePaymentTokenInput,
  PaymentNetwork,
  PaymentToken,
} from "@dewo/app/graphql/types";
import { useForm } from "antd/lib/form/Form";

import { useCreatePaymentToken, usePaymentNetworks } from "../hooks";
import { CustomTokenFormFields } from "./CustomTokenFormFields";
import { AtLeast } from "@dewo/app/types/general";
import _ from "lodash";

type CustomTokenFormValues = CreatePaymentTokenInput;
interface ExistingTokenFormValues {
  networkId: string;
  tokenId: string;
}

type FormValues = ExistingTokenFormValues | CustomTokenFormValues;

interface FormProps {
  network?: PaymentNetwork;
  submitText?: string;
  renderSubmitButton?(buttonProps: ButtonProps): JSX.Element;
  onDone(token: PaymentToken): void;
}

interface FormModalProps extends FormProps {
  toggle: UseToggleHook;
}

const defaultRenderSubmitButton = (buttonProps: ButtonProps) => (
  <Button {...buttonProps} />
);

export const PaymentTokenForm: FC<FormProps> = ({
  network,
  renderSubmitButton = defaultRenderSubmitButton,
  onDone,
}) => {
  const [form] = useForm<FormValues>();

  const [values, setValues] = useState<Partial<FormValues>>({});

  const networks = usePaymentNetworks();
  const selectedNetwork = useMemo(
    () => networks?.find((n) => n.id === values.networkId),
    [networks, values.networkId]
  );

  const manuallySetValues = useCallback(
    (values: Partial<FormValues>) => {
      setValues(values);
      form.resetFields();
      form.setFieldsValue(values);
    },
    [form]
  );

  const handleChange = useCallback(
    (
      changed: Partial<CreatePaymentTokenInput>,
      values: Partial<CreatePaymentTokenInput>
    ) => {
      if (_.isEqual(Object.keys(changed), ["networkId"])) {
        manuallySetValues({ networkId: changed.networkId });
      } else {
        setValues((prev) => ({ ...prev, ...values }));
      }
    },
    [manuallySetValues]
  );

  const createPaymentToken = useCreatePaymentToken();
  const [handleSubmit, submitting] = useRunningCallback(
    async (values: FormValues) => {
      if ("tokenId" in values) {
        const token = selectedNetwork?.tokens.find(
          (t) => t.id === values.tokenId
        );
        if (!!token) onDone(token);
      } else {
        const token = await createPaymentToken(values);
        onDone(token);
      }
    },
    [selectedNetwork, createPaymentToken, onDone]
  );

  const handleSearchToken = useCallback(
    async (query: string) => {
      if (!!query) {
        const isEthAddress = !!query.match(/^0x[a-fA-F0-9]{40}$/);
        if (isEthAddress) {
          manuallySetValues({ ...values, address: query });
        }
      }
    },
    [values, manuallySetValues]
  );

  return (
    <Form
      form={form}
      layout="vertical"
      style={{ overflowX: "hidden" }}
      requiredMark={false}
      initialValues={{ networkId: network?.id }}
      onFinish={handleSubmit}
      onValuesChange={handleChange}
    >
      <Form.Item name="networkId" label="Network" rules={[{ required: true }]}>
        <Select<string>
          style={{ width: "100%" }}
          placeholder="Select network"
          showSearch
          optionFilterProp="label"
          loading={!networks}
          autoFocus={!values?.networkId}
        >
          {networks?.map((n) => (
            <Select.Option key={n.id} value={n.id} label={n.name}>
              {n.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {!!selectedNetwork &&
        ("address" in values && !!values.address ? (
          <CustomTokenFormFields
            network={selectedNetwork}
            values={values as AtLeast<CreatePaymentTokenInput, "address">}
            onChange={manuallySetValues}
          />
        ) : (
          <Form.Item
            label="Token"
            name="tokenId"
            hidden={!values?.networkId}
            rules={[{ required: true, message: "Please select a token" }]}
          >
            <Select
              // @ts-expect-error
              autoComplete="none"
              placeholder="Search or paste address..."
              showSearch
              allowClear
              optionFilterProp="label"
              onSearch={handleSearchToken}
            >
              {selectedNetwork?.tokens.map((token) => (
                <Select.Option
                  key={token.id}
                  value={token.id}
                  label={token.name}
                >
                  {token.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ))}

      {renderSubmitButton?.({
        type: "primary",
        block: true,
        loading: submitting,
        children: "Add Token",
        onClick: form.submit,
      })}
    </Form>
  );
};

export const PaymentTokenFormModal: FC<FormModalProps> = ({
  toggle,
  onDone,
  ...formProps
}) => {
  const handleDone = useCallback(
    (token: PaymentToken) => {
      toggle.toggleOff();
      onDone(token);
    },
    [toggle, onDone]
  );

  return (
    <Modal
      visible={toggle.isOn}
      title="Add Custom Token"
      footer={null}
      onCancel={toggle.toggleOff}
    >
      <PaymentTokenForm onDone={handleDone} {...formProps} />
    </Modal>
  );
};
