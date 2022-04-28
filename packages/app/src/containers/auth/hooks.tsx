import { useApolloClient, useMutation } from "@apollo/client";
import React, { useCallback, useMemo } from "react";
import * as uuid from "uuid";
import * as Mutations from "@dewo/app/graphql/mutations";
import {
  AuthWithThreepidMutation,
  AuthWithThreepidMutationVariables,
  CheckWalletConnectSessionMutation,
  CheckWalletConnectSessionMutationVariables,
  CreateHiroThreepid,
  CreateHiroThreepidVariables,
  CreateMetamaskThreepid,
  CreateMetamaskThreepidVariables,
  CreatePhantomThreepid,
  CreatePhantomThreepidVariables,
  StartWalletConnectSessionMutation,
  StartWalletConnectSessionMutationVariables,
  ThreepidSource,
  UserDetails,
  DeleteThreepidMutation,
  DeleteThreepidMutationVariables,
} from "@dewo/app/graphql/types";
import {
  usePersonalSign,
  useProvider,
  useRequestAddress,
} from "@dewo/app/util/ethereum";
import { Modal } from "antd";
import { MetamaskIcon } from "@dewo/app/components/icons/Metamask";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useRequestAddresses } from "@dewo/app/util/hiro";
import * as solana from "@dewo/app/util/solana";
import { useWalletConnector } from "@dewo/app/util/walletconnect";
import { deleteThreepid } from "@dewo/app/graphql/mutations/threepid";

export function useAuthWithThreepid(): (
  threepidId: string
) => Promise<UserDetails> {
  const { onAuthenticated } = useAuthContext();
  const apolloClient = useApolloClient();
  const [authWithThreepid] = useMutation<
    AuthWithThreepidMutation,
    AuthWithThreepidMutationVariables
  >(Mutations.authWithThreepid);
  return useCallback(
    async (threepidId: string) => {
      const res = await authWithThreepid({ variables: { threepidId } });
      if (!res.data) throw new Error();

      onAuthenticated(res.data.authWithThreepid.authToken);
      apolloClient.reFetchObservableQueries(); // async
      return res.data?.authWithThreepid.user;
    },
    [authWithThreepid, apolloClient, onAuthenticated]
  );
}

export function useCreateHiroThreepid(): () => Promise<string> {
  const requestAddresses = useRequestAddresses();
  const [mutation] = useMutation<
    CreateHiroThreepid,
    CreateHiroThreepidVariables
  >(Mutations.createHiroThreepid);
  return useCallback(async () => {
    const addresses = await requestAddresses();

    const res = await mutation({
      variables: {
        input: {
          mainnetAddress: addresses["stacks-mainnet"],
          testnetAddress: addresses["stacks-testnet"],
        },
      },
    });
    if (!res.data) {
      throw new Error("Failed to create Hiro threepid");
    }
    return res.data.threepid.id;
  }, [requestAddresses, mutation]);
}

export function useCreateMetamaskThreepid(): () => Promise<string> {
  const provider = useProvider();
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
    const isMetamaskAvailable = !!provider.current;
    if (!isMetamaskAvailable) {
      const res = await startWalletConnectSessionMutation();
      if (!res.data) throw new Error("Failed to start Wallet Connect session");
      const metamaskUrl = `https://metamask.app.link/wc?uri=${encodeURIComponent(
        res.data.connectorUri
      )}`;

      await new Promise<void>((resolve, reject) => {
        Modal.confirm({
          icon: <MetamaskIcon />,
          title: "Connect Metamask",
          okText: "Open Metamask",
          onOk: () => {
            window.open(metamaskUrl);
            resolve();
          },
          onCancel: () => {
            reject(new Error("User did not open Metamask"));
          },
        });
      });

      const timeout = Date.now() + 30 * 1000;
      while (Date.now() < timeout) {
        const res = await checkWalletConnectSessionMutation().catch(
          () => undefined
        );
        if (!!res?.data?.threepid) {
          return res?.data.threepid.id;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      throw new Error("Wallet Connect session timed out");
    } else {
      const address = await requestAddress();
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
    provider,
  ]);
}

export function useCreateWalletConnectThreepid(): (
  address: string
) => Promise<string> {
  const loadConnector = useWalletConnector();
  const [createMetamaskThreepidMutation] = useMutation<
    CreateMetamaskThreepid,
    CreateMetamaskThreepidVariables
  >(Mutations.createMetamaskThreepid);
  return useCallback(
    async (address: string) => {
      const connector = await loadConnector();
      const message = "Dework Sign In";
      const signature = await connector.signPersonalMessage([message, address]);
      const { data } = await createMetamaskThreepidMutation({
        variables: { input: { address, signature, message } },
      });
      if (!data) {
        throw new Error("Failed to create Wallet Connect threepid");
      }
      return data.threepid.id;
    },
    [loadConnector, createMetamaskThreepidMutation]
  );
}

export function useCreatePhantomThreepid(): () => Promise<string> {
  const isPhantomAvailable = solana.useProvider();
  const requestAddress = solana.useRequestAddress();
  const personalSign = solana.usePersonalSign();

  const [createPhantomThreepidMutation] = useMutation<
    CreatePhantomThreepid,
    CreatePhantomThreepidVariables
  >(Mutations.createPhantomThreepid);

  return useCallback(async () => {
    if (isPhantomAvailable) {
      const address = await requestAddress();
      const message = "Dework Sign In";
      const sign = await personalSign(message);
      const signature = Array.from(sign!);

      const res = await createPhantomThreepidMutation({
        variables: { input: { address, message, signature } },
      });
      if (!res.data) {
        throw new Error("Failed to create Phantom threepid");
      }
      return res.data.threepid.id;
    } else {
      // Phantom doesn't support deep linking
      const phantomUrl = `https://phantom.app/`;

      await new Promise<void>((resolve, reject) => {
        Modal.confirm({
          icon: <MetamaskIcon />,
          title: "Connect Phantom",
          okText: "Open Phantom",
          onOk: () => {
            window.open(phantomUrl);
            resolve();
          },
          onCancel: () => {
            reject(new Error("User did not open Phantom"));
          },
        });
      });

      throw new Error(
        "Phantom not available. Please get the Phantom browser extension to authenticate."
      );
    }
  }, [
    isPhantomAvailable,
    requestAddress,
    personalSign,
    createPhantomThreepidMutation,
  ]);
}

export function useDeleteThreepid(): (id: string) => Promise<void> {
  const [mutation] = useMutation<
    DeleteThreepidMutation,
    DeleteThreepidMutationVariables
  >(deleteThreepid);
  return useCallback(
    async (id) => {
      const res = await mutation({ variables: { id } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}

export const hasDiscordThreepid = (user: UserDetails): boolean =>
  user.threepids.some((d) => d.source === ThreepidSource.discord);
