import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { Skill } from "@dewo/api/models/Skill";
import { User } from "@dewo/api/models/User";
import { AtLeast } from "@dewo/api/types/general";
import { SkillStatistic } from "./dto/SkillStatistic";
import _ from "lodash";

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private readonly repo: Repository<Skill>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  create(partial: AtLeast<Skill, "name" | "emoji">): Promise<Skill> {
    return this.repo.save({
      ...partial,
      sortKey: Date.now().toString(),
    });
  }

  findTopLevelSkills(): Promise<Skill[]> {
    return this.repo.find({ parentId: IsNull() });
  }

  async setUserSkills(userId: string, skillIds: string[]): Promise<User> {
    const currentSkills = await this.userRepo
      .createQueryBuilder()
      .relation("skills")
      .of(userId)
      .loadMany();

    const addSkillIds = skillIds.filter(
      (id) => !currentSkills.find((skill) => skill.id === id)
    );
    const removeSkillIds = currentSkills.filter(
      (skill) => !skillIds.find((id) => skill.id === id)
    );

    await Promise.all([
      this.userRepo
        .createQueryBuilder()
        .relation("skills")
        .of(userId)
        .add(addSkillIds),
      this.userRepo
        .createQueryBuilder()
        .relation("skills")
        .of(userId)
        .remove(removeSkillIds),
    ]);

    return this.userRepo.findOneOrFail(userId);
  }

  async getSkillStatistics(workspaceId: string): Promise<SkillStatistic[]> {
    const { entities, raw } = await this.repo
      .createQueryBuilder("skill")
      .addSelect("COUNT(DISTINCT task.id)", "count")
      .innerJoin("skill.tasks", "task")
      .innerJoin("task.project", "project")
      .innerJoin("project.workspace", "workspace")
      .where("workspace.id = :workspaceId", { workspaceId })
      .groupBy("skill.id")
      .getRawAndEntities();

    const stats = entities.map((skill) => ({
      skill,
      count: Number(raw.find((raw) => raw.skill_id === skill.id).count),
    }));
    return _.sortBy(stats, (s) => -s.count);
  }
}
