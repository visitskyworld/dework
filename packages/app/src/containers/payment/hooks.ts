import { useMutation } from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import {
  CreatePaymentMethodInput,
  CreatePaymentMethodMutation,
  CreatePaymentMethodMutationVariables,
  PaymentMethod,
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
