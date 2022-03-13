import { Role } from "@dewo/api/models/rbac/Role";
import { Rule } from "@dewo/api/models/rbac/Rule";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RbacService } from "./rbac.service";

@Module({
  imports: [TypeOrmModule.forFeature([Role, Rule])],
  providers: [RbacService],
  exports: [RbacService],
})
export class RbacModule {}
