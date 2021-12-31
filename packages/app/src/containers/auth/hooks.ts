import { useMutation } from "@apollo/client";
import { useCallback } from "react";
import * as Mutations from "@dewo/app/graphql/mutations";
import {
  AuthWithThreepidMutation,
  AuthWithThreepidMutationVariables,
  CreateMetamaskThreepid,
  CreateMetamaskThreepidVariables,
} from "@dewo/app/graphql/types";
import { setAuthToken } from "@dewo/app/util/authToken";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useProvider, useRequestSigner } from "@dewo/app/util/ethereum";

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

export function useCreateMetamaskThreepid(): () => Promise<string> {
  const provider = useProvider();
  const requestSigner = useRequestSigner();

  const [mutation] = useMutation<
    CreateMetamaskThreepid,
    CreateMetamaskThreepidVariables
  >(Mutations.createMetamaskThreepid);

  return useCallback(async () => {
    const signer = await requestSigner();
    const address = await signer.getAddress();

    // When doing this immediately, we get stuck in infinite loading.
    // Note(fant): should we somehow await provider.current to be refreshed?
    await new Promise((resolve) => setTimeout(resolve, 500));
    const message = "Dework Sign In";
    const signature = await provider.current.send("personal_sign", [
      address,
      message,
    ]);

    const res = await mutation({
      variables: { input: { address, message, signature } },
    });
    if (!res.data) {
      throw new Error("Failed to create Metamask threepid");
    }
    return res.data.threepid.id;
  }, [provider, requestSigner, mutation]);
}
