import {
  Args,
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
  public permalink(@Parent() nft: TaskNFT): Promise<string> {
    return this.permalinkService.get(nft);
  }

  @ResolveField(() => String)
  public async explorerUrl(
    @Parent() nft: TaskNFT
  ): Promise<string | undefined> {
    const payment = await nft.payment;
    const network = await payment.network;
    if (["ethereum-rinkeby"].includes(network.slug)) {
      return `https://testnets.opensea.io/assets/${nft.contractAddress}/${nft.tokenId}`;
    }
    if (["ethereum-mainnet", "polygon-mainnet"].includes(network.slug)) {
      return `https://opensea.io/assets/${nft.contractAddress}/${nft.tokenId}`;
    }
    return undefined;
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
