import { PaymentMethod } from "@dewo/api/models/PaymentMethod";
import { PaymentToken, PaymentTokenType } from "@dewo/api/models/PaymentToken";
import { User } from "@dewo/api/models/User";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BigNumber, ethers } from "ethers";
import { Repository } from "typeorm";

interface ERC721Contract {
  balanceOf(owner: string): Promise<BigNumber>;
}

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepo: Repository<PaymentMethod>
  ) {}

  public async balanceOf(token: PaymentToken, user: User): Promise<BigNumber> {
    const addresses = await this.paymentMethodRepo
      .createQueryBuilder("paymentMethod")
      .innerJoin("paymentMethod.networks", "network")
      .where("network.id = :networkId", { networkId: token.networkId })
      .andWhere("paymentMethod.userId = :userId", { userId: user.id })
      .getMany()
      .then((pms) => pms.map((pm) => pm.address));

    console.warn("balanceOf 1", addresses);
    if (!addresses.length) return BigNumber.from(0);

    if (
      token.type === PaymentTokenType.ERC721 ||
      token.type === PaymentTokenType.ERC20
    ) {
      const network = await token.network;
      const provider = new ethers.providers.JsonRpcProvider(
        network.config.rpcUrl
      );
      console.warn("balanceOf 2", network);
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
      console.warn("balanceOf 3", balances);
      return balances.reduce((acc, cur) => acc.add(cur), BigNumber.from(0));
    }

    return BigNumber.from(0);
  }
}
