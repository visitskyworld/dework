import React, { FC, useCallback, useRef, useState } from "react";
import {
  CreatePaymentMethodInput,
  PaymentMethod,
  PaymentMethodType,
} from "@dewo/app/graphql/types";
import { Button, Col, Form, FormInstance, Row, Select } from "antd";
import { useRequestAddress as useRequestMetamaskAddress } from "@dewo/app/util/ethereum";
import { useRequestAddress as useRequestGnosisAddress } from "@dewo/app/util/gnosis";
import { useCreatePaymentMethod } from "./hooks";

export const paymentMethodTypeToString: Record<PaymentMethodType, string> = {
  [PaymentMethodType.METAMASK]: "Metamask",
  [PaymentMethodType.GNOSIS_SAFE]: "Gnosis Safe",
};

interface Props {
  onDone(paymentMethod: PaymentMethod): void;
}

const paymentMethodTypes: PaymentMethodType[] = [
  PaymentMethodType.METAMASK,
  // PaymentMethodType.GNOSIS_SAFE,
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

  const requestMetamaskAddress = useRequestMetamaskAddress();
  const requestGnosisAddress = useRequestGnosisAddress();
  const connect = useCallback(async () => {
    switch (values.type) {
      case PaymentMethodType.METAMASK: {
        const address = await requestMetamaskAddress();
        formRef.current?.setFieldsValue({ address });
        break;
      }
      case PaymentMethodType.GNOSIS_SAFE: {
        const address = await requestGnosisAddress();
        formRef.current?.setFieldsValue({ address });
        break;
      }
      default:
        throw new Error(`Unknown payment method type: ${values.type}`);
    }

    await formRef.current?.submit();
  }, [requestMetamaskAddress, requestGnosisAddress, values.type]);

  const [loading, setLoading] = useState(false);
  const createPaymentMethod = useCreatePaymentMethod();
  const submitForm = useCallback(
    async (values: CreatePaymentMethodInput) => {
      try {
        setLoading(true);
        const paymentMethod = await createPaymentMethod(values);
        onDone(paymentMethod);
      } finally {
        setLoading(false);
      }
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
          {!!values.type && (
            <Button block type="primary" loading={loading} onClick={connect}>
              Connect {paymentMethodTypeToString[values.type]}
            </Button>
          )}

          <Form.Item name="address" hidden rules={[{ required: true }]} />
        </Col>
      </Row>
    </Form>
  );
};
