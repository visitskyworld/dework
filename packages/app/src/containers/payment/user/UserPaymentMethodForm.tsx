import React, { FC, useCallback, useMemo, useState } from "react";
import { PaymentMethodType } from "@dewo/app/graphql/types";
import { Form, message, Select } from "antd";
import { useCreatePaymentMethod, usePaymentNetworks } from "../hooks";
import { ConnectMetamaskButton } from "../ConnectMetamaskButton";
import { ConnectPhantomButton } from "../ConnectPhantomButton";
import { useForm } from "antd/lib/form/Form";
import {
  networkSlugsByPaymentMethodType,
  paymentMethodTypeToString,
} from "../util";
import { ConnectHiroButton } from "../ConnectHiroButton";

interface FormValues {
  type: PaymentMethodType;
  address?: string;
  addressByNetworkSlug?: Record<string, string>;
}

interface Props {
  userId: string;
  onDone?(): void;
}

const paymentMethodTypes: PaymentMethodType[] = [
  PaymentMethodType.METAMASK,
  PaymentMethodType.PHANTOM,
  PaymentMethodType.HIRO,
];

export const UserPaymentMethodForm: FC<Props> = ({ userId, onDone }) => {
  const [form] = useForm<FormValues>();
  const [values, setValues] = useState<Partial<FormValues>>({});

  const networks = usePaymentNetworks();
  const networksForPaymentType = useMemo(() => {
    if (!networks) return [];
    if (!values.type) return [];
    const slugs = networkSlugsByPaymentMethodType[values.type];
    return networks.filter((n) => slugs.includes(n.slug));
  }, [networks, values.type]);

  const createPaymentMethod = useCreatePaymentMethod();
  const submitForm = useCallback(
    async (values: FormValues) => {
      const ps = networksForPaymentType.map((network) =>
        createPaymentMethod({
          type: values.type,
          address: (values.address ??
            values.addressByNetworkSlug?.[network.slug])!,
          networkIds: [network.id],
          userId,
        })
      );
      await Promise.all(ps);
      await onDone?.();
      setValues({});
      form.resetFields();
      message.success("Wallet connect");
    },
    [createPaymentMethod, onDone, networksForPaymentType, userId, form]
  );

  const handleChange = useCallback(
    (changed: Partial<FormValues>, values: Partial<FormValues>) => {
      setValues(values);
      form.setFieldsValue(values);

      if (!!changed.address || !!changed.addressByNetworkSlug) {
        form.submit();
      }
    },
    [form]
  );

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      onFinish={submitForm}
      onValuesChange={handleChange}
    >
      <Form.Item name="type" label="Wallet Type" rules={[{ required: true }]}>
        <Select<string>
          style={{ width: "100%" }}
          placeholder="Select wallet type..."
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
      {values.type === PaymentMethodType.HIRO ? (
        <Form.Item name="addressByNetworkSlug">
          <ConnectHiroButton />
        </Form.Item>
      ) : (
        <Form.Item name="address" hidden={!values.type}>
          {(() => {
            switch (values.type) {
              case PaymentMethodType.PHANTOM:
                return <ConnectPhantomButton />;
              case PaymentMethodType.METAMASK:
                return <ConnectMetamaskButton />;
              default:
                return null;
            }
          })()}
        </Form.Item>
      )}
    </Form>
  );
};
