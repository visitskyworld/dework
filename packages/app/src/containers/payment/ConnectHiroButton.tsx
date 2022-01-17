import React, { FC, useCallback, useState } from "react";
import { Button } from "antd";
import { useRequestAddresses } from "@dewo/app/util/hiro";

interface Props {
  onChange?(address: Record<string, string>): Promise<void>;
}

export const ConnectHiroButton: FC<Props> = ({ onChange }) => {
  const [loading, setLoading] = useState(false);
  const requestAddress = useRequestAddresses();
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
      Connect Hiro Wallet
    </Button>
  );
};
