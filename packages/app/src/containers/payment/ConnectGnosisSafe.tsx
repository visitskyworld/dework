import React, { FC, useCallback, useState } from "react";
import { Button, Input } from "antd";
import { useRequestSigner } from "@dewo/app/util/ethereum";
import { useIsGnosisSafeOwner } from "@dewo/app/util/gnosis";

interface Props {
  onChange?(address: string): Promise<void>;
}

export const ConnectGnosisSafe: FC<Props> = ({ onChange }) => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const requestSigner = useRequestSigner();
  const isSafeOwner = useIsGnosisSafeOwner();
  const connect = useCallback(async () => {
    try {
      setLoading(true);

      const signer = await requestSigner();
      const isOwner = await isSafeOwner(address, signer);
      if (!isOwner) throw new Error("Signer is not Gnosis Safe owner");

      await onChange?.(address);
    } finally {
      setLoading(false);
    }
  }, [onChange, requestSigner, isSafeOwner, address]);

  return (
    <Input.Group compact style={{ display: "flex" }}>
      <Input
        disabled={loading}
        placeholder="Enter Gnosis Safe Address..."
        onChange={(e) => setAddress(e.target.value)}
      />
      {/* TODO: only show submit button if address is valid */}
      {address.length === 42 && (
        <Button loading={loading} type="primary" onClick={connect}>
          Connect
        </Button>
      )}
    </Input.Group>
  );
};
