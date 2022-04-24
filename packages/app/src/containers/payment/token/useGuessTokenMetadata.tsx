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

export function useGuessTokenMetadata(): (
  address: string,
  network: PaymentNetwork,
  identifier?: string
) => Promise<CreatePaymentTokenInput | undefined> {
  const loadERC20Contract = useERC20Contract();
  const loadERC721Contract = useERC721Contract();
  const loadERC1155Contract = useERC1155Contract();
  return useCallback(
    async (address, network, identifier) => {
      try {
        const contract = await loadERC20Contract(address, network);
        const name = await contract.name();
        const symbol = await contract.symbol();
        const exp = await contract.decimals();
        const networkId = network.id;
        const type = PaymentTokenType.ERC20;
        return { address, name, symbol, exp, networkId, type };
      } catch (error) {
        console.log("Token is not ERC20", error);
      }

      try {
        const contract = await loadERC721Contract(address, network);
        const name = await contract.name();
        const symbol = await contract.symbol();
        const networkId = network.id;
        const type = PaymentTokenType.ERC721;
        return { address, name, symbol, exp: 1, networkId, type };
      } catch (error) {
        console.log("Token is not ERC721", error);
      }

      try {
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
        const type = PaymentTokenType.ERC1155;
        return { address, name, symbol, exp: 1, identifier, networkId, type };
      } catch (error) {
        console.log("Token is not ERC1155", error);
      }

      return undefined;
    },
    [loadERC20Contract, loadERC721Contract, loadERC1155Contract]
  );
}
