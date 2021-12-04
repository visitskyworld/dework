import { useLazyQuery, useMutation } from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  CreatePaymentMethodInput,
  CreatePaymentMethodMutation,
  CreatePaymentMethodMutationVariables,
  PaymentMethod,
  PaymentMethodType,
  TaskReward,
} from "@dewo/app/graphql/types";
import { useSignPayout as useSignMetamaskPayout } from "@dewo/app/util/ethereum";
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

export function usePay(
  paymentMethod: PaymentMethod | undefined
): (userId: string, reward: TaskReward) => Promise<void> {
  const signMetamaskPayout = useSignMetamaskPayout();
  const [loadUserPaymentMethod] = useLazyQuery(Queries.userPaymentMethod);
  return useCallback(
    async (userId: string, reward: TaskReward) => {
      if (!paymentMethod) {
        throw new Error("No payment method selected");
      }

      const res = await loadUserPaymentMethod({ variables: { id: userId } });
      if (!res.data?.user.paymentMethod) {
        throw new Error("User has no payment method");
      }

      switch (paymentMethod.type) {
        case PaymentMethodType.METAMASK: {
          if (reward.currency === "ETH") {
            await signMetamaskPayout(
              res.data.user.paymentMethod.address,
              reward.amount
            );
          } else {
            throw new Error(`Unknown reward currency: ${reward.currency}`);
          }
          break;
        }
        default:
          throw new Error(`Unknown payment method: "${paymentMethod.type}"`);
      }
    },
    [paymentMethod, loadUserPaymentMethod, signMetamaskPayout]
  );
}
