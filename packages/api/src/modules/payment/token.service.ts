import { PaymentToken, PaymentTokenType } from "@dewo/api/models/PaymentToken";
import { ThreepidSource } from "@dewo/api/models/Threepid";
import { User } from "@dewo/api/models/User";
import { Injectable } from "@nestjs/common";
import { BigNumber, ethers } from "ethers";

interface ERC721Contract {
  balanceOf(owner: string): Promise<BigNumber>;
}

interface ERC1155Contract {
  balanceOf(owner: string, id: number): Promise<BigNumber>;
}

@Injectable()
export class TokenService {
  public async balanceOf(token: PaymentToken, user: User): Promise<BigNumber> {
    const threepids = await user.threepids;
    const addresses = threepids
      .filter((t) => t.source === ThreepidSource.metamask)
      .map((t) => t.threepid);

    if (!addresses.length) return BigNumber.from(0);

    if (
      token.type === PaymentTokenType.ERC721 ||
      token.type === PaymentTokenType.ERC20
    ) {
      const network = await token.network;
      const provider = new ethers.providers.JsonRpcProvider(
        network.config.rpcUrl
      );
      const contract = new ethers.Contract(
        token.address!,
        [
          "function balanceOf(address owner) public view returns (uint256 balance)",
        ],
        provider
      ) as ethers.Contract & ERC721Contract;
      const balances = await Promise.all(
        addresses.map((address) => contract.balanceOf(address))
      );
      return balances.reduce((acc, cur) => acc.add(cur), BigNumber.from(0));
    }

    if (token.type === PaymentTokenType.ERC1155) {
      const network = await token.network;
      const provider = new ethers.providers.JsonRpcProvider(
        network.config.rpcUrl
      );
      const contract = new ethers.Contract(
        token.address!,
        [
          "function balanceOf(address owner, uint256 id) public view returns (uint256 balance)",
        ],
        provider
      ) as ethers.Contract & ERC1155Contract;
      const balances = await Promise.all(
        addresses.map((address) =>
          contract.balanceOf(address, Number(token.identifier))
        )
      );
      return balances.reduce((acc, cur) => acc.add(cur), BigNumber.from(0));
    }

    return BigNumber.from(0);
  }
}
