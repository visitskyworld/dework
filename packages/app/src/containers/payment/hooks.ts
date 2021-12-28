import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import * as URL from "url";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  CreatePaymentMethodInput,
  CreatePaymentMethodMutation,
  CreatePaymentMethodMutationVariables,
  CreateTaskPaymentsMutation,
  CreateTaskPaymentsMutationVariables,
  GetPaymentNetworksQuery,
  GetProjectQuery,
  GetProjectQueryVariables,
  Payment,
  PaymentMethod,
  PaymentMethodType,
  Task,
  TaskReward,
  UpdatePaymentMethodInput,
  UpdatePaymentMethodMutation,
  UpdatePaymentMethodMutationVariables,
  User,
  UserPaymentMethodQuery,
  UserPaymentMethodQueryVariables,
} from "@dewo/app/graphql/types";
import { useCreateEthereumTransaction } from "@dewo/app/util/ethereum";
import { useCreateSolanaTransaction } from "@dewo/app/util/solana";
import { useCallback } from "react";

export const shortenedAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

export const canPaymentMethodReceiveTaskReward = (
  paymentMethod: PaymentMethod,
  reward: TaskReward
) => paymentMethod.networks.some((n) => n.id === reward.token.networkId);
export const canPaymentMethodSendTaskReward = (
  paymentMethod: PaymentMethod,
  reward: TaskReward
) =>
  paymentMethod.networks.some((n) => n.id === reward.token.networkId) &&
  paymentMethod.tokens.some((t) => t.id === reward.token.id);

export function explorerLink(payment: Payment): string | undefined {
  if (!!payment.data?.signature) {
    return `https://explorer.solana.com/tx/${payment.data.signature}?cluster=${payment.network.config.cluster}`;
  }

  if (!!payment.data?.txHash) {
    const url = URL.parse(payment.network.config.explorerUrl);
    url.pathname += `/tx/${payment.data.txHash}`;
    return url.href;
  }

  if (!!payment.data?.safeTxHash && !!payment.network.config.gnosisSafe) {
    const addressPrefix = payment.network.config.gnosisSafe.addressPrefix;
    const prefix = !!addressPrefix ? `${addressPrefix}:` : "";
    return `https://gnosis-safe.io/app/${prefix}${payment.paymentMethod.address}/transactions/queue`;
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

  const [loadUserPaymentMethod] = useLazyQuery<
    UserPaymentMethodQuery,
    UserPaymentMethodQueryVariables
  >(Queries.userPaymentMethod);
  const [loadProject] = useLazyQuery<GetProjectQuery, GetProjectQueryVariables>(
    Queries.project
  );
  const [registerTaskPayment] = useMutation<
    CreateTaskPaymentsMutation,
    CreateTaskPaymentsMutationVariables
  >(Mutations.createTaskPayments);

  const createSolanaTransaction = useCreateSolanaTransaction();
  const createEthereuTransaction = useCreateEthereumTransaction();

  return useCallback(
    async (task: Task, user: User) => {
      const reward = task.reward;
      if (!reward) throw new Error("Task has no reward, so cannot pay");

      const [project, userPaymentMethods] = await Promise.all([
        loadProject({
          variables: { projectId: task.projectId },
        }).then((res) => res.data?.project),
        loadUserPaymentMethod({ variables: { id: user.id } }).then(
          (res) => res.data?.user.paymentMethods ?? []
        ),
      ]);

      if (!project) throw new Error("Project not found");

      const from = project.paymentMethods.find((pm) =>
        canPaymentMethodSendTaskReward(pm, reward)
      );
      const to = userPaymentMethods.find((pm) =>
        canPaymentMethodReceiveTaskReward(pm, reward)
      );

      if (!from) throw new NoProjectPaymentMethodError();

      const network = from.networks.find(
        (n) => n.id === reward.token.networkId
      )!;
      if (!to) {
        throw new NoUserPaymentMethodError(
          `${user.username} has no payment method on ${network.name}`
        );
      }

      switch (from.type) {
        case PaymentMethodType.METAMASK: {
          const txHash = await createEthereuTransaction(
            from.address,
            to.address,
            reward.amount,
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
            to.address,
            Number(reward.amount),
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
          throw new Error("Implement Gnosis Safe pay now");
        }
        default:
          throw new Error(`Unknown payment method: "${from.type}"`);
      }
    },
    [
      loadProject,
      loadUserPaymentMethod,
      createSolanaTransaction,
      createEthereuTransaction,
      registerTaskPayment,
    ]
  );
}
