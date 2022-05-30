import { Invite } from "@dewo/api/models/Invite";
import { Project } from "@dewo/api/models/Project";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermalinkModule } from "../permalink/permalink.module";
import { RbacModule } from "../rbac/rbac.module";
import { TaskModule } from "../task/task.module";
import { InviteResolver } from "./invite.resolver";
import { InviteService } from "./invite.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Invite, Project]),
    PermalinkModule,
    RbacModule,
    TaskModule,
    CqrsModule,
  ],
  providers: [InviteResolver, InviteService],
  exports: [InviteService],
})
export class InviteModule {}
