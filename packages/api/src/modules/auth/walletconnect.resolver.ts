import { Args, Mutation, Resolver } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";
import NodeWalletConnect from "@walletconnect/node";
import { BadRequestException, Logger, NotFoundException } from "@nestjs/common";
import { ThreepidService } from "../threepid/threepid.service";
import { Threepid, ThreepidSource } from "@dewo/api/models/Threepid";
import { Interval } from "@nestjs/schedule";

interface WalletConnectSession {
  connector: NodeWalletConnect;
  expiresAt: Date;
}

@Resolver()
export class WalletConnectResolver {
  private sessionById: Record<string, WalletConnectSession> = {};
  private logger = new Logger(this.constructor.name);

  constructor(private readonly threepidService: ThreepidService) {}

  @Mutation(() => String)
  public async startWalletConnectSession(
    @Args("sessionId", { type: () => GraphQLUUID }) sessionId: string
  ): Promise<string> {
    if (sessionId in this.sessionById) {
      throw new BadRequestException();
    }

    const connector = new NodeWalletConnect(
      {
        bridge: "https://bridge.walletconnect.org",
      },
      {
        clientMeta: {
          description: "The task manager for DAOs and decentralized work",
          url: "https://dework.xyz",
          icons: ["https://dework.xyz/logo.svg"],
          name: "Dework",
        },
      }
    );

    await connector.createSession();

    this.sessionById[sessionId] = {
      connector,
      expiresAt: new Date(Date.now() + 60 * 1000),
    };
    return connector.uri;
  }

  @Mutation(() => Threepid, { nullable: true })
  public async checkWalletConnectSession(
    @Args("sessionId", { type: () => GraphQLUUID }) sessionId: string
  ): Promise<Threepid | undefined> {
    if (!(sessionId in this.sessionById)) {
      throw new NotFoundException();
    }

    const session = this.sessionById[sessionId];
    if (!session.connector.connected) return undefined;

    const address = session.connector.accounts[0];
    const threepid = await this.threepidService.findOrCreate({
      source: ThreepidSource.metamask,
      threepid: address,
      config: { message: "WalletConnect", signature: sessionId },
    });

    this.deleteSession(sessionId);

    return threepid;
  }

  @Interval(10000)
  async cron() {
    for (const sessionId of Object.keys(this.sessionById)) {
      const session = this.sessionById[sessionId];
      if (session.expiresAt < new Date()) {
        this.deleteSession(sessionId);
      }
    }
  }

  private deleteSession(sessionId: string) {
    const session = this.sessionById[sessionId];
    if (!session) return;

    this.logger.debug(
      `Deleting session (${JSON.stringify({
        sessionId,
        expiresAt: session.expiresAt,
      })})`
    );
    session.connector.transportClose();
    delete this.sessionById[sessionId];
  }
}
