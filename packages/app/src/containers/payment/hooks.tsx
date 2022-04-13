import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import * as URL from "url";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  CreatePaymentMethodInput,
  CreatePaymentMethodMutation,
  CreatePaymentMethodMutationVariables,
  CreatePaymentTokenInput,
  CreatePaymentTokenMutation,
  CreatePaymentTokenMutationVariables,
  CreateTaskPaymentsMutation,
  CreateTaskPaymentsMutationVariables,
  GetPaymentNetworksQuery,
  GetProjectPaymentMethodsQuery,
  GetProjectPaymentMethodsQueryVariables,
  Payment,
  PaymentMethod,
  PaymentMethodType,
  PaymentToken,
  Task,
  TaskReward,
  ThreepidSource,
  UpdatePaymentMethodInput,
  UpdatePaymentMethodMutation,
  UpdatePaymentMethodMutationVariables,
  User,
  UserAddressQuery,
  UserAddressQueryVariables,
} from "@dewo/app/graphql/types";
import { useCreateEthereumTransaction } from "@dewo/app/util/ethereum";
import { useCreateSolanaTransaction } from "@dewo/app/util/solana";
import React, { useCallback } from "react";
import { useCreateStacksTransaction } from "@dewo/app/util/hiro";
import { Modal } from "antd";
import { SelectPaymentMethodModalContent } from "./SelectPaymentMethodModalContent";
import { Constants } from "@dewo/app/util/constants";

export const shortenedAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

export const canPaymentMethodReceiveTaskReward = (
  paymentMethod: PaymentMethod,
  reward: TaskReward
) => paymentMethod.networks.some((n) => n.id === reward.token.networkId);
export const canPaymentMethodSendTaskReward = (
  paymentMethod: PaymentMethod,
  reward: TaskReward
) => paymentMethod.networks.some((n) => n.id === reward.token.networkId);

export function explorerLink(payment: Payment): string | undefined {
  if (!!payment.data?.signature) {
    return `https://explorer.solana.com/tx/${payment.data.signature}?cluster=${payment.network.config.cluster}`;
  }

  if (!!payment.data?.txHash) {
    const url = URL.parse(payment.network.config.explorerUrl);
    url.pathname += `tx/${payment.data.txHash}`;
    return URL.format(url);
  }

  if (!!payment.data?.safeTxHash && !!payment.network.config.gnosisSafe) {
    const safeUrlPrefix = payment.network.config.gnosisSafe.safeUrlPrefix;
    return `${safeUrlPrefix}${payment.paymentMethod.address}/transactions/queue`;
  }

  if (!!payment.data?.txId) {
    return `https://explorer.stacks.co/txid/${payment.data.txId}?chain=${payment.network.config.chain}`;
  }

  return undefined;
}

export function useCreatePaymentMethod(): (
  input: CreatePaymentMethodInput
) => Promise<PaymentMethod> {
  const [mutation] = useMutation<
    CreatePaymentMethodMutation,
    CreatePaymentMethodMutationVariables
  >(Mutations.createPaymentMethod);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.paymentMethod;
    },
    [mutation]
  );
}

export function useUpdatePaymentMethod(): (
  input: UpdatePaymentMethodInput
) => Promise<PaymentMethod> {
  const [mutation] = useMutation<
    UpdatePaymentMethodMutation,
    UpdatePaymentMethodMutationVariables
  >(Mutations.updatePaymentMethod);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.paymentMethod;
    },
    [mutation]
  );
}

export function useCreatePaymentToken(): (
  input: CreatePaymentTokenInput
) => Promise<PaymentToken> {
  const [mutation] = useMutation<
    CreatePaymentTokenMutation,
    CreatePaymentTokenMutationVariables
  >(Mutations.createPaymentToken);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.token;
    },
    [mutation]
  );
}

export function usePaymentNetworks():
  | GetPaymentNetworksQuery["networks"]
  | undefined {
  const { data } = useQuery<GetPaymentNetworksQuery>(Queries.paymentNetworks);
  return data?.networks ?? undefined;
}

export class NoProjectPaymentMethodError extends Error {}
export class NoUserPaymentMethodError extends Error {}

export function usePayTaskReward(): (task: Task, user: User) => Promise<void> {
  // const signMetamaskPayout = useSignMetamaskPayout();
  // const signPhantomPayout = useSignPhantomPayout();
  // const signGnosisPayout = useSignGnosisPayout();

  const [loadUserAddress] = useLazyQuery<
    UserAddressQuery,
    UserAddressQueryVariables
  >(Queries.userAddress);
  const [loadProjectPaymentMethods] = useLazyQuery<
    GetProjectPaymentMethodsQuery,
    GetProjectPaymentMethodsQueryVariables
  >(Queries.projectPaymentMethods);
  const [registerTaskPayment] = useMutation<
    CreateTaskPaymentsMutation,
    CreateTaskPaymentsMutationVariables
  >(Mutations.createTaskPayments);

  const createSolanaTransaction = useCreateSolanaTransaction();
  const createEthereumTransaction = useCreateEthereumTransaction();
  const createStacksTransaction = useCreateStacksTransaction();

  const selectProjectPaymentMethod = useCallback(
    async (pms: PaymentMethod[]): Promise<PaymentMethod> => {
      if (pms.length === 0) throw new NoProjectPaymentMethodError();
      if (pms.length === 1) return pms[0];
      return new Promise<PaymentMethod>((resolve, reject) => {
        const modal = Modal.info({
          title: "Select Payment Method",
          content: (
            <SelectPaymentMethodModalContent
              methods={pms}
              onSelect={(pm) => {
                resolve(pm);
                modal.destroy();
              }}
            />
          ),
          okText: "Cancel",
          okType: "default",
          autoFocusButton: null,
          onOk: () => reject(new Error("No payment method selected")),
        });
      });
    },
    []
  );

  return useCallback(
    async (task: Task, user: User) => {
      const { BigNumber } = await import("ethers");
      const reward = task.reward;
      if (!reward) throw new Error("Task has no reward, so cannot pay");
      if (reward.peggedToUsd && !reward.token.usdPrice) {
        throw new Error(
          `This task reward is pegged to USD, but we currently don't know ${reward.token.symbol}'s USD value. Write to us on Discord and we will set this up for your token.`
        );
      }

      const amount = reward.peggedToUsd
        ? BigNumber.from(reward.amount)
            .mul(BigNumber.from(10).pow(reward.token.exp))
            .div(BigNumber.from(Math.round(reward.token.usdPrice!)))
            .div(BigNumber.from(10).pow(Constants.NUM_DECIMALS_IN_USD_PEG))
        : BigNumber.from(reward.amount);
      const [paymentMethods, userAddress] = await Promise.all([
        loadProjectPaymentMethods({
          variables: { projectId: task.projectId },
        }).then((res) => res.data?.project.paymentMethods),
        loadUserAddress({ variables: { id: user.id } }).then(
          (res) =>
            res.data?.user.threepids?.find(
              (t) => t.source === ThreepidSource.metamask
            )?.address
        ),
      ]);

      if (!paymentMethods) throw new Error("Project not found");

      const matchingSenderPaymentMethods = paymentMethods.filter((pm) =>
        canPaymentMethodSendTaskReward(pm, reward)
      );
      const from = await selectProjectPaymentMethod(
        matchingSenderPaymentMethods
      );

      const network = from.networks.find(
        (n) => n.id === reward.token.networkId
      )!;
      if (!userAddress) {
        throw new NoUserPaymentMethodError(
          `${user.username} has no payment method on ${network.name}`
        );
      }

      switch (from.type) {
        case PaymentMethodType.METAMASK: {
          const txHash = await createEthereumTransaction(
            from.address,
            userAddress,
            amount.toString(),
            reward.token,
            network
          );

          await registerTaskPayment({
            variables: {
              input: {
                taskRewardIds: [reward.id],
                networkId: reward.token.networkId,
                paymentMethodId: from.id,
                data: { txHash },
              },
            },
          });
          break;
        }
        case PaymentMethodType.PHANTOM: {
          const network = from.networks.find(
            (n) => n.id === reward.token.networkId
          )!;
          const signature = await createSolanaTransaction(
            from.address,
            userAddress,
            amount.toNumber(),
            reward.token,
            network
          );
          await registerTaskPayment({
            variables: {
              input: {
                taskRewardIds: [reward.id],
                networkId: reward.token.networkId,
                paymentMethodId: from.id,
                data: { signature },
              },
            },
          });
          break;
        }
        case PaymentMethodType.HIRO: {
          const network = from.networks.find(
            (n) => n.id === reward.token.networkId
          )!;
          const txId = await createStacksTransaction(
            from.address,
            userAddress,
            amount.toString(),
            reward.token,
            network
          );
          await registerTaskPayment({
            variables: {
              input: {
                taskRewardIds: [reward.id],
                networkId: reward.token.networkId,
                paymentMethodId: from.id,
                data: { txId },
              },
            },
          });
          break;
        }
        case PaymentMethodType.GNOSIS_SAFE: {
          // const signed = await signGnosisPayout(
          //   fromPaymentMethod.address,
          //   toPaymentMethod.address,
          //   task.reward.amount,
          //   task.reward.id
          // );

          // await createTaskPayment({
          //   variables: {
          //     input: {
          //       taskRewardIds: [tas]
          //       taskId: task.id,
          //       txHash: signed.txHash,
          //       data: { safeTxHash: signed.safeTxHash },
          //     },
          //   },
          // });
          throw new Error('Use the "Pay Now" button to pay with Gnosis Safe');
        }
        default:
          throw new Error(`Unknown payment method: "${from.type}"`);
      }
    },
    [
      loadProjectPaymentMethods,
      loadUserAddress,
      createSolanaTransaction,
      createEthereumTransaction,
      createStacksTransaction,
      selectProjectPaymentMethod,
      registerTaskPayment,
    ]
  );
}
