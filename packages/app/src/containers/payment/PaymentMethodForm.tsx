import React, { FC, useCallback, useRef, useState } from "react";
import {
  CreatePaymentMethodInput,
  PaymentMethod,
  PaymentMethodType,
} from "@dewo/app/graphql/types";
import { Col, Form, FormInstance, Row, Select } from "antd";
import { useCreatePaymentMethod } from "./hooks";
import { ConnectMetamaskButton } from "./ConnectMetamaskButton";
import { ConnectPhantomButton } from "./ConnectPhantomButton";
import { ConnectGnosisSafe } from "./ConnectGnosisSafe";

export const paymentMethodTypeToString: Record<PaymentMethodType, string> = {
  [PaymentMethodType.METAMASK]: "Metamask",
  [PaymentMethodType.GNOSIS_SAFE]: "Gnosis Safe",
  [PaymentMethodType.PHANTOM]: "Phantom",
};

interface Props {
  onDone(paymentMethod: PaymentMethod): void;
}

const paymentMethodTypes: PaymentMethodType[] = [
  PaymentMethodType.METAMASK,
  PaymentMethodType.GNOSIS_SAFE,
  PaymentMethodType.PHANTOM,
];

export const PaymentMethodForm: FC<Props> = ({ onDone }) => {
  const formRef = useRef<FormInstance<CreatePaymentMethodInput>>(null);
  const [values, setValues] = useState<Partial<CreatePaymentMethodInput>>({});

  const handleChange = useCallback(
    (
      _changed: Partial<CreatePaymentMethodInput>,
      values: Partial<CreatePaymentMethodInput>
    ) => {
      setValues(values);
    },
    []
  );

  const setAddress = useCallback(async (address: string) => {
    formRef.current?.setFieldsValue({ address });
    await formRef.current?.submit();
  }, []);

  const createPaymentMethod = useCreatePaymentMethod();
  const submitForm = useCallback(
    async (values: CreatePaymentMethodInput) => {
      const paymentMethod = await createPaymentMethod(values);
      onDone(paymentMethod);
    },
    [createPaymentMethod, onDone]
  );

  return (
    <Form ref={formRef} onFinish={submitForm} onValuesChange={handleChange}>
      <Row gutter={8}>
        <Col span={12}>
          <Form.Item name="type" rules={[{ required: true }]}>
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
          {values.type === PaymentMethodType.METAMASK && (
            <ConnectMetamaskButton onConnect={setAddress} />
          )}
          {values.type === PaymentMethodType.PHANTOM && (
            <ConnectPhantomButton onConnect={setAddress} />
          )}
          {values.type === PaymentMethodType.GNOSIS_SAFE && (
            <ConnectGnosisSafe onConnect={setAddress} />
          )}

          <Form.Item name="address" hidden rules={[{ required: true }]} />
        </Col>
      </Row>
    </Form>
  );
};
