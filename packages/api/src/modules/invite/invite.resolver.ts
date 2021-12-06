import { Args, Context, Mutation } from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { User } from "@dewo/api/models/User";
import { AuthGuard } from "../auth/guards/auth.guard";
import GraphQLUUID from "graphql-type-uuid";
import { InviteService } from "./invite.service";
import { Invite } from "@dewo/api/models/Invite";
import { CreateInviteInput } from "./dto/CreateInviteInput";

@Injectable()
export class InviteResolver {
  constructor(private readonly inviteService: InviteService) {}

  @Mutation(() => Invite)
  @UseGuards(AuthGuard)
  public async createInvite(
    @Context("user") user: User,
    @Args("input") input: CreateInviteInput
  ): Promise<Invite> {
    return this.inviteService.create(input, user);
  }

  @Mutation(() => Invite)
  @UseGuards(AuthGuard)
  public async acceptInvite(
    @Context("user") user: User,
    @Args("id", { type: () => GraphQLUUID }) inviteId: string
  ): Promise<Invite> {
    return this.inviteService.accept(inviteId, user);
  }
}
