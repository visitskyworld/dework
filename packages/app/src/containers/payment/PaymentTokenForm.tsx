import React, { FC, useCallback, useState } from "react";
import { useToggle, UseToggleHook } from "@dewo/app/util/hooks";
import { Button, Col, Form, Input, message, Modal, Row, Select } from "antd";
import {
  CreatePaymentTokenInput,
  PaymentNetwork,
  PaymentToken,
  PaymentTokenType,
} from "@dewo/app/graphql/types";
import { useForm } from "antd/lib/form/Form";
import { useERC20Contract, useERC721Contract } from "@dewo/app/util/ethereum";
import { FormSection } from "@dewo/app/components/FormSection";
import { useCreatePaymentToken, usePaymentNetworks } from "./hooks";

interface FormProps {
  network?: PaymentNetwork;
  type?: PaymentTokenType;
  submitText?: string;
  onDone(token: PaymentToken): void;
}

interface FormModalProps extends FormProps {
  toggle: UseToggleHook;
}

export const PaymentTokenForm: FC<FormProps> = ({
  network,
  type,
  submitText = "Add Custom Token",
  onDone,
}) => {
  const [form] = useForm<CreatePaymentTokenInput>();
  const networks = usePaymentNetworks();

  const submitLoading = useToggle();
  const lookupLoading = useToggle();

  const [values, setValues] = useState<Partial<CreatePaymentTokenInput>>({});

  const loadERC20Contract = useERC20Contract();
  const loadERC721Contract = useERC721Contract();
  const lookupAddress = useCallback(async () => {
    const values = form.getFieldsValue();
    const network = networks?.find((n) => n.id === values.networkId);
    try {
      if (!network) throw new Error("No network selected");

      lookupLoading.toggleOn();
      switch (values.type) {
        case PaymentTokenType.ERC20: {
          const contract = await loadERC20Contract(values.address, network);
          const name = await contract.name();
          const symbol = await contract.symbol();
          const exp = await contract.decimals();
          form.setFieldsValue({ name, symbol, exp });
          setValues((prev) => ({ ...prev, name, symbol, exp }));
          break;
        }
        case PaymentTokenType.ERC721: {
          const contract = await loadERC721Contract(values.address, network);
          const name = await contract.name();
          const symbol = await contract.symbol();
          form.setFieldsValue({ name, symbol, exp: 1 });
          setValues((prev) => ({ ...prev, name, symbol, exp: 1 }));
          break;
        }
      }
    } catch (error) {
      console.error(error);
      message.error(
        "Failed to load address. Are you sure the contract address is correct and that you're on the right network?"
      );
    } finally {
      lookupLoading.toggleOff();
    }
  }, [form, networks, loadERC20Contract, loadERC721Contract, lookupLoading]);

  const handleChange = useCallback(
    (
      _changed: Partial<CreatePaymentTokenInput>,
      values: Partial<CreatePaymentTokenInput>
    ) => setValues(values),
    []
  );

  const createPaymentToken = useCreatePaymentToken();
  const handleSubmit = useCallback(
    async (values: CreatePaymentTokenInput) => {
      submitLoading.toggleOn();
      try {
        const token = await createPaymentToken(values);
        onDone(token);
      } finally {
        submitLoading.toggleOff();
      }
    },
    [createPaymentToken, onDone, submitLoading]
  );

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={{ networkId: network?.id, type }}
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
              disabled={!!network}
              style={{ width: "100%" }}
              placeholder="Select network"
              showSearch
              optionFilterProp="label"
              loading={!networks}
            >
              {networks?.map((network) => (
                <Select.Option value={network.id} label={network.name}>
                  {network.name}
                </Select.Option>
              ))}
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
              disabled={!!type}
              value={type}
              style={{ width: "100%" }}
              placeholder="Select token type"
              showSearch
              optionFilterProp="label"
            >
              <Select.Option value={PaymentTokenType.ERC20} label="ERC20">
                ERC20
              </Select.Option>
              <Select.Option value={PaymentTokenType.ERC721} label="ERC721">
                ERC721
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
            block
            loading={submitLoading.isOn}
            hidden={!values.name || !values.symbol || !values.exp}
            onClick={form.submit}
          >
            {submitText}
          </Button>
        </Col>
      </Row>
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
