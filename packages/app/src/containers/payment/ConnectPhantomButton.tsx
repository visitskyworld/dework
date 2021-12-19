import React, { FC, useCallback, useState } from "react";
import { Button } from "antd";
import { useRequestAddress } from "@dewo/app/util/solana";

interface Props {
  onConnect(address: string): Promise<void>;
}

export const ConnectPhantomButton: FC<Props> = ({ onConnect }) => {
  const [loading, setLoading] = useState(false);
  const requestAddress = useRequestAddress();
  const connect = useCallback(async () => {
    try {
      setLoading(true);
      const address = await requestAddress();
      await onConnect(address);
    } finally {
      setLoading(false);
    }
  }, [onConnect, requestAddress]);
  return (
    <Button block type="primary" loading={loading} onClick={connect}>
      Connect Phantom
    </Button>
  );
};
