import { Role } from "@dewo/api/models/rbac/Role";
import { Rule } from "@dewo/api/models/rbac/Rule";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RbacResolver } from "./rbac.resolver";
import { RbacService } from "./rbac.service";

@Module({
  imports: [TypeOrmModule.forFeature([Role, Rule])],
  providers: [RbacService, RbacResolver],
  exports: [RbacService],
})
export class RbacModule {}
