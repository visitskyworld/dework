import { useMutation } from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import {
  CreateTaskPaymentsInput,
  CreateTaskPaymentsMutation,
  CreateTaskPaymentsMutationVariables,
  GetTasksToPayQuery,
  PaymentNetwork,
  PaymentTokenType,
  TaskReward,
  ThreepidSource,
} from "@dewo/app/graphql/types";
import { Constants } from "@dewo/app/util/constants";
import { useERC1155Contract, useERC20Contract } from "@dewo/app/util/ethereum";
import { MetaTransactionData } from "@gnosis.pm/safe-core-sdk-types";
import { useCallback } from "react";

export type TaskToPay = GetTasksToPayQuery["tasks"][number];

export const userToPay = (task: TaskToPay) => task.assignees[0];
export const canPayTaskAssignee = (task: TaskToPay) => {
  const user = userToPay(task);
  return user.threepids.some((t) => t.source === ThreepidSource.metamask);
};

export function usePrepareGnosisTransaction(): (
  reward: TaskReward,
  fromAddress: string,
  toAddress: string,
  network: PaymentNetwork
) => Promise<MetaTransactionData> {
  const loadERC20Contract = useERC20Contract();
  const loadERC1155Contract = useERC1155Contract();
  return useCallback(
    async (reward, fromAddress, toAddress, network) => {
      const { BigNumber } = await import("ethers");

      const usdPriceAccuracy = Math.pow(10, Constants.NUM_DECIMALS_IN_USD_PEG);
      const amount = reward.peggedToUsd
        ? BigNumber.from(reward.amount)
            .mul(BigNumber.from(10).pow(reward.token.exp))
            .mul(BigNumber.from(usdPriceAccuracy))
            .div(
              BigNumber.from(
                Math.round(reward.token.usdPrice! * usdPriceAccuracy)
              )
            )
            .div(BigNumber.from(10).pow(Constants.NUM_DECIMALS_IN_USD_PEG))
        : BigNumber.from(reward.amount);

      if (
        reward.token.type === PaymentTokenType.ERC20 &&
        !!reward.token.address
      ) {
        const contract = await loadERC20Contract(reward.token.address, network);
        // https://ethereum.stackexchange.com/a/116793/89347
        // https://github.com/ethers-io/ethers.js/issues/478#issuecomment-495814010
        return {
          to: reward.token.address,
          value: "0",
          data: contract.interface.encodeFunctionData("transfer", [
            toAddress,
            amount.toString(),
          ]),
        };
      }

      if (
        reward.token.type === PaymentTokenType.ERC1155 &&
        !!reward.token.address
      ) {
        const contract = await loadERC1155Contract(
          reward.token.address,
          network
        );
        return {
          to: reward.token.address,
          value: "0",
          data: contract.interface.encodeFunctionData("safeTransferFrom", [
            fromAddress,
            toAddress,
            reward.token.identifier,
            amount.toString(),
            "0x",
          ]),
        };
      }

      return {
        to: toAddress,
        value: amount.toString(),
        data: `0x${reward.id.replace(/-/g, "")}`,
      };
    },
    [loadERC20Contract, loadERC1155Contract]
  );
}

export function useCreateTaskPayments(): (
  input: CreateTaskPaymentsInput
) => Promise<void> {
  const [mutation] = useMutation<
    CreateTaskPaymentsMutation,
    CreateTaskPaymentsMutationVariables
  >(Mutations.createTaskPayments);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}
