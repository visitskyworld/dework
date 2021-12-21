import React, { FC, useCallback, useState } from "react";
import { Button } from "antd";
import { useRequestAddress } from "@dewo/app/util/solana";

interface Props {
  onChange?(address: string): Promise<void>;
}

export const ConnectPhantomButton: FC<Props> = ({ onChange }) => {
  const [loading, setLoading] = useState(false);
  const requestAddress = useRequestAddress();
  const connect = useCallback(async () => {
    try {
      setLoading(true);
      const address = await requestAddress();
      await onChange?.(address);
    } finally {
      setLoading(false);
    }
  }, [onChange, requestAddress]);
  return (
    <Button block type="primary" loading={loading} onClick={connect}>
      Connect Phantom
    </Button>
  );
};
