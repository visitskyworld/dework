import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Skill } from "@dewo/api/models/Skill";
import { User } from "@dewo/api/models/User";

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private readonly repo: Repository<Skill>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  findAll(): Promise<Skill[]> {
    return this.repo.find();
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
}
