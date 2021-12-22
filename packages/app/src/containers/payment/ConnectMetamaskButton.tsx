import React, { FC, useCallback, useState } from "react";
import { Button } from "antd";
import { useRequestAddress, useSwitchChain } from "@dewo/app/util/ethereum";
import { PaymentNetwork } from "@dewo/app/graphql/types";

interface Props {
  network: PaymentNetwork;
  onChange?(address: string): Promise<void>;
}

export const ConnectMetamaskButton: FC<Props> = ({ network, onChange }) => {
  const [loading, setLoading] = useState(false);
  const requestAddress = useRequestAddress();
  const switchChain = useSwitchChain();
  const connect = useCallback(async () => {
    try {
      setLoading(true);
      await switchChain(network.slug);
      const address = await requestAddress();
      await onChange?.(address);
    } finally {
      setLoading(false);
    }
  }, [network, onChange, requestAddress, switchChain]);

  return (
    <Button block type="primary" loading={loading} onClick={connect}>
      Connect Metamask
    </Button>
  );
};
