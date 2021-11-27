import { Injectable, Module } from "@nestjs/common";
import { TypeOrmModule, InjectConnection } from "@nestjs/typeorm";
import { Threepid, ThreepidSource } from "../models/Threepid";
import { User } from "../models/User";
import { AuthModule } from "../modules/auth/auth.module";
import { ThreepidService } from "../modules/auth/threepid.service";
import { UserModule } from "../modules/user/user.module";
import { UserService } from "../modules/user/user.service";
import faker from "faker";
import { Connection } from "typeorm";

@Injectable()
export class Fixtures {
  constructor(
    private readonly userService: UserService,
    private readonly threepidService: ThreepidService
  ) {}

  public async createThreepid(
    partial: Partial<Threepid> = {}
  ): Promise<Threepid> {
    return this.threepidService.create({
      source: ThreepidSource.discord,
      threepid: faker.datatype.uuid(),
      config: {} as any,
      ...partial,
    });
  }

  public createAuthToken(user: User): string {
    return this.userService.createAuthToken(user);
  }
}

@Injectable()
export class DatabaseService {
  constructor(@InjectConnection() public readonly connection: Connection) {}
}
@Module({
  imports: [TypeOrmModule.forFeature([Threepid]), AuthModule, UserModule],
  providers: [Fixtures, DatabaseService],
})
export class FixturesModule {}
