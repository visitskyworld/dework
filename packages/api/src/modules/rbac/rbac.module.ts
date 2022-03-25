import { Role } from "@dewo/api/models/rbac/Role";
import { Rule } from "@dewo/api/models/rbac/Rule";
import { UserRole } from "@dewo/api/models/rbac/UserRole";
import { Task } from "@dewo/api/models/Task";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RbacResolver } from "./rbac.resolver";
import { RbacService } from "./rbac.service";

@Module({
  imports: [TypeOrmModule.forFeature([Role, Rule, User, UserRole, Task])],
  providers: [RbacService, RbacResolver],
  exports: [RbacService],
})
export class RbacModule {}
