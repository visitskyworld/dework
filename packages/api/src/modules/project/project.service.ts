import { Project } from "@dewo/api/models/Project";
import { ProjectMember } from "@dewo/api/models/ProjectMember";
import { ProjectRole } from "@dewo/api/models/enums/ProjectRole";
import { ProjectSection } from "@dewo/api/models/ProjectSection";
import { ProjectTokenGate } from "@dewo/api/models/ProjectTokenGate";
import { TaskTag } from "@dewo/api/models/TaskTag";
import { User } from "@dewo/api/models/User";
import { AtLeast, DeepAtLeast } from "@dewo/api/types/general";
import { slugBlacklist } from "@dewo/api/utils/slugBlacklist";
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import slugify from "slugify";
import { DeepPartial, In, IsNull, Raw, Repository } from "typeorm";
import { TokenService } from "../payment/token.service";
import { ProjectTokenGateInput } from "./dto/ProjectTokenGateInput";
import { TaskStatus } from "@dewo/api/models/Task";
import { TaskSection } from "@dewo/api/models/TaskSection";
import { TaskGatingDefault } from "@dewo/api/models/TaskGatingDefault";
import { TaskGatingDefaultInput } from "./dto/TaskGatingDefaultInput";

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly projectMemberRepo: Repository<ProjectMember>,
    @InjectRepository(ProjectTokenGate)
    private readonly projectTokenGateRepo: Repository<ProjectTokenGate>,
    @InjectRepository(TaskTag)
    private readonly taskTagRepo: Repository<TaskTag>,
    @InjectRepository(ProjectSection)
    private readonly projectSectionRepo: Repository<ProjectSection>,
    private readonly tokenService: TokenService,
    @InjectRepository(TaskSection)
    private readonly taskSectionRepo: Repository<TaskSection>,
    @InjectRepository(TaskGatingDefault)
    private readonly taskGatingDefaultRepo: Repository<TaskGatingDefault>
  ) {}

  public async create(partial: DeepPartial<Project>): Promise<Project> {
    const created = await this.projectRepo.save({
      ...partial,
      sortKey: Date.now().toString(),
      slug: await this.generateSlug(partial.name ?? "Project"),
    });
    // Create a "Backlog" section in the TODO list
    await this.createTaskSection({
      projectId: created.id,
      name: "Backlog",
      status: TaskStatus.TODO,
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

  public async updateTag(
    partial: AtLeast<TaskTag, "id" | "projectId">
  ): Promise<TaskTag> {
    await this.taskTagRepo.update(
      { id: partial.id, projectId: partial.projectId },
      partial
    );
    const found = await this.taskTagRepo.findOne({
      id: partial.id,
      projectId: partial.projectId,
    });
    if (!found) throw new NotFoundException();
    return found;
  }

  public async createTokenGate(
    input: ProjectTokenGateInput
  ): Promise<ProjectTokenGate> {
    const created = await this.projectTokenGateRepo.save(input);
    return this.projectTokenGateRepo.findOne(
      created.id
    ) as Promise<ProjectTokenGate>;
  }

  public async deleteTokenGate(input: ProjectTokenGateInput): Promise<void> {
    await this.projectTokenGateRepo.delete(input);
  }

  public async createTaskSection(
    partial: DeepPartial<TaskSection>
  ): Promise<TaskSection> {
    const created = await this.taskSectionRepo.save({
      ...partial,
      sortKey: Date.now().toString(),
    });
    return this.taskSectionRepo.findOne(created.id) as Promise<TaskSection>;
  }

  public async updateTaskSection(
    partial: DeepAtLeast<TaskSection, "id" | "projectId">
  ): Promise<TaskSection> {
    const query = { id: partial.id, projectId: partial.projectId };
    await this.taskSectionRepo.update(query, partial);
    return this.taskSectionRepo.findOne(query) as Promise<TaskSection>;
  }

  public async findSectionById(id: string): Promise<TaskSection | undefined> {
    return this.taskSectionRepo.findOne(id);
  }

  public async createSection(
    partial: DeepPartial<ProjectSection>
  ): Promise<ProjectSection> {
    const created = await this.projectSectionRepo.save({
      ...partial,
      sortKey: Date.now().toString(),
    });
    return this.projectSectionRepo.findOne(
      created.id
    ) as Promise<ProjectSection>;
  }

  public async updateSection(
    partial: DeepAtLeast<ProjectSection, "id" | "organizationId">
  ): Promise<ProjectSection> {
    const query = { id: partial.id, organizationId: partial.organizationId };
    await this.projectSectionRepo.update(query, partial);
    return this.projectSectionRepo.findOne(query) as Promise<ProjectSection>;
  }

  public async addMemberIfNotExists(projectId: string, userIds: string[]) {
    if (!userIds.length) return;

    const members = await this.projectMemberRepo.find({
      projectId,
      userId: In(userIds),
    });

    const nonmemberIds = userIds.filter(
      (id) => !members.some((m) => m.userId === id)
    );

    await this.projectMemberRepo.save(
      nonmemberIds.map((userId) => ({
        projectId,
        userId,
        role: ProjectRole.CONTRIBUTOR,
      }))
    );
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
    return this.projectRepo.findOne({ id, deletedAt: IsNull() });
  }

  public findBySlug(slug: string): Promise<Project | undefined> {
    return this.projectRepo.findOne({ slug });
  }

  public async findFeatured(): Promise<Project[]> {
    const projectsWithTaskCount = await this.projectRepo
      .createQueryBuilder("project")
      .innerJoinAndSelect("project.organization", "organization")
      .addSelect("COUNT(DISTINCT task.id)", "project_taskCount")
      .leftJoin("project.tasks", "task")
      .leftJoin("project.members", "member", "member.projectId = project.id")
      .andWhere("project.deletedAt IS NULL")
      .andWhere("organization.deletedAt IS NULL")
      .andWhere("LOWER(project.name) NOT LIKE '%test%'")
      .andWhere("LOWER(project.name) NOT LIKE '%demo%'")
      .andWhere("LOWER(organization.name) NOT LIKE '%test%'")
      .andWhere("LOWER(organization.name) NOT LIKE '%demo%'")
      .andWhere("LOWER(organization.name) NOT LIKE '%dework%'")
      .groupBy("project.id, organization.id")
      .having("COUNT(DISTINCT task.id) >= 10")
      .andHaving("COUNT(DISTINCT member.userId) > 1")
      .getRawMany();
    // TODO(fant): make sure this joins the right data
    const projects = await this.projectRepo
      .createQueryBuilder("project")
      .innerJoinAndSelect("project.organization", "organization")
      .innerJoinAndSelect("project.members", "member")
      .innerJoinAndSelect("member.user", "user")
      .where("project.id IN (:...projectIds)", {
        projectIds: projectsWithTaskCount.map((p) => p.project_id),
      })
      .getMany();
    projects.forEach(
      (project) =>
        (project.taskCount = projectsWithTaskCount.find(
          (p) => p.project_id === project.id
        )?.project_taskCount)
    );
    return projects;
  }

  public async assertUserPassesTokenGates(
    project: Project,
    user: User,
    role: ProjectRole
  ): Promise<void> {
    const gates = await project.tokenGates;
    const gatesWithRole = gates.filter((g) => g.role === role);
    if (!gatesWithRole.length) return;
    const tokens = await Promise.all(gatesWithRole.map((g) => g.token));

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

  public async setTaskGatingDefault(
    input: TaskGatingDefaultInput,
    userId: string
  ): Promise<void> {
    await this.taskGatingDefaultRepo.delete({
      userId,
      projectId: input.projectId,
    });

    if (!!input.type) {
      const created = await this.taskGatingDefaultRepo.save({
        userId,
        projectId: input.projectId,
        type: input.type,
      });

      await this.taskGatingDefaultRepo
        .createQueryBuilder()
        .relation("roles")
        .of(created)
        .add(input.roleIds);
    }
  }

  public async generateSlug(name: string): Promise<string> {
    const slug = slugify(name.slice(0, 20), { lower: true, strict: true });
    const matchingSlugs = await this.projectRepo
      .find({
        where: { slug: Raw((alias) => `${alias} ~ '^${slug}(-\\d+)?$'`) },
      })
      .then((projects) => projects.map((p) => p.slug));

    if (!matchingSlugs.length && !slugBlacklist.has(slug)) return slug;
    const set = new Set(matchingSlugs);
    for (let i = 1; i < matchingSlugs.length + 2; i++) {
      const candidate = `${slug}-${i}`;
      if (!set.has(candidate)) return candidate;
    }
    throw new Error("Could not generate slug");
  }
}
