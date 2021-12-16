import { Threepid } from "@dewo/api/models/Threepid";
import { User } from "@dewo/api/models/User";
import { UserDetail } from "@dewo/api/models/UserDetail";
import { DeepAtLeast } from "@dewo/api/types/general";
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Raw, Repository } from "typeorm";
import { ThreepidService } from "../threepid/threepid.service";

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
    partial: DeepAtLeast<
      Omit<UserDetail, "value"> & {
        value: string | null;
      },
      "type" | "userId"
    >
  ): Promise<User> {
    const userId = partial.userId;
    const existing = await this.userDetailRepo.findOne({
      where: { type: partial.type },
      relations: ["user"],
    });

    const isDeleteDetail = partial.value == null;
    if (isDeleteDetail) {
      if (existing == null) {
        throw new NotFoundException(
          "Tried to remove a userDetail that does not exist"
        );
      }

      await this.userDetailRepo.delete({ type: partial.type });
      const user = await this.findById(userId);
      if (user == null) {
        throw new NotFoundException(
          "Tried to remove a userDetail but could not find user"
        );
      }
      return user;
    }

    console.log("UPDARIONG TO", {
      ...existing,
      ...(partial as UserDetail),
    });
    await this.userDetailRepo.save({
      ...existing,
      ...(partial as UserDetail),
    });
    return this.findById(userId) as Promise<User>;
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
