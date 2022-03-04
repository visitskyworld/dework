import {
  Args,
  Context,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PermalinkService } from "../permalink/permalink.service";
import { TaskNFT } from "@dewo/api/models/TaskNFT";
import { NFTService } from "./nft.service";

@Resolver(() => TaskNFT)
@Injectable()
export class TaskNFTResolver {
  constructor(
    private readonly service: NFTService,
    private readonly permalinkService: PermalinkService
  ) {}

  @ResolveField(() => String)
  public permalink(
    @Context("origin") origin: string,
    @Parent() nft: TaskNFT
  ): Promise<string> {
    return this.permalinkService.get(nft, origin);
  }

  @ResolveField(() => String)
  public async explorerUrl(
    @Parent() nft: TaskNFT
  ): Promise<string | undefined> {
    const payment = await nft.payment;
    const network = await payment.network;
    switch (network.slug) {
      case "ethereum-rinkeby":
        return `https://testnets.opensea.io/assets/${nft.contractAddress}/${nft.tokenId}`;
      case "ethereum-mainnet":
        return `https://opensea.io/assets/${nft.contractAddress}/${nft.tokenId}`;
      case "polygon-mainnet":
        return `https://opensea.io/assets/matic/${nft.contractAddress}/${nft.tokenId}`;
      default:
        return undefined;
    }
  }

  @Query(() => TaskNFT)
  public async getTaskNFT(
    @Args("tokenId", { type: () => Int }) tokenId: number,
    @Args("contractId") contractId: string
  ): Promise<TaskNFT | undefined> {
    const nft = await this.service.findByTokenId(tokenId, contractId);
    if (!nft) throw new NotFoundException();
    return nft;
  }
}
