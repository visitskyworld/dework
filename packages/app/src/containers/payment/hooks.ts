import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  CreatePaymentMethodInput,
  CreatePaymentMethodMutation,
  CreatePaymentMethodMutationVariables,
  GetPaymentNetworksQuery,
  GetProjectQuery,
  GetProjectQueryVariables,
  PaymentMethod,
  PaymentMethodType,
  Task,
  UpdatePaymentMethodInput,
  UpdatePaymentMethodMutation,
  UpdatePaymentMethodMutationVariables,
  User,
  UserPaymentMethodQuery,
  UserPaymentMethodQueryVariables,
} from "@dewo/app/graphql/types";
import { useCallback } from "react";

export const shortenedAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

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
  const [loadProjectPaymentMethod] = useLazyQuery<
    GetProjectQuery,
    GetProjectQueryVariables
  >(Queries.project);
  // const [createTaskPayment] = useMutation<
  //   CreateTaskPaymentsMutation,
  //   CreateTaskPaymentsMutationVariables
  // >(Mutations.createTaskPayments);

  return useCallback(
    async (task: Task, user: User) => {
      if (!task.reward) throw new Error("Task has no reward, so cannot pay");

      const [fromPaymentMethod, toPaymentMethod] = await Promise.all([
        loadProjectPaymentMethod({
          variables: { projectId: task.projectId },
        }).then((res) => res.data?.project.paymentMethods[0]),
        loadUserPaymentMethod({ variables: { id: user.id } }).then(
          (res) => res.data?.user.paymentMethod
        ),
      ]);

      if (!fromPaymentMethod) {
        throw new NoProjectPaymentMethodError();
      }

      if (!toPaymentMethod) {
        throw new NoUserPaymentMethodError();
      }

      switch (fromPaymentMethod.type) {
        case PaymentMethodType.METAMASK: {
          throw new Error("Implement Phantom pay now");
          // if (task.reward.currency === "ETH") {
          //   await signMetamaskPayout(
          //     toPaymentMethod.address,
          //     task.reward.amount
          //   );
          // } else {
          //   throw new Error(`Unknown reward currency: ${task.reward.currency}`);
          // }
          // break;
        }
        case PaymentMethodType.PHANTOM: {
          throw new Error("Implement Phantom pay now");
          // await signPhantomPayout(toPaymentMethod.address, task.reward.amount);
          // break;
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
          throw new Error(
            `Unknown payment method: "${fromPaymentMethod.type}"`
          );
      }
    },
    [loadProjectPaymentMethod, loadUserPaymentMethod]
  );
}
