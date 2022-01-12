import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import {
  CreatePaymentMethodInput,
  PaymentMethod,
  PaymentMethodType,
  PaymentToken,
  PaymentTokenType,
  PaymentTokenVisibility,
} from "@dewo/app/graphql/types";
import { Button, Col, Form, message, Row, Select } from "antd";
import { useCreatePaymentMethod, usePaymentNetworks } from "./hooks";
import { ConnectMetamaskButton } from "./ConnectMetamaskButton";
import { PaymentMethodSummary } from "./PaymentMethodSummary";
import { ConnectPhantomButton } from "./ConnectPhantomButton";
import { ConnectGnosisSafe } from "./ConnectGnosisSafe";
import { useERC20Contract } from "@dewo/app/util/ethereum";
import { useForm } from "antd/lib/form/Form";
import { useToggle } from "@dewo/app/util/hooks";
import { PaymentTokenFormModal } from "./PaymentTokenForm";

export const paymentMethodTypeToString: Record<PaymentMethodType, string> = {
  [PaymentMethodType.METAMASK]: "Metamask",
  [PaymentMethodType.GNOSIS_SAFE]: "Gnosis Safe",
  [PaymentMethodType.PHANTOM]: "Phantom",
};

export const networkSlugsByPaymentMethodType: Record<
  PaymentMethodType,
  string[]
> = {
  [PaymentMethodType.METAMASK]: [
    "ethereum-mainnet",
    "ethereum-rinkeby",
    "gnosis-chain",
    "polygon-mainnet",
    "sokol-testnet",
    "avalanche-mainnet",
    "fantom-mainnet",
  ],
  [PaymentMethodType.GNOSIS_SAFE]: [
    "ethereum-mainnet",
    "ethereum-rinkeby",
    "gnosis-chain",
    "polygon-mainnet",
  ],
  [PaymentMethodType.PHANTOM]: ["solana-mainnet", "solana-testnet"],
};

interface Props {
  inputOverride?: Partial<CreatePaymentMethodInput>;
  selectTokens?: boolean;
  onDone(paymentMethod: PaymentMethod): void;
}

const paymentMethodTypes: PaymentMethodType[] = [
  PaymentMethodType.METAMASK,
  PaymentMethodType.GNOSIS_SAFE,
  PaymentMethodType.PHANTOM,
];

export const PaymentMethodForm: FC<Props> = ({
  inputOverride,
  selectTokens,
  onDone,
}) => {
  const [form] = useForm<CreatePaymentMethodInput>();
  const [values, setValues] = useState<Partial<CreatePaymentMethodInput>>({});
  const [loading, setLoading] = useState(false);
  const [customTokens, setCustomTokens] = useState<PaymentToken[]>([]);

  const networks = usePaymentNetworks();
  const networksForPaymentType = useMemo(() => {
    if (!networks) return [];
    if (!values.type) return [];
    const slugs = networkSlugsByPaymentMethodType[values.type];
    return networks.filter((n) => slugs.includes(n.slug));
  }, [networks, values.type]);

  const [shouldShowToken, setShouldShowToken] = useState<
    Record<string, boolean>
  >({});

  const selectedNetwork = useMemo(
    () => networks?.find((n) => n.id === values.networkId),
    [networks, values.networkId]
  );
  const selectedNetworkTokens = useMemo(
    () =>
      selectedNetwork?.tokens.filter((token) => !!shouldShowToken[token.id]),
    [selectedNetwork?.tokens, shouldShowToken]
  );

  const loadERC20Contract = useERC20Contract();
  const loadShouldShowToken = useCallback(async () => {
    setShouldShowToken({});
    selectedNetwork?.tokens.forEach(async (token) => {
      if (token.visibility === PaymentTokenVisibility.ALWAYS) {
        setShouldShowToken((prev) => ({ ...prev, [token.id]: true }));
        return;
      }

      switch (token.type) {
        case PaymentTokenType.NATIVE:
          setShouldShowToken((prev) => ({ ...prev, [token.id]: true }));
          break;
        case PaymentTokenType.ERC20:
          if (!token.address || !values.address) return false;
          try {
            const contract = await loadERC20Contract(
              token.address,
              selectedNetwork
            );
            const balance = await contract.balanceOf(values.address);
            setShouldShowToken((prev) => ({
              ...prev,
              [token.id]: balance.gt(0),
            }));
          } catch (error) {
            console.error(error);
            setShouldShowToken((prev) => ({ ...prev, [token.id]: false }));
          }
          break;
        default:
          setShouldShowToken((prev) => ({ ...prev, [token.id]: false }));
          break;
      }
    });
  }, [values.address, selectedNetwork, loadERC20Contract]);
  useEffect(() => {
    loadShouldShowToken();
  }, [loadShouldShowToken]);

  const createPaymentMethod = useCreatePaymentMethod();
  const submitForm = useCallback(
    async (values: CreatePaymentMethodInput) => {
      try {
        setLoading(true);
        const paymentMethod = await createPaymentMethod({
          ...values,
          ...inputOverride,
        });
        await onDone(paymentMethod);
        setValues({});
        form.resetFields();
        message.success("Payment method added");
      } finally {
        setLoading(false);
      }
    },
    [createPaymentMethod, onDone, inputOverride, form]
  );

  const handleChange = useCallback(
    (
      changed: Partial<CreatePaymentMethodInput>,
      values: Partial<CreatePaymentMethodInput>
    ) => {
      if (!!changed.type) {
        const slugs = networkSlugsByPaymentMethodType[changed.type];
        const supportsSelectedNetwork =
          !!selectedNetwork && !!slugs && slugs.includes(selectedNetwork.slug);
        if (!supportsSelectedNetwork) values.networkId = undefined;
      }
      if (!!changed.networkId) values.address = undefined;
      if (!!changed.networkId) values.tokenIds = [];

      setValues(values);
      form.setFieldsValue(values);

      if (!!changed.address && !selectTokens) {
        submitForm(values as CreatePaymentMethodInput);
      }
    },
    [form, selectTokens, selectedNetwork, submitForm]
  );

  const clearAddress = useCallback(
    () =>
      handleChange({ address: undefined }, { ...values, address: undefined }),
    [handleChange, values]
  );

  const addCustomToken = useCallback(
    (token: PaymentToken) => {
      setCustomTokens((prev) => [...prev, token]);
      const change: Partial<CreatePaymentMethodInput> = {
        tokenIds: [...(values.tokenIds ?? []), token.id],
      };
      handleChange(change, { ...values, ...change });
    },
    [values, handleChange]
  );

  const addPaymentToken = useToggle();

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
          <Form.Item
            name="networkId"
            label="Network"
            rules={[{ required: true, message: "Please select a network" }]}
            hidden={!values.type}
          >
            <Select
              loading={!networks}
              placeholder="Select what network this payment method is connected to"
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
              }
            })()}
          </Form.Item>
        </Col>
        {!!values.address && !!selectedNetwork && selectTokens && (
          <Col span={24} style={{ marginBottom: 8 }}>
            <PaymentMethodSummary
              type={values.type!}
              address={values.address}
              networkNames={selectedNetwork?.name}
              onClose={clearAddress}
            />
          </Col>
        )}

        {!!values.address && !!selectedNetwork && selectTokens && (
          <Col span={24}>
            <Form.Item
              name="tokenIds"
              label="Tokens"
              rules={[
                {
                  required: true,
                  type: "array",
                  message: "Please select what tokens this address can pay out",
                },
              ]}
            >
              <Select
                loading={!networks}
                mode="multiple"
                placeholder="Select what tokens this address can pay out"
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Button
                      block
                      type="text"
                      style={{ textAlign: "left", marginTop: 4 }}
                      className="text-secondary"
                      icon={<Icons.PlusCircleOutlined />}
                      children="Add your own ERC20 token"
                      onClick={addPaymentToken.toggleOn}
                    />
                  </>
                )}
              >
                {selectedNetworkTokens?.map((token) => (
                  <Select.Option
                    key={token.id}
                    value={token.id}
                    label={token.name}
                  >
                    {token.name}
                  </Select.Option>
                ))}
                {customTokens
                  .filter((token) => token.networkId === selectedNetwork?.id)
                  .filter(
                    (token) =>
                      !selectedNetworkTokens?.some((t) => t.id === token.id)
                  )
                  .map((token) => (
                    <Select.Option
                      key={token.id}
                      value={token.id}
                      label={token.name}
                    >
                      {token.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        )}
        {!!values.address && selectTokens && (
          <Col span={24}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Add Payment Method
            </Button>
          </Col>
        )}
      </Row>
      {!!selectedNetwork && (
        <PaymentTokenFormModal
          key={selectedNetwork.id}
          network={selectedNetwork}
          toggle={addPaymentToken}
          onDone={addCustomToken}
        />
      )}
    </Form>
  );
};
