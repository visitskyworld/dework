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
import { CreatePhantomThreepidInput } from "./dto/CreatePhantomThreepidInput";
import { ThreepidService } from "./threepid.service";
import { sign } from "tweetnacl";
import bs58 from "bs58";

const verifySolanaMessage = (
  message: string,
  signature: Uint8Array,
  publicKey: string
) => {
  const publicKeyBuffer = bs58.decode(publicKey);
  const messageBuffer = Buffer.from(message, "utf8");
  const verified = sign.detached.verify(
    messageBuffer,
    signature,
    publicKeyBuffer
  );
  return verified;
};

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
  public async createPhantomThreepid(
    @Context() context: GQLContext,
    @Args("input") input: CreatePhantomThreepidInput
  ) {
    const signature = new Uint8Array(input.signature);
    const a = verifySolanaMessage(input.message, signature, input.address);
    if (!a) {
      throw new BadRequestException("Signature does not match address");
    }

    const threepid = await this.threepidService.findOrCreate({
      source: ThreepidSource.phantom,
      threepid: input.address,
      config: {
        signature: bs58.encode(signature),
        message: input.message,
      },
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
