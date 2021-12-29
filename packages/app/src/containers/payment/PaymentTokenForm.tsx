import React, { FC, useCallback, useState } from "react";
import { useToggle, UseToggleHook } from "@dewo/app/util/hooks";
import { Button, Col, Form, Input, message, Modal, Row, Select } from "antd";
import { PaymentNetwork, PaymentTokenType } from "@dewo/app/graphql/types";
import { useForm } from "antd/lib/form/Form";
import { useERC20Contract } from "@dewo/app/util/ethereum";
import { FormSection } from "@dewo/app/components/FormSection";

interface FormValuesTodoReplaceWithGraphQLType {
  networkId: string;
  type: PaymentTokenType;
  address: string;
  exp: number;
  name: string;
  symbol: string;
}

interface FormProps {
  network: PaymentNetwork;
  onDone(): void;
}

interface FormModalProps {
  network: PaymentNetwork;
  toggle: UseToggleHook;
}

export const PaymentTokenForm: FC<FormProps> = ({ network, onDone }) => {
  const [form] = useForm<FormValuesTodoReplaceWithGraphQLType>();

  const submitLoading = useToggle();
  const lookupLoading = useToggle();

  const [values, setValues] = useState<
    Partial<FormValuesTodoReplaceWithGraphQLType>
  >({});

  const loadERC20Contract = useERC20Contract();
  const lookupAddress = useCallback(async () => {
    const values = form.getFieldsValue();
    try {
      lookupLoading.toggleOn();
      switch (values.type) {
        case PaymentTokenType.ERC20:
          const contract = await loadERC20Contract(values.address);
          const [name, symbol, exp] = await Promise.all([
            contract.name(),
            contract.symbol(),
            contract.decimals(),
          ]);
          form.setFieldsValue({ name, symbol, exp });
          setValues((prev) => ({ ...prev, name, symbol, exp }));
          break;
      }
    } catch {
      message.error(
        "Failed to load address. Are you sure the contract address is correct and that you're on the right network?"
      );
    } finally {
      lookupLoading.toggleOff();
    }
  }, [form, loadERC20Contract, lookupLoading]);

  const handleChange = useCallback(
    (
      _changed: Partial<FormValuesTodoReplaceWithGraphQLType>,
      values: Partial<FormValuesTodoReplaceWithGraphQLType>
    ) => setValues(values),
    []
  );

  const handleSubmit = useCallback(
    async (values: FormValuesTodoReplaceWithGraphQLType) => {
      console.log(values);
      alert("handle submit");
    },
    []
  );

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={{ networkId: network.id, type: PaymentTokenType.ERC20 }}
      onFinish={handleSubmit}
      onValuesChange={handleChange}
    >
      <Row gutter={8}>
        <Col span={12}>
          <Form.Item
            name="networkId"
            label="Network"
            rules={[{ required: true }]}
          >
            <Select<string>
              disabled
              style={{ width: "100%" }}
              placeholder="Select network"
            >
              <Select.Option value={network.id} label={network.name}>
                {network.name}
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="type"
            label="Token Type"
            rules={[{ required: true }]}
          >
            <Select<string>
              disabled
              value={network.id}
              style={{ width: "100%" }}
              placeholder="Select token type"
            >
              <Select.Option value={PaymentTokenType.ERC20} label="ERC20">
                ERC20
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={24}>
          <FormSection label="Contract Address">
            <Input.Group compact style={{ display: "flex" }}>
              <Form.Item
                name="address"
                rules={[{ required: true }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="Enter Contract Address..." />
              </Form.Item>
              <Button
                loading={lookupLoading.isOn}
                type="ghost"
                style={{ width: "25%" }}
                onClick={lookupAddress}
              >
                Lookup
              </Button>
              {/* )} */}
            </Input.Group>
          </FormSection>
        </Col>
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

        <Col span={24}>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={submitLoading.isOn}
            hidden={!values.name || !values.symbol || !values.exp}
          >
            Add Custom Token
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export const PaymentTokenFormModal: FC<FormModalProps> = ({
  network,
  toggle,
}) => (
  <Modal
    visible={toggle.isOn}
    title="Add Custom Token"
    footer={null}
    onCancel={toggle.toggleOff}
  >
    <PaymentTokenForm network={network} onDone={toggle.toggleOff} />
  </Modal>
);
