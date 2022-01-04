import { Project } from "@dewo/api/models/Project";
import { ProjectMember, ProjectRole } from "@dewo/api/models/ProjectMember";
import { TaskTag } from "@dewo/api/models/TaskTag";
import { User } from "@dewo/api/models/User";
import { AtLeast, DeepAtLeast } from "@dewo/api/types/general";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { UpdateProjectMemberInput } from "./dto/UpdateProjectMemberInput";

@Injectable()
export class ProjectService {
  // private readonly logger = new Logger("UserService");

  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly projectMemberRepo: Repository<ProjectMember>,
    @InjectRepository(TaskTag)
    private readonly taskTagRepo: Repository<TaskTag>
  ) {}

  public async create(
    partial: DeepPartial<Project>,
    creator: User
  ): Promise<Project> {
    const created = await this.projectRepo.save(partial);
    await this.upsertMember({
      projectId: created.id,
      userId: creator.id,
      role: ProjectRole.ADMIN,
    });
    return this.projectRepo.findOne(created.id) as Promise<Project>;
  }

  public async update(partial: DeepAtLeast<Project, "id">): Promise<Project> {
    const current = await this.projectRepo.findOne(partial.id);
    if (!current) throw new NotFoundException();
    const updated = await this.projectRepo.save({
      ...current,
      ...partial,
      options: { ...current.options, ...partial.options },
    });
    return this.projectRepo.findOne(updated.id) as Promise<Project>;
  }

  public async createTag(
    partial: AtLeast<TaskTag, "projectId">
  ): Promise<TaskTag> {
    const created = await this.taskTagRepo.save(partial);
    return this.taskTagRepo.findOne(created.id) as Promise<TaskTag>;
  }

  public async upsertMember(
    data: UpdateProjectMemberInput
  ): Promise<ProjectMember> {
    const member = await this.findMember({
      projectId: data.projectId,
      userId: data.userId,
    });
    if (!!member) {
      await this.projectMemberRepo.update({ id: member.id }, data);
      return this.projectMemberRepo.findOne({
        id: member.id,
      }) as Promise<ProjectMember>;
    } else {
      const created = await this.projectMemberRepo.save(data);
      return this.projectMemberRepo.findOne({
        id: created.id,
      }) as Promise<ProjectMember>;
    }
  }

  public async removeMember(projectId: string, userId: string): Promise<void> {
    await this.projectMemberRepo.delete({ userId, projectId });
  }

  public findMember(
    partial: Partial<Pick<ProjectMember, "projectId" | "userId" | "role">>
  ): Promise<ProjectMember | undefined> {
    return this.projectMemberRepo.findOne(partial);
  }

  public findById(id: string): Promise<Project | undefined> {
    return this.projectRepo.findOne(id);
  }
}
