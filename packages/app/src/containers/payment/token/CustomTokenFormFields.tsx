import { FormSection } from "@dewo/app/components/FormSection";
import {
  CreatePaymentTokenInput,
  PaymentNetwork,
  PaymentTokenType,
} from "@dewo/app/graphql/types";
import { AtLeast } from "@dewo/app/types/general";
import { useRunningCallback } from "@dewo/app/util/hooks";
import { Button, Col, Form, Input, Row } from "antd";
import React, { FC, useCallback, useEffect } from "react";
import { useGuessTokenMetadata } from "./useGuessTokenMetadata";

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

  const guess = useGuessTokenMetadata();
  const [guessTokenMetadata, guessing] = useRunningCallback(guess, [guess]);
  const handleLookup = useCallback(async () => {
    const token = await guessTokenMetadata(
      values.address,
      network,
      values.identifier ?? undefined
    );
    if (!!token) {
      onChange(token);
    } else {
      onChange({ ...values, type: PaymentTokenType.ERC1155 });
    }
  }, [guessTokenMetadata, values, network, onChange]);

  useEffect(() => {
    handleLookup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Row style={{ gap: 8 }}>
        <Form.Item
          label="Contract Address"
          name="address"
          rules={[{ required: true, message: "Please enter token address" }]}
          style={{ flex: 3 }}
        >
          <Input disabled={guessing} allowClear onChange={handleChange} />
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
          <Input placeholder="Token ID" />
        </Form.Item>
        <FormSection label={"\u2060"}>
          <Button loading={guessing} type="ghost" onClick={handleLookup}>
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
            hidden={!values.name}
          >
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="symbol"
            label="Symbol"
            rules={[{ required: true }]}
            hidden={!values.symbol}
          >
            <Input disabled />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item
            name="exp"
            label="Decimals"
            rules={[{ required: true }]}
            hidden={!values.exp}
          >
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="type" hidden />
    </>
  );
};
