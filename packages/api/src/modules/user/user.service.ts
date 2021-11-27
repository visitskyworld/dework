import { User } from "@dewo/api/models/User";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  // private readonly logger = new Logger("UserService");

  constructor(
    // @InjectRepository(User)
    // private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService
  ) {}
  public createAuthToken(user: User): string {
    return this.jwtService.sign({ userId: user.id });
  }
}
