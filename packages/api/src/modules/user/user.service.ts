import { Threepid } from "@dewo/api/models/Threepid";
import { User } from "@dewo/api/models/User";
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ThreepidService } from "../threepid/threepid.service";

@Injectable()
export class UserService {
  // private readonly logger = new Logger("UserService");

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly threepidService: ThreepidService,
    private readonly jwtService: JwtService
  ) {}

  public async authWithThreepid(threepidId: string): Promise<User> {
    const threepid = await this.threepidService.findById(threepidId);
    if (!threepid) throw new NotFoundException();
    if (!!threepid.userId) {
      return this.userRepo.findOne(threepid.userId) as Promise<User>;
    }

    const user = await this.userRepo.save({
      imageUrl: this.threepidService.getImageUrl(threepid),
      threepids: Promise.resolve([]),
    });
    await this.connectThreepidToUser(threepid, user);
    return user;
  }

  public async connectThreepidToUser(
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

  public createAuthToken(user: User): string {
    return this.jwtService.sign({ userId: user.id });
  }
}
