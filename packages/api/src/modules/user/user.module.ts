import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskModule } from "../task/task.module";
import { ThreepidModule } from "../threepid/threepid.module";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([User]), ThreepidModule, TaskModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
