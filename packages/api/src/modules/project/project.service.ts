import { Project } from "@dewo/api/models/Project";
import { ProjectMember, ProjectRole } from "@dewo/api/models/ProjectMember";
import { ProjectTokenGate } from "@dewo/api/models/ProjectTokenGate";
import { TaskTag } from "@dewo/api/models/TaskTag";
import { User } from "@dewo/api/models/User";
import { AtLeast, DeepAtLeast } from "@dewo/api/types/general";
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { TokenService } from "../payment/token.service";
import { UserService } from "../user/user.service";
import { ProjectTokenGateInput } from "./dto/ProjectTokenGateInput";
import { UpdateProjectMemberInput } from "./dto/UpdateProjectMemberInput";

@Injectable()
export class ProjectService {
  // private readonly logger = new Logger("UserService");

  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly projectMemberRepo: Repository<ProjectMember>,
    @InjectRepository(ProjectTokenGate)
    private readonly projectTokenGateRepo: Repository<ProjectTokenGate>,
    @InjectRepository(TaskTag)
    private readonly taskTagRepo: Repository<TaskTag>,
    private readonly tokenService: TokenService,
    private readonly userService: UserService
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
    partial: AtLeast<TaskTag, "projectId" | "label" | "color">
  ): Promise<TaskTag> {
    const created = await this.taskTagRepo.save(partial);
    return this.taskTagRepo.findOne(created.id) as Promise<TaskTag>;
  }

  public async createGate(
    input: ProjectTokenGateInput
  ): Promise<ProjectTokenGate> {
    const created = await this.projectTokenGateRepo.save(input);
    return this.projectTokenGateRepo.findOne(
      created.id
    ) as Promise<ProjectTokenGate>;
  }

  public async deleteGate(input: ProjectTokenGateInput): Promise<void> {
    await this.projectTokenGateRepo.delete(input);
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
      const project = await this.findById(data.projectId);
      const user = await this.userService.findById(data.userId);
      if (!project || !user) throw new BadRequestException();
      await this.assertUserPassesTokenGates(project, user);

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

  private async assertUserPassesTokenGates(
    project: Project,
    user: User
  ): Promise<void> {
    const gates = await project.tokenGates;
    if (!gates.length) return;
    const tokens = await Promise.all(gates.map((g) => g.token));

    const balances = await Promise.all(
      tokens.map((t) => this.tokenService.balanceOf(t, user))
    );

    const hasAnyBalance = balances.some((b) => b.gt(0));
    if (!hasAnyBalance) {
      throw new ForbiddenException({
        reason: "MISSING_TOKENS",
        tokenIds: tokens.map((t) => t.id),
      });
    }
  }
}
