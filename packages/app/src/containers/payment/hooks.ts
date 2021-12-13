import { useLazyQuery, useMutation } from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  CreatePaymentMethodInput,
  CreatePaymentMethodMutation,
  CreatePaymentMethodMutationVariables,
  GetProjectQuery,
  GetProjectQueryVariables,
  PaymentMethod,
  PaymentMethodType,
  Task,
  User,
  UserPaymentMethodQuery,
  UserPaymentMethodQueryVariables,
} from "@dewo/app/graphql/types";
import { useSignPayout as useSignMetamaskPayout } from "@dewo/app/util/ethereum";
import { useSignPhantomPayout } from "@dewo/app/util/solana";
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

export class NoProjectPaymentMethodError extends Error {}
export class NoUserPaymentMethodError extends Error {}

export function usePayTaskReward(): (task: Task, user: User) => Promise<void> {
  const signMetamaskPayout = useSignMetamaskPayout();
  const signPhantomPayout = useSignPhantomPayout();

  const [loadUserPaymentMethod] = useLazyQuery<
    UserPaymentMethodQuery,
    UserPaymentMethodQueryVariables
  >(Queries.userPaymentMethod);
  const [loadProjectPaymentMethod] = useLazyQuery<
    GetProjectQuery,
    GetProjectQueryVariables
  >(Queries.project);
  return useCallback(
    async (task: Task, user: User) => {
      if (!task.reward) throw new Error("Task has no reward, so cannot pay");

      const projectP = loadProjectPaymentMethod({
        variables: { projectId: task.projectId },
      });

      const userP = loadUserPaymentMethod({ variables: { id: user.id } });

      const project = await projectP.then((res) => res.data?.project);
      console.log("project?.paymentMethod", project?.paymentMethod);
      if (!project?.paymentMethod) {
        throw new NoProjectPaymentMethodError();
      }

      const userPaymentMethod = await userP.then(
        (res) => res.data?.user.paymentMethod
      );
      if (!userPaymentMethod) {
        throw new NoUserPaymentMethodError();
      }

      switch (project.paymentMethod.type) {
        case PaymentMethodType.METAMASK: {
          if (task.reward.currency === "ETH") {
            await signMetamaskPayout(
              userPaymentMethod.address,
              task.reward.amount
            );
          } else {
            throw new Error(`Unknown reward currency: ${task.reward.currency}`);
          }
          break;
        }
        case PaymentMethodType.PHANTOM: {
          console.log("task.reward", task.reward);
          console.log("address∏", userPaymentMethod.address);
          await signPhantomPayout(
            res.data.user.paymentMethod.address,
            reward.amount
          );
        }
        default:
          throw new Error(
            `Unknown payment method: "${project.paymentMethod.type}"`
          );
      }
    },
    [loadUserPaymentMethod, loadProjectPaymentMethod, signMetamaskPayout]
  );
}
