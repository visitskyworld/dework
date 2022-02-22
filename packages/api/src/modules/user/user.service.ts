import {
  HiroThreepidConfig,
  Threepid,
  ThreepidSource,
} from "@dewo/api/models/Threepid";
import { User } from "@dewo/api/models/User";
import { EntityDetail, EntityDetailType } from "@dewo/api/models/EntityDetail";
import { AtLeast, DeepAtLeast } from "@dewo/api/types/general";
import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Raw, Repository } from "typeorm";
import { ThreepidService } from "../threepid/threepid.service";
import { SetUserDetailInput } from "./dto/SetUserDetailInput";
import { PaymentService } from "../payment/payment.service";
import { PaymentNetworkType } from "@dewo/api/models/PaymentNetwork";
import { PaymentMethodType } from "@dewo/api/models/PaymentMethod";
import { UserOnboarding } from "@dewo/api/models/UserOnboarding";

@Injectable()
export class UserService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserOnboarding)
    private readonly userOnboardingRepo: Repository<UserOnboarding>,
    @InjectRepository(EntityDetail)
    private readonly entityDetailRepo: Repository<EntityDetail>,
    private readonly threepidService: ThreepidService,
    private readonly paymentService: PaymentService,
    private readonly jwtService: JwtService
  ) {}

  public async authWithThreepid(
    threepidId: string,
    existingUser?: User | undefined
  ): Promise<User> {
    const threepid = await this.threepidService.findById(threepidId);
    if (!threepid) throw new NotFoundException();
    if (!!threepid.userId) {
      if (!!existingUser) {
        if (threepid.userId !== existingUser.id) {
          throw new ForbiddenException("Account already connected");
        } else {
          return existingUser;
        }
      }

      return this.userRepo.findOne(threepid.userId) as Promise<User>;
    }

    const user = await this.userRepo.save({
      imageUrl: this.threepidService.getImageUrl(threepid),
      threepids: existingUser?.threepids ?? Promise.resolve([]),
      username: await this.generateUsername(
        this.threepidService.getUsername(threepid)
      ),
      ...existingUser,
    });

    await this.connectThreepidToUser(threepid, user);
    await this.autoPopulateDetails(user.id, threepid);
    await this.setUsernameAndAvatar(user, threepid);
    return this.userRepo.findOne(user.id) as Promise<User>;
  }

  private async connectThreepidToUser(
    threepid: Threepid,
    user: User
  ): Promise<void> {
    if (!!threepid.userId) throw new ForbiddenException();

    const threepids = await user.threepids;
    if (threepids.some((t) => t.source === threepid.source)) {
      throw new ForbiddenException(
        `You're already connected to "${threepid.source}"`
      );
    }
    await this.threepidService.update({ ...threepid, userId: user.id });
    threepids.push(threepid);

    if (threepid.source === ThreepidSource.metamask) {
      this.logger.debug(
        `Creating Metamask payment method from threepid: ${JSON.stringify({
          threepidId: threepid.id,
          userId: user.id,
        })}`
      );

      const networks = await this.paymentService.getPaymentNetworks({
        type: PaymentNetworkType.ETHEREUM,
      });

      await this.paymentService.batchCreatePaymentMethods(
        networks.map((network) => ({
          address: threepid.threepid,
          type: PaymentMethodType.METAMASK,
          networks: [network],
          userId: user.id,
          creatorId: user.id,
        }))
      );
    }

    if (threepid.source === ThreepidSource.hiro) {
      this.logger.debug(
        `Creating Hiro payment method from threepid: ${JSON.stringify({
          threepidId: threepid.id,
          userId: user.id,
        })}`
      );

      const networks = await this.paymentService.getPaymentNetworks({
        type: PaymentNetworkType.STACKS,
      });

      const config = threepid.config as HiroThreepidConfig;
      await this.paymentService.batchCreatePaymentMethods(
        networks.map((network) => ({
          address:
            network.slug === "stacks-mainnet"
              ? config.mainnetAddress
              : config.testnetAddress,
          type: PaymentMethodType.HIRO,
          networks: [network],
          userId: user.id,
          creatorId: user.id,
        }))
      );
    }
  }

  public async setDetail(
    partial: SetUserDetailInput,
    userId: string
  ): Promise<void> {
    if (!partial.value) {
      await this.entityDetailRepo.delete({ type: partial.type, userId });
      return;
    }

    const existing = await this.entityDetailRepo.findOne({
      userId,
      type: partial.type,
    });

    await this.entityDetailRepo.save({
      ...existing,
      userId,
      type: partial.type,
      value: partial.value,
    });
  }

  public async autoPopulateDetails(
    userId: string,
    threepid: Threepid
  ): Promise<void> {
    const location = this.threepidService.getLocation(threepid);
    if (location) {
      await this.setDetail(
        { type: EntityDetailType.location, value: location },
        userId
      );
    }

    if (threepid.source === ThreepidSource.discord) {
      const discordUsername = this.threepidService.getProfileDetail(
        threepid as Threepid<ThreepidSource.discord>
      );
      await this.setDetail(
        {
          type: EntityDetailType.discord,
          value: discordUsername,
        },
        userId
      );
    } else if (threepid.source === ThreepidSource.github) {
      const githubProfileUrl = this.threepidService.getProfileDetail(
        threepid as Threepid<ThreepidSource.github>
      );
      await this.setDetail(
        {
          type: EntityDetailType.github,
          value: githubProfileUrl,
        },
        userId
      );
    }
  }

  public async setUsernameAndAvatar(
    user: User,
    threepid: Threepid
  ): Promise<void> {
    if (
      ![ThreepidSource.discord, ThreepidSource.github].includes(threepid.source)
    )
      return;

    if (user.username.startsWith("deworker")) {
      const betterUsername = this.threepidService.getUsername(threepid);
      await this.userRepo.update(user.id, { username: betterUsername });
    }
    if (!user.imageUrl) {
      const avatarUrl = this.threepidService.getImageUrl(threepid);
      await this.userRepo.update(user.id, { imageUrl: avatarUrl });
    }
  }

  public createAuthToken(user: User): string {
    return this.jwtService.sign({ userId: user.id });
  }

  public async update(partial: DeepAtLeast<User, "id">): Promise<User> {
    const updated = await this.userRepo.save(partial);
    return this.userRepo.findOne(updated.id) as Promise<User>;
  }

  public async updateOnboarding(
    partial: AtLeast<UserOnboarding, "userId">
  ): Promise<UserOnboarding> {
    const onboarding = await this.userOnboardingRepo.findOne({
      userId: partial.userId,
    });
    const updated = await this.userOnboardingRepo.save({
      ...onboarding,
      ...partial,
    });
    return this.userOnboardingRepo.findOne(
      updated.id
    ) as Promise<UserOnboarding>;
  }

  public findById(id: string): Promise<User | undefined> {
    return this.userRepo.findOne(id);
  }

  public async generateUsername(threepidUsername: string): Promise<string> {
    const usersMatchingUsername = await this.userRepo.find({
      where: {
        username: Raw((alias) => `${alias} ~ '^${threepidUsername}(\\d+|$)'`),
      },
    });

    if (!usersMatchingUsername.length) return threepidUsername;
    const matchingUsernames = usersMatchingUsername.map((u) => u.username);
    const set = new Set(matchingUsernames);
    for (let i = 1; i < matchingUsernames.length + 1; i++) {
      const candidate = `${threepidUsername}${i}`;
      if (!set.has(candidate)) return candidate;
    }
    throw new Error("Could not generate username");
  }
}
