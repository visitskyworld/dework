import { Project } from "@dewo/api/models/Project";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

@Injectable()
export class ProjectService {
  // private readonly logger = new Logger("UserService");

  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>
  ) {}

  public async create(partial: DeepPartial<Project>): Promise<Project> {
    const created = await this.projectRepo.save(partial);
    return this.projectRepo.findOne(created.id) as Promise<Project>;
  }
}
