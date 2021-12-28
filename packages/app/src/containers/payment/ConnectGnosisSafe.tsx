import React, { FC, useCallback, useState } from "react";
import { Button, Input, notification } from "antd";
import { useRequestSigner, useSwitchChain } from "@dewo/app/util/ethereum";
import { useIsGnosisSafeOwner } from "@dewo/app/util/gnosis";
import { PaymentNetwork } from "@dewo/app/graphql/types";

interface Props {
  network: PaymentNetwork;
  onChange?(address: string): Promise<void>;
}

export const ConnectGnosisSafe: FC<Props> = ({ network, onChange }) => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const requestSigner = useRequestSigner();
  const isSafeOwner = useIsGnosisSafeOwner();
  const switchChain = useSwitchChain();
  const connect = useCallback(async () => {
    try {
      setLoading(true);

      await switchChain(network.slug);
      const signer = await requestSigner();
      const isOwner = await isSafeOwner(address, signer);
      if (!isOwner) {
        throw new Error("Signer is not an owner of the Gnosis Safe");
      }

      await onChange?.(address);
    } catch (error) {
      notification.info({
        message: "Gnosis Safe not connected",
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  }, [onChange, requestSigner, isSafeOwner, switchChain, network, address]);

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
