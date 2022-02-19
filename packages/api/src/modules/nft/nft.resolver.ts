import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Organization } from "@dewo/api/models/Organization";
import { PermalinkService } from "../permalink/permalink.service";
import { TaskNFT } from "@dewo/api/models/TaskNFT";
import { NFTService } from "./nft.service";

@Resolver(() => Organization)
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

  @Query(() => TaskNFT)
  public async getTaskNFT(
    @Args("tokenId", { type: () => Int }) tokenId: number
  ): Promise<TaskNFT | undefined> {
    const nft = await this.service.findByTokenId(tokenId);
    if (!nft) throw new NotFoundException();
    return nft;
  }
}
