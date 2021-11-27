import { useMutation } from "@apollo/client";
import { useCallback } from "react";
import * as Mutations from "@dewo/app/graphql/mutations";
import {
  AuthWithThreepidMutation,
  AuthWithThreepidMutationVariables,
} from "@dewo/app/graphql/types";
import { setAuthToken } from "@dewo/app/util/authToken";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";

export function useAuthWithThreepid(): (threepidId: string) => Promise<void> {
  const { setAuthenticated } = useAuthContext();
  const [authWithThreepid] = useMutation<
    AuthWithThreepidMutation,
    AuthWithThreepidMutationVariables
  >(Mutations.authWithThreepid);
  return useCallback(
    async (threepidId: string) => {
      const res = await authWithThreepid({ variables: { threepidId } });

      if (!!res.data) {
        setAuthToken(undefined, res.data?.authWithThreepid.authToken);
        setAuthenticated(true);
      }
    },
    [authWithThreepid, setAuthenticated]
  );
}
