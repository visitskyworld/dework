import { FundingSession } from "@dewo/api/models/funding/FundingSession";
import { FundingVote } from "@dewo/api/models/funding/FundingVote";
import { User } from "@dewo/api/models/User";
import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";
import { AuthGuard } from "../auth/guards/auth.guard";
import { PermalinkService } from "../permalink/permalink.service";
import { RoleGuard } from "../rbac/rbac.guard";
import { CreateFundingSessionInput } from "./dto/CreateFundingSessionInput";
import { FundingVoteInput } from "./dto/FundingVoteInput";
import { FundingService } from "./funding.service";

@Resolver(() => FundingSession)
@Injectable()
export class FundingResolver {
  constructor(
    private readonly service: FundingService,
    private readonly permalinkService: PermalinkService
  ) {}

  @ResolveField(() => [User])
  public async voters(@Parent() session: FundingSession): Promise<User[]> {
    return this.service.getVoters(session.id);
  }

  @ResolveField(() => String)
  public permalink(
    @Context("origin") origin: string,
    @Parent() session: FundingSession
  ): Promise<string> {
    return this.permalinkService.get(session, origin);
  }

  @Query(() => FundingSession)
  public async getFundingSession(
    @Args("id", { type: () => GraphQLUUID }) id: string
  ): Promise<FundingSession | undefined> {
    const session = await this.service.findById(id);
    if (!session) throw new NotFoundException();
    return session;
  }

  @Mutation(() => FundingSession)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "create",
      subject: FundingSession,
      getSubject: (params: { input: CreateFundingSessionInput }) =>
        Object.assign(new FundingSession(), params.input),
      getOrganizationId: (_, params: { input: CreateFundingSessionInput }) =>
        params.input.organizationId,
    })
  )
  public async createFundingSession(
    @Args("input") input: CreateFundingSessionInput
  ) {
    return this.service.createSession(input);
  }

  @Mutation(() => FundingVote)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "create",
      subject: FundingVote,
      inject: [FundingService],
      getSubject: async (params: { input: FundingVoteInput; user: User }) =>
        Object.assign(new FundingVote(), params.input, {
          userId: params.user.id,
        }),
      getOrganizationId: async (_subject, params, service) => {
        const session = await service.findById(params.input.sessionId);
        return session?.organizationId;
      },
    })
  )
  public async setFundingVote(
    @Args("input") input: FundingVoteInput,
    @Context("user") user: User
  ) {
    return this.service.vote({ ...input, userId: user.id });
  }

  @Mutation(() => FundingSession)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "update",
      subject: FundingSession,
      inject: [FundingService],
      getSubject: (params: { id: string }, service: FundingService) =>
        service.findById(params.id),
      getOrganizationId: (subject) => subject.organizationId,
    })
  )
  public async closeFundingSession(
    @Args("id", { type: () => GraphQLUUID }) id: string
  ) {
    return this.service.completeSession(id);
  }
}
