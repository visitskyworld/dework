import { useMutation } from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import {
  CreateTaskPaymentsInput,
  CreateTaskPaymentsMutation,
  CreateTaskPaymentsMutationVariables,
  GetTasksToPayQuery,
  PaymentNetwork,
  PaymentToken,
  PaymentTokenType,
} from "@dewo/app/graphql/types";
import { useERC1155Contract, useERC20Contract } from "@dewo/app/util/ethereum";
import { MetaTransactionData } from "@gnosis.pm/safe-core-sdk-types";
import { useCallback } from "react";

export type TaskToPay = GetTasksToPayQuery["tasks"][number];

export function usePrepareGnosisTransaction(): (
  amount: string,
  token: PaymentToken,
  fromAddress: string,
  toAddress: string,
  network: PaymentNetwork
) => Promise<MetaTransactionData> {
  const loadERC20Contract = useERC20Contract();
  const loadERC1155Contract = useERC1155Contract();
  return useCallback(
    async (amount, token, fromAddress, toAddress, network) => {
      if (token.type === PaymentTokenType.ERC20 && !!token.address) {
        const contract = await loadERC20Contract(token.address, network);
        // https://ethereum.stackexchange.com/a/116793/89347
        // https://github.com/ethers-io/ethers.js/issues/478#issuecomment-495814010
        return {
          to: token.address,
          value: "0",
          data: contract.interface.encodeFunctionData("transfer", [
            toAddress,
            amount.toString(),
          ]),
        };
      }

      if (token.type === PaymentTokenType.ERC1155 && !!token.address) {
        const contract = await loadERC1155Contract(token.address, network);
        return {
          to: token.address,
          value: "0",
          data: contract.interface.encodeFunctionData("safeTransferFrom", [
            fromAddress,
            toAddress,
            token.identifier,
            amount.toString(),
            "0x",
          ]),
        };
      }

      return {
        to: toAddress,
        value: amount.toString(),
        data: "0x",
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
