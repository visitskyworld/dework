import { Project } from "@dewo/api/models/Project";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { TaskTag } from "@dewo/api/models/TaskTag";
import { AtLeast, DeepAtLeast } from "@dewo/api/types/general";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

@Injectable()
export class ProjectService {
  // private readonly logger = new Logger("UserService");

  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectIntegration)
    private readonly projectIntegrationRepo: Repository<ProjectIntegration>,
    @InjectRepository(TaskTag)
    private readonly taskTagRepo: Repository<TaskTag>
  ) {}

  public async create(partial: DeepPartial<Project>): Promise<Project> {
    const created = await this.projectRepo.save(partial);
    return this.projectRepo.findOne(created.id) as Promise<Project>;
  }

  public async update(partial: DeepAtLeast<Project, "id">): Promise<Project> {
    const updated = await this.projectRepo.save(partial);
    return this.projectRepo.findOne(updated.id) as Promise<Project>;
  }

  public async createIntegration(
    partial: Partial<ProjectIntegration>
  ): Promise<ProjectIntegration> {
    const created = await this.projectIntegrationRepo.save(partial);
    return this.projectIntegrationRepo.findOne(
      created.id
    ) as Promise<ProjectIntegration>;
  }

  public async createTag(
    partial: AtLeast<TaskTag, "projectId">
  ): Promise<TaskTag> {
    const created = await this.taskTagRepo.save(partial);
    return this.taskTagRepo.findOne(created.id) as Promise<TaskTag>;
  }

  public findById(id: string): Promise<Project | undefined> {
    return this.projectRepo.findOne(id);
  }

  public findGithubIntegration(
    installationId: string
  ): Promise<ProjectIntegration | undefined> {
    return this.projectIntegrationRepo.findOne({ config: { installationId } });
  }
}
