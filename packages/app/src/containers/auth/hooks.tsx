import { useApolloClient, useMutation } from "@apollo/client";
import React, { useCallback, useMemo } from "react";
import * as uuid from "uuid";
import * as Mutations from "@dewo/app/graphql/mutations";
import {
  AuthWithThreepidMutation,
  AuthWithThreepidMutationVariables,
  CheckWalletConnectSessionMutation,
  CheckWalletConnectSessionMutationVariables,
  CreateMetamaskThreepid,
  CreateMetamaskThreepidVariables,
  StartWalletConnectSessionMutation,
  StartWalletConnectSessionMutationVariables,
} from "@dewo/app/graphql/types";
import { setAuthToken } from "@dewo/app/util/authToken";
import {
  usePersonalSign,
  useProvider,
  useRequestAddress,
} from "@dewo/app/util/ethereum";
import { Modal } from "antd";
import { MetamaskIcon } from "@dewo/app/components/icons/Metamask";

export function useAuthWithThreepid(): (threepidId: string) => Promise<void> {
  const apolloClient = useApolloClient();
  const [authWithThreepid] = useMutation<
    AuthWithThreepidMutation,
    AuthWithThreepidMutationVariables
  >(Mutations.authWithThreepid);
  return useCallback(
    async (threepidId: string) => {
      const res = await authWithThreepid({ variables: { threepidId } });

      if (!!res.data) {
        setAuthToken(undefined, res.data?.authWithThreepid.authToken);
        apolloClient.reFetchObservableQueries(); // async
      }
    },
    [authWithThreepid, apolloClient]
  );
}

export function useCreateMetamaskThreepid(): () => Promise<string> {
  const isMetamaskAvailable = !!useProvider().current;
  const requestAddress = useRequestAddress();
  const personalSign = usePersonalSign();

  const [createMetamaskThreepidMutation] = useMutation<
    CreateMetamaskThreepid,
    CreateMetamaskThreepidVariables
  >(Mutations.createMetamaskThreepid);

  const walletConnectSessionId = useMemo(() => uuid.v4(), []);
  const [startWalletConnectSessionMutation] = useMutation<
    StartWalletConnectSessionMutation,
    StartWalletConnectSessionMutationVariables
  >(Mutations.startWalletConnectSession, {
    variables: { sessionId: walletConnectSessionId },
  });
  const [checkWalletConnectSessionMutation] = useMutation<
    CheckWalletConnectSessionMutation,
    CheckWalletConnectSessionMutationVariables
  >(Mutations.checkWalletConnectSession, {
    variables: { sessionId: walletConnectSessionId },
  });

  return useCallback(async () => {
    if (!isMetamaskAvailable) {
      const res = await startWalletConnectSessionMutation();
      if (!res.data) throw new Error("Failed to start Wallet Connect session");
      const metamaskUrl = `https://metamask.app.link/wc?uri=${encodeURIComponent(
        res.data.connectorUri
      )}`;

      await new Promise<void>((resolve, reject) => {
        const modal = Modal.confirm({
          icon: <MetamaskIcon />,
          title: "Connect Metamask",
          okText: "Open Metamask",
          onOk: () => {
            window.open(metamaskUrl);
            modal.destroy();
            resolve();
          },
          onCancel: () => {
            modal.destroy();
            reject(new Error("User did not open Metamask"));
          },
        });
      });

      const timeout = Date.now() + 30 * 1000;
      while (Date.now() < timeout) {
        const res = await checkWalletConnectSessionMutation();
        if (!!res.data?.threepid) {
          return res.data.threepid.id;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      throw new Error("Wallet Connect session timed out");
    } else {
      const address = await requestAddress();

      // When doing this immediately, we get stuck in infinite loading.
      // Note(fant): should we somehow await provider.current to be refreshed?
      await new Promise((resolve) => setTimeout(resolve, 500));
      const message = "Dework Sign In";
      const signature = await personalSign(message, address);

      const res = await createMetamaskThreepidMutation({
        variables: { input: { address, message, signature } },
      });
      if (!res.data) {
        throw new Error("Failed to create Metamask threepid");
      }
      return res.data.threepid.id;
    }
  }, [
    personalSign,
    requestAddress,
    createMetamaskThreepidMutation,
    checkWalletConnectSessionMutation,
    startWalletConnectSessionMutation,
    isMetamaskAvailable,
  ]);
}
