import { Skill } from "@dewo/api/models/Skill";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SkillResolver } from "./skill.resolver";
import { SkillService } from "./skill.service";

@Module({
  imports: [TypeOrmModule.forFeature([Skill, User])],
  providers: [SkillService, SkillResolver],
})
export class SkillModule {}
