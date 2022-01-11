import React, { FC, useCallback } from "react";
import { Alert, Typography } from "antd";
import { PaymentTokenForm } from "../../payment/PaymentTokenForm";
import { PaymentToken } from "@dewo/app/graphql/types";
import { FormSection } from "@dewo/app/components/FormSection";

interface Props {
  value?: PaymentToken;
  onChange?(value?: PaymentToken): void;
}

export const ProjectTokenGatingInput: FC<Props> = ({
  value: token,
  onChange,
}) => {
  const clear = useCallback(() => onChange?.(undefined), [onChange]);
  return (
    <FormSection label="Token Gating">
      {!!token ? (
        <Alert
          message={`Users with ${token.name} (${token.symbol}) in their wallets can join this project`}
          type="success"
          showIcon
          closable
          onClose={clear}
        />
      ) : (
        <>
          <Typography.Paragraph type="secondary">
            Allow users with a certain ERC20 or ERC721 token to join this
            project without a manual invite
          </Typography.Paragraph>
          <PaymentTokenForm
            submitText="Enable Token Gating"
            onDone={onChange!}
          />
        </>
      )}
    </FormSection>
  );
};
