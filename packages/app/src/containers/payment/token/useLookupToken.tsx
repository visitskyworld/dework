import {
  CreatePaymentTokenInput,
  PaymentNetwork,
  PaymentTokenType,
} from "@dewo/app/graphql/types";
import {
  useERC1155Contract,
  useERC20Contract,
  useERC721Contract,
} from "@dewo/app/util/ethereum";
import { useCallback } from "react";

export function useLookupToken(): (
  address: string,
  network: PaymentNetwork,
  type: PaymentTokenType,
  identifier?: string
) => Promise<CreatePaymentTokenInput | undefined> {
  const loadERC20Contract = useERC20Contract();
  const loadERC721Contract = useERC721Contract();
  const loadERC1155Contract = useERC1155Contract();
  return useCallback(
    async (address, network, type, identifier) => {
      if (type === PaymentTokenType.ERC20) {
        const contract = await loadERC20Contract(address, network);
        const name = await contract.name();
        const symbol = await contract.symbol();
        const exp = await contract.decimals();
        const networkId = network.id;
        return { address, name, symbol, exp, networkId, type };
      }

      if (type === PaymentTokenType.ERC721) {
        const contract = await loadERC721Contract(address, network);
        const name = await contract.name();
        const symbol = await contract.symbol();
        const networkId = network.id;
        return { address, name, symbol, exp: 0, networkId, type };
      }

      if (type === PaymentTokenType.ERC1155) {
        if (!identifier) {
          throw new Error("Cannot fetch ERC1155 token without identifier");
        }

        const contract = await loadERC1155Contract(address, network);
        const uri = await contract.uri(Number(identifier));

        interface ERC1155Metadata {
          name: string;
          description: string;
          image: string;
        }

        const metadata: ERC1155Metadata = await fetch(
          uri
            .replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/")
            .replace("{id}", identifier!)
        )
          .then((res) => res.json())
          .catch(() => ({
            name: address,
            description: address,
            image: "",
          }));

        const name = metadata.name || address;
        const symbol = metadata.name || address;
        const networkId = network.id;
        return { address, name, symbol, exp: 0, identifier, networkId, type };
      }

      return undefined;
    },
    [loadERC20Contract, loadERC721Contract, loadERC1155Contract]
  );
}
