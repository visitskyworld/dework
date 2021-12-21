import React, { FC, useCallback, useRef, useState } from "react";
import {
  CreatePaymentMethodInput,
  PaymentMethod,
  PaymentMethodType,
} from "@dewo/app/graphql/types";
import { Button, Col, Form, FormInstance, Row, Select } from "antd";
import { useCreatePaymentMethod, usePaymentNetworks } from "./hooks";
import { ConnectMetamaskButton } from "./ConnectMetamaskButton";
import { PaymentMethodSummary } from "./PaymentMethodSummary";
import { ConnectPhantomButton } from "./ConnectPhantomButton";
import { ConnectGnosisSafe } from "./ConnectGnosisSafe";

export const paymentMethodTypeToString: Record<PaymentMethodType, string> = {
  [PaymentMethodType.METAMASK]: "Metamask",
  [PaymentMethodType.GNOSIS_SAFE]: "Gnosis Safe",
  [PaymentMethodType.PHANTOM]: "Phantom",
};

interface Props {
  projectId?: string;
  onDone(paymentMethod: PaymentMethod): void;
}

const paymentMethodTypes: PaymentMethodType[] = [
  PaymentMethodType.METAMASK,
  PaymentMethodType.GNOSIS_SAFE,
  PaymentMethodType.PHANTOM,
];

export const PaymentMethodForm: FC<Props> = ({ projectId, onDone }) => {
  const networks = usePaymentNetworks();

  const formRef = useRef<FormInstance<CreatePaymentMethodInput>>(null);
  const [values, setValues] = useState<Partial<CreatePaymentMethodInput>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback(
    (
      changed: Partial<CreatePaymentMethodInput>,
      values: Partial<CreatePaymentMethodInput>
    ) => {
      if (!!changed.type) values.networkId = undefined;
      if (!!changed.networkId) values.address = undefined;
      if (!!changed.networkId) values.tokenIds = [];

      setValues(values);
      formRef.current?.setFieldsValue(values);
    },
    []
  );

  const clearAddress = useCallback(
    () =>
      handleChange({ address: undefined }, { ...values, address: undefined }),
    [handleChange, values]
  );

  const createPaymentMethod = useCreatePaymentMethod();
  const submitForm = useCallback(
    async (values: CreatePaymentMethodInput) => {
      try {
        setLoading(true);
        const paymentMethod = await createPaymentMethod({
          ...values,
          projectId,
        });
        await onDone(paymentMethod);
      } finally {
        setLoading(false);
      }
    },
    [createPaymentMethod, onDone, projectId]
  );

  return (
    <Form
      ref={formRef}
      layout="vertical"
      requiredMark={false}
      onFinish={submitForm}
      onValuesChange={handleChange}
    >
      <Row gutter={8}>
        <Col span={12}>
          <Form.Item
            name="type"
            label="Wallet Type"
            rules={[{ required: true }]}
          >
            <Select<string>
              style={{ width: "100%" }}
              placeholder="Payment Method"
            >
              {paymentMethodTypes.map((type) => (
                <Select.Option
                  key={type}
                  value={type}
                  label={paymentMethodTypeToString[type]}
                >
                  {paymentMethodTypeToString[type]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="networkId"
            label="Network"
            rules={[{ required: true, message: "Please select a network" }]}
            hidden={!values.type}
          >
            <Select
              loading={!networks}
              placeholder="Select what network this payment method is connected to"
            >
              {networks?.map((network) => (
                <Select.Option
                  key={network.id}
                  value={network.id}
                  label={network.name}
                >
                  {network.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="address"
            hidden={!values.networkId || !!values.address}
            rules={[{ required: true }]}
          >
            {(() => {
              switch (values.type) {
                case PaymentMethodType.PHANTOM:
                  return <ConnectPhantomButton />;
                case PaymentMethodType.GNOSIS_SAFE:
                  return <ConnectGnosisSafe />;
                case PaymentMethodType.METAMASK:
                  return <ConnectMetamaskButton />;
              }
            })()}
          </Form.Item>
        </Col>
        {!!values.address && (
          <Col span={24} style={{ marginBottom: 8 }}>
            <PaymentMethodSummary
              type={values.type!}
              address={values.address}
              onClose={clearAddress}
            />
          </Col>
        )}

        {!!values.address && (
          <Col span={24}>
            <Form.Item
              name="tokenIds"
              label="Tokens"
              rules={[
                {
                  required: true,
                  type: "array",
                  message: "Please select what tokens this address can pay out",
                },
              ]}
            >
              <Select
                loading={!networks}
                mode="multiple"
                placeholder="Select what tokens this address can pay out"
              >
                {networks
                  ?.find((n) => n.id === values.networkId)
                  ?.tokens.map((token) => (
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
          </Col>
        )}
        {!!values.address && (
          <Col span={24}>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Add Payment Method
              </Button>
            </Form.Item>
          </Col>
        )}
      </Row>
    </Form>
  );
};
