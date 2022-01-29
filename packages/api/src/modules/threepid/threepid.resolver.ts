import { Threepid, ThreepidSource } from "@dewo/api/models/Threepid";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Args, Mutation } from "@nestjs/graphql";
import { ethers } from "ethers";
import { CreateHiroThreepidInput } from "./dto/CreateHiroThreepidInput";
import { CreateMetamaskThreepidInput } from "./dto/CreateMetamaskThreepidInput";
import { ThreepidService } from "./threepid.service";

@Injectable()
export class ThreepidResolver {
  constructor(private readonly threepidService: ThreepidService) {}

  @Mutation(() => Threepid)
  public async createMetamaskThreepid(
    @Args("input") input: CreateMetamaskThreepidInput
  ) {
    const address = ethers.utils.verifyMessage(input.message, input.signature);
    if (address.toLowerCase() !== input.address.toLowerCase()) {
      throw new BadRequestException("Signature does not match address");
    }

    return this.threepidService.findOrCreate({
      source: ThreepidSource.metamask,
      threepid: address,
      config: { signature: input.signature, message: input.message },
    });
  }

  @Mutation(() => Threepid)
  public async createHiroThreepid(
    @Args("input") input: CreateHiroThreepidInput
  ) {
    return this.threepidService.findOrCreate({
      source: ThreepidSource.hiro,
      threepid: input.mainnetAddress,
      config: input,
    });
  }
}
