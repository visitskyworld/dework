import { PlusCircleOutlined } from "@ant-design/icons";
import { PaymentToken } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { Button, ConfigProvider, Empty, Select, SelectProps } from "antd";
import React, { FC, useCallback } from "react";
import { useOrganizationTokens } from "../../organization/hooks";
import { AddTokenModal } from "./AddTokenModal";

interface Props extends SelectProps {
  organizationId: string;
}

export const TokenSelect: FC<Props> = ({
  organizationId,
  onChange,
  ...selectProps
}) => {
  const add = useToggle();
  const tokens = useOrganizationTokens(organizationId);

  const handleCustomTokenModalClosed = useCallback(
    (token?: PaymentToken) => {
      add.toggleOff();
      if (!!token) onChange?.(token.id, []);
    },
    [add, onChange]
  );

  return (
    <ConfigProvider
      renderEmpty={() => (
        <Empty
          imageStyle={{ display: "none" }}
          description="To add a bounty, you need to add tokens to pay with"
        >
          <Button
            type="primary"
            size="small"
            children="Add token"
            onClick={add.toggleOn}
          />
        </Empty>
      )}
    >
      <Select
        placeholder="Select a token"
        {...selectProps}
        onChange={onChange}
        showSearch
        optionFilterProp="label"
        dropdownRender={(menu) => (
          <>
            {menu}
            {!!tokens.length && (
              <Button
                block
                type="text"
                style={{ textAlign: "left", marginTop: 4 }}
                className="text-secondary"
                icon={<PlusCircleOutlined />}
                children="Add token"
                onClick={add.toggleOn}
              />
            )}
          </>
        )}
      >
        {tokens.map((token) => (
          <Select.Option
            key={token.id}
            value={token.id}
            label={`${token.symbol} (${token.network.name})`}
          >
            {`${token.symbol} (${token.network.name})`}
          </Select.Option>
        ))}
      </Select>

      <AddTokenModal
        organizationId={organizationId}
        visible={add.isOn}
        onClose={handleCustomTokenModalClosed}
      />
    </ConfigProvider>
  );
};
