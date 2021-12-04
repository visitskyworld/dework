import React, { FC, useCallback, useRef, useState } from "react";
import {
  CreatePaymentMethodInput,
  PaymentMethodType,
} from "@dewo/app/graphql/types";
import { Button, Col, Form, FormInstance, Row, Select } from "antd";
import { useRequestAddress } from "@dewo/app/util/ethereum";
import { useCreatePaymentMethod, useUpdateProject } from "../hooks";

export const paymentMethodTypeToString: Record<PaymentMethodType, string> = {
  [PaymentMethodType.METAMASK]: "Metamask",
  [PaymentMethodType.GNOSIS_SAFE]: "Gnosis Safe",
};

interface Props {
  projectId: string;
}

const paymentMethodTypes: PaymentMethodType[] = [
  PaymentMethodType.METAMASK,
  PaymentMethodType.GNOSIS_SAFE,
];

export const ProjectPaymentMethodForm: FC<Props> = ({ projectId }) => {
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

  const requestMetamaskAddress = useRequestAddress();
  const connect = useCallback(async () => {
    switch (values.type) {
      case PaymentMethodType.METAMASK:
        const address = await requestMetamaskAddress();
        formRef.current?.setFieldsValue({ address });
        break;
      default:
        throw new Error(`Unknown payment method type: ${values.type}`);
    }

    await formRef.current?.submit();
  }, [requestMetamaskAddress, values.type]);

  const [loading, setLoading] = useState(false);
  const createPaymentMethod = useCreatePaymentMethod();
  const updateProject = useUpdateProject();
  const submitForm = useCallback(
    async (values: CreatePaymentMethodInput) => {
      try {
        setLoading(true);
        const paymentMethod = await createPaymentMethod(values);
        await updateProject({
          id: projectId,
          paymentMethodId: paymentMethod.id,
        });
      } finally {
        setLoading(false);
      }
    },
    [createPaymentMethod, updateProject, projectId]
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
        {/* <Button
          type="text"
          icon={<Icons.CloseCircleOutlined onClick={() => alert("clear")} />}
        /> */}
      </Row>
    </Form>
  );
};
