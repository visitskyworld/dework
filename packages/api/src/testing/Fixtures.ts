import { Injectable, Module } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { Threepid, ThreepidSource } from "../models/Threepid";
import { User } from "../models/User";
import { UserModule } from "../modules/user/user.module";
import { UserService } from "../modules/user/user.service";
import faker from "faker";
import { Connection } from "typeorm";
import { ThreepidService } from "../modules/threepid/threepid.service";
import { ThreepidModule } from "../modules/threepid/threepid.module";

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
      config: { profile: { avatar: faker.internet.avatar() } } as any,
      ...partial,
    });
  }

  public async createUser(): Promise<User> {
    const threepid = await this.createThreepid();
    return this.userService.createFromThreepid(threepid.id);
  }

  public createAuthToken(user: User): string {
    return this.userService.createAuthToken(user);
  }
}

@Module({
  imports: [ThreepidModule, UserModule],
  providers: [Fixtures],
})
export class FixturesModule {}
