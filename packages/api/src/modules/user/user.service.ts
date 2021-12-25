import { GithubThreepidConfig, Threepid } from "@dewo/api/models/Threepid";
import { User } from "@dewo/api/models/User";
import { UserDetail, UserDetailType } from "@dewo/api/models/UserDetail";
import { DeepAtLeast } from "@dewo/api/types/general";
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Raw, Repository } from "typeorm";
import { ThreepidService } from "../threepid/threepid.service";
import { SetUserDetailInput } from "./dto/SetUserDetail";

@Injectable()
export class UserService {
  // private readonly logger = new Logger("UserService");

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserDetail)
    private readonly userDetailRepo: Repository<UserDetail>,
    private readonly threepidService: ThreepidService,
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
  }

  public async setDetail(
    partial: SetUserDetailInput,
    userId: string
  ): Promise<void> {
    if (!partial.value) {
      await this.userDetailRepo.delete({ type: partial.type, userId });
      return;
    }

    const existing = await this.userDetailRepo.findOne({
      userId,
      type: partial.type,
    });

    await this.userDetailRepo.save({
      ...existing,
      userId,
      type: partial.type,
      value: partial.value,
    });
  }

  public async autoPopulateDetails(
    userId: string,
    threePid: Threepid
  ): Promise<void> {
    const location = this.threepidService.getLocation(threePid);
    if (location) {
      await this.setDetail(
        { type: UserDetailType.location, value: location },
        userId
      );
    }
    if (threePid.source === "github") {
      const githubProfileUrl = (threePid.config as GithubThreepidConfig).profile
        .profileUrl;
      await this.setDetail(
        { type: UserDetailType.github, value: githubProfileUrl },
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
