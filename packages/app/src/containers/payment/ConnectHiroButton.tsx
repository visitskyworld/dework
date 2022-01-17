import React, { FC, useCallback, useState } from "react";
import { Button } from "antd";
import { useRequestAddresses } from "@dewo/app/util/hiro";
import { PaymentNetwork } from "@dewo/app/graphql/types";

interface Props {
  network?: PaymentNetwork;
  onChange?(address: string | Record<string, string>): Promise<void>;
}

export const ConnectHiroButton: FC<Props> = ({ network, onChange }) => {
  const [loading, setLoading] = useState(false);
  const requestAddress = useRequestAddresses();
  const connect = useCallback(async () => {
    try {
      setLoading(true);
      const addresses = await requestAddress();
      if (!!network) {
        await onChange?.((addresses as Record<string, string>)[network.slug]);
      } else {
        await onChange?.(addresses);
      }
    } finally {
      setLoading(false);
    }
  }, [onChange, network, requestAddress]);

  return (
    <Button block type="primary" loading={loading} onClick={connect}>
      Connect Hiro Wallet
    </Button>
  );
};
