import { Threepid, ThreepidSource } from "@dewo/api/models/Threepid";
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
import { Not, Raw, Repository } from "typeorm";
import { ThreepidService } from "../threepid/threepid.service";
import { SetUserDetailInput } from "./dto/SetUserDetailInput";
import { UserOnboarding } from "@dewo/api/models/UserOnboarding";
import { DiscordRolesService } from "../integrations/discord/roles/discord.roles.service";
import { FileUploadService } from "../fileUpload/fileUpload.service";

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
    private readonly discordRolesService: DiscordRolesService,
    private readonly jwtService: JwtService,
    private readonly fileUploadService: FileUploadService
  ) {}

  public async authWithThreepid(
    threepidId: string,
    existingUser?: User | undefined
  ): Promise<User> {
    const threepid = await this.threepidService.findById(threepidId);
    if (!threepid) throw new NotFoundException();
    if (!!threepid.userId) {
      if (!existingUser) {
        return this.userRepo.findOne(threepid.userId) as Promise<User>;
      } else if (threepid.userId === existingUser.id) {
        return existingUser;
      } else {
        this.logger.warn(
          `Authing with threepid already connected to other account: ${JSON.stringify(
            { threepid, existingUser }
          )}`
        );
      }
    }

    const threepidImage = await this.threepidService.getImageUrl(threepid);
    const user = await this.userRepo.save({
      ...existingUser,
      threepids: existingUser?.threepids ?? Promise.resolve([]),
      imageUrl:
        existingUser?.imageUrl ??
        (threepidImage && process.env.NODE_ENV !== "test"
          ? await this.fileUploadService.uploadFileFromUrl(threepidImage)
          : undefined),
      username:
        existingUser?.username.startsWith("deworker") === false
          ? existingUser.username
          : await this.generateUsername(
              await this.threepidService.getUsername(threepid)
            ),
    });

    await this.connectThreepidToUser(threepid, user);
    await this.autoPopulateDetails(user.id, threepid);
    return this.userRepo.findOne(user.id) as Promise<User>;
  }

  private async connectThreepidToUser(
    threepid: Threepid,
    user: User
  ): Promise<void> {
    const threepids = await user.threepids;
    if (threepids.some((t) => t.source === threepid.source)) {
      throw new ForbiddenException(
        `You're already connected to "${threepid.source}"`
      );
    }
    await this.threepidService.update({ ...threepid, userId: user.id });
    threepids.push(threepid);

    if (threepid.source === ThreepidSource.discord) {
      await this.discordRolesService.syncUserRoles(user);
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

  private async autoPopulateDetails(
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

  public createAuthToken(user: User): string {
    return this.jwtService.sign({ userId: user.id });
  }

  public async update(partial: DeepAtLeast<User, "id">): Promise<User> {
    const updated = await this.userRepo.save(partial);
    return this.userRepo.findOne(updated.id) as Promise<User>;
  }

  public async updateOnboarding(
    partial: AtLeast<UserOnboarding, "userId" | "type">
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

  public findByUsername(username: string): Promise<User | undefined> {
    return this.userRepo.findOne({ where: { username } });
  }

  public async generateUsername(
    threepidUsername: string,
    id?: string
  ): Promise<string> {
    const usersMatchingUsername = await this.userRepo.find({
      where: {
        ...(id ? { id: Not(id) } : {}),
        username: Raw((alias) => `${alias} ~ '^${threepidUsername}(\\d+)?$'`),
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
