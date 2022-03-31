import { Threepid, ThreepidSource } from "@dewo/api/models/Threepid";
import { User } from "@dewo/api/models/User";
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { ethers } from "ethers";
import { GQLContext } from "../app/graphql.config";
import { CreateHiroThreepidInput } from "./dto/CreateHiroThreepidInput";
import { CreateMetamaskThreepidInput } from "./dto/CreateMetamaskThreepidInput";
import { ThreepidService } from "./threepid.service";

@Resolver(() => Threepid)
@Injectable()
export class ThreepidResolver {
  constructor(private readonly threepidService: ThreepidService) {}

  @ResolveField(() => String)
  public id(
    @Context("user") user: User | undefined,
    @Parent() threepid: Threepid
  ): string {
    if (!!threepid.userId && threepid.userId !== user?.id) {
      throw new ForbiddenException();
    }
    return threepid.id;
  }

  @Mutation(() => Threepid)
  public async createMetamaskThreepid(
    @Context() context: GQLContext,
    @Args("input") input: CreateMetamaskThreepidInput
  ) {
    const address = ethers.utils.verifyMessage(input.message, input.signature);
    if (address.toLowerCase() !== input.address.toLowerCase()) {
      throw new BadRequestException("Signature does not match address");
    }

    const threepid = await this.threepidService.findOrCreate({
      source: ThreepidSource.metamask,
      threepid: address,
      config: { signature: input.signature, message: input.message },
    });

    if (threepid.userId) {
      context.user = await threepid.user;
    }
    return threepid;
  }

  @Mutation(() => Threepid)
  public async createHiroThreepid(
    @Context() context: GQLContext,
    @Args("input") input: CreateHiroThreepidInput
  ) {
    const threepid = await this.threepidService.findOrCreate({
      source: ThreepidSource.hiro,
      threepid: input.mainnetAddress,
      config: input,
    });

    if (threepid.userId) {
      context.user = await threepid.user;
    }

    return threepid;
  }
}
