import React, { FC, useCallback, useState } from "react";
import { useToggle, UseToggleHook } from "@dewo/app/util/hooks";
import {
  Button,
  ButtonProps,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
} from "antd";
import {
  CreatePaymentTokenInput,
  PaymentNetwork,
  PaymentToken,
  PaymentTokenType,
} from "@dewo/app/graphql/types";
import { useForm } from "antd/lib/form/Form";
import {
  useERC1155Contract,
  useERC20Contract,
  useERC721Contract,
} from "@dewo/app/util/ethereum";
import { FormSection } from "@dewo/app/components/FormSection";
import { useCreatePaymentToken, usePaymentNetworks } from "./hooks";

interface FormProps {
  network?: PaymentNetwork;
  type?: PaymentTokenType;
  submitText?: string;
  renderSubmitButton?(buttonProps: ButtonProps): JSX.Element;
  onDone(token: PaymentToken): void;
}

interface FormModalProps extends FormProps {
  toggle: UseToggleHook;
}

const defaultRenderSubmitButton = (buttonProps: ButtonProps) => (
  <Button {...buttonProps} />
);

export const PaymentTokenForm: FC<FormProps> = ({
  network,
  type,
  submitText = "Add Custom Token",
  renderSubmitButton = defaultRenderSubmitButton,
  onDone,
}) => {
  const [form] = useForm<CreatePaymentTokenInput>();
  const networks = usePaymentNetworks();

  const submitLoading = useToggle();
  const lookupLoading = useToggle();

  const [values, setValues] = useState<Partial<CreatePaymentTokenInput>>({});

  const loadERC20Contract = useERC20Contract();
  const loadERC721Contract = useERC721Contract();
  const loadERC1155Contract = useERC1155Contract();
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
        case PaymentTokenType.ERC1155: {
          const contract = await loadERC1155Contract(values.address, network);
          const uri = await contract.uri(Number(values.identifier));

          interface ERC1155Metadata {
            name: string;
            description: string;
            image: string;
          }

          const metadata: ERC1155Metadata = await fetch(
            uri.replace("{id}", values.identifier!)
          )
            .then((res) => res.json())
            .catch(() => ({
              name: values.address,
              description: values.address,
              image: "",
            }));

          const name = metadata.name;
          const symbol = metadata.name;
          const exp = 1;

          form.setFieldsValue({ name, symbol, exp });
          setValues((prev) => ({ ...prev, name, symbol, exp }));
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
  }, [
    form,
    networks,
    loadERC20Contract,
    loadERC721Contract,
    loadERC1155Contract,
    lookupLoading,
  ]);

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
      style={{ overflowX: "hidden" }}
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
        </Col>
        <Col span={24}>
          <Row style={{ gap: 8 }}>
            <Form.Item
              label="Contract Address"
              name="address"
              rules={[{ required: true }]}
              style={{ flex: 3 }}
            >
              <Input placeholder="Enter Address..." />
            </Form.Item>
            <Form.Item
              label="Token ID"
              name="identifier"
              hidden={values.type !== PaymentTokenType.ERC1155}
              rules={[{ required: values.type === PaymentTokenType.ERC1155 }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Token ID" />
            </Form.Item>
            <FormSection label={"\u2060"}>
              <Button
                loading={lookupLoading.isOn}
                type="ghost"
                onClick={lookupAddress}
              >
                Lookup
              </Button>
            </FormSection>
          </Row>
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
          {renderSubmitButton?.({
            type: "primary",
            block: true,
            loading: submitLoading.isOn,
            hidden: !values.name || !values.symbol || !values.exp,
            children: submitText,
            onClick: form.submit,
          })}
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
