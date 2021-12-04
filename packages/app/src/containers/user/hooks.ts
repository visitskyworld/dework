import { useMutation } from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import {
  UpdateUserInput,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  User,
} from "@dewo/app/graphql/types";
import { useCallback } from "react";

export function useUpdateUser(): (input: UpdateUserInput) => Promise<User> {
  const [mutation] = useMutation<
    UpdateUserMutation,
    UpdateUserMutationVariables
  >(Mutations.updateUser);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.user;
    },
    [mutation]
  );
}
