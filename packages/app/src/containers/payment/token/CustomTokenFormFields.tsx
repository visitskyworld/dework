import { FormSection } from "@dewo/app/components/FormSection";
import {
  CreatePaymentTokenInput,
  PaymentNetwork,
  PaymentTokenType,
} from "@dewo/app/graphql/types";
import { AtLeast } from "@dewo/app/types/general";
import { useRunningCallback } from "@dewo/app/util/hooks";
import { Button, Col, Form, Input, Row, Select } from "antd";
import React, { FC, useCallback } from "react";
import { useLookupToken } from "./useLookupToken";

interface Props {
  network: PaymentNetwork;
  values: AtLeast<CreatePaymentTokenInput, "address">;
  onChange(valeus: Partial<CreatePaymentTokenInput>): void;
}

export const CustomTokenFormFields: FC<Props> = ({
  network,
  values,
  onChange,
}) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.value) {
        onChange({ networkId: network.id });
      }
    },
    [onChange, network.id]
  );

  const lookupToken = useLookupToken();
  const [handleLookupToken, lookingUp] = useRunningCallback(async () => {
    const token = await lookupToken(
      values.address,
      network,
      values.type!,
      values.identifier ?? undefined
    );
    if (!!token) {
      onChange(token);
    }
  }, [
    lookupToken,
    values.address,
    values.type,
    values.identifier,
    network,
    onChange,
  ]);

  return (
    <>
      <Row style={{ gap: 8 }}>
        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "Required" }]}
          style={{ flex: 1 }}
        >
          <Select<PaymentTokenType>
            placeholder="Select type"
            showSearch
            optionFilterProp="label"
          >
            {[
              PaymentTokenType.ERC20,
              PaymentTokenType.ERC721,
              PaymentTokenType.ERC1155,
            ].map((type) => (
              <Select.Option key={type} value={type} label={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Contract Address"
          name="address"
          rules={[{ required: true, message: "Please enter token address" }]}
          style={{ flex: 3 }}
        >
          <Input
            disabled={lookingUp}
            allowClear
            placeholder="Enter contract address..."
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item
          label="Token ID"
          name="identifier"
          hidden={values.type !== PaymentTokenType.ERC1155}
          rules={[
            {
              required: values.type === PaymentTokenType.ERC1155,
              message: "Required",
            },
          ]}
          style={{ flex: 1 }}
        >
          <Input placeholder="ID..." />
        </Form.Item>
        <FormSection label={"\u2060"}>
          <Button
            loading={lookingUp}
            disabled={
              !values.address ||
              !values.type ||
              (values.type === PaymentTokenType.ERC1155 && !values.identifier)
            }
            type="ghost"
            onClick={handleLookupToken}
          >
            Lookup
          </Button>
        </FormSection>
      </Row>

      <Row gutter={8}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Token Name"
            rules={[{ required: true }]}
            hidden={values.name === undefined}
          >
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="symbol"
            label="Symbol"
            rules={[{ required: true }]}
            hidden={values.symbol === undefined}
          >
            <Input disabled />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item
            name="exp"
            label="Decimals"
            rules={[{ required: true }]}
            hidden={values.exp === undefined}
          >
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="type" hidden />
    </>
  );
};
