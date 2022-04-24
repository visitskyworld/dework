import React, { FC, useCallback, useMemo, useState } from "react";
import { PaymentMethod, PaymentMethodType } from "@dewo/app/graphql/types";
import { Button, Col, Form, message, Row, Select } from "antd";
import { useCreatePaymentMethod, usePaymentNetworks } from "../hooks";
import { ConnectMetamaskButton } from "../ConnectMetamaskButton";
import { PaymentMethodSummary } from "../PaymentMethodSummary";
import { ConnectPhantomButton } from "../ConnectPhantomButton";
import { ConnectGnosisSafe } from "../ConnectGnosisSafe";
import { useForm } from "antd/lib/form/Form";
import {
  networkSlugsByPaymentMethodType,
  paymentMethodTypeToString,
} from "../util";
import { ConnectHiroButton } from "../ConnectHiroButton";

interface FormValues {
  type: PaymentMethodType;
  address: string;
  networkId: string;
}

interface Props {
  projectId: string;
  onDone(paymentMethod: PaymentMethod): void;
}

const paymentMethodTypes: PaymentMethodType[] = [
  PaymentMethodType.METAMASK,
  PaymentMethodType.GNOSIS_SAFE,
  PaymentMethodType.PHANTOM,
  PaymentMethodType.HIRO,
];

export const ProjectPaymentMethodForm: FC<Props> = ({ projectId, onDone }) => {
  const [form] = useForm<FormValues>();
  const [values, setValues] = useState<Partial<FormValues>>({});
  const [loading, setLoading] = useState(false);

  const networks = usePaymentNetworks();
  const networksForPaymentType = useMemo(() => {
    if (!networks) return [];
    if (!values.type) return [];
    const slugs = networkSlugsByPaymentMethodType[values.type];
    return networks.filter((n) => slugs.includes(n.slug));
  }, [networks, values.type]);

  const selectedNetwork = useMemo(
    () => networks?.find((n) => n.id === values.networkId),
    [networks, values.networkId]
  );

  const createPaymentMethod = useCreatePaymentMethod();
  const submitForm = useCallback(
    async (values: FormValues) => {
      try {
        setLoading(true);
        const paymentMethod = await createPaymentMethod({
          type: values.type,
          address: values.address,
          networkId: values.networkId,
          projectId,
        });
        await onDone(paymentMethod);
        setValues({});
        form.resetFields();
        message.success("Payment method added");
      } finally {
        setLoading(false);
      }
    },
    [createPaymentMethod, onDone, projectId, form]
  );

  const handleChange = useCallback(
    (changed: Partial<FormValues>, values: Partial<FormValues>) => {
      if (!!changed.type) {
        const slugs = networkSlugsByPaymentMethodType[changed.type];
        const supportsSelectedNetwork =
          !!selectedNetwork && !!slugs && slugs.includes(selectedNetwork.slug);
        if (!supportsSelectedNetwork) values.networkId = undefined;
      }
      if (!!changed.networkId) {
        values.address = undefined;
      }

      setValues(values);
      form.setFieldsValue(values);
    },
    [form, selectedNetwork]
  );

  const clearAddress = useCallback(
    () =>
      handleChange({ address: undefined }, { ...values, address: undefined }),
    [handleChange, values]
  );

  return (
    <Form
      form={form}
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
              placeholder="Select wallet type..."
              showSearch
              optionFilterProp="label"
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
              showSearch
              optionFilterProp="label"
            >
              {networksForPaymentType.map((network) => (
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
                  return <ConnectGnosisSafe network={selectedNetwork!} />;
                case PaymentMethodType.METAMASK:
                  return <ConnectMetamaskButton network={selectedNetwork!} />;
                case PaymentMethodType.HIRO:
                  return <ConnectHiroButton network={selectedNetwork!} />;
              }
            })()}
          </Form.Item>
        </Col>
        {!!values.address && !!selectedNetwork && (
          <Col span={24} style={{ marginBottom: 8 }}>
            <PaymentMethodSummary
              type={values.type!}
              address={values.address}
              networkName={selectedNetwork?.name}
              onClose={clearAddress}
            />
          </Col>
        )}
        {!!values.address && (
          <Col span={24}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Add Payment Method
            </Button>
          </Col>
        )}
      </Row>
    </Form>
  );
};
