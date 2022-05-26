import { Project } from "@dewo/api/models/Project";
import { TaskViewType } from "@dewo/api/models/TaskView";
import { Workspace } from "@dewo/api/models/Workspace";
import { AtLeast, DeepAtLeast } from "@dewo/api/types/general";
import { slugBlacklist } from "@dewo/api/utils/slugBlacklist";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import slugify from "slugify";
import { Raw, Repository } from "typeorm";
import { RbacService } from "../rbac/rbac.service";
import { TaskViewService } from "../task/taskView/taskView.service";

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly repo: Repository<Workspace>,
    private readonly rbacService: RbacService,
    private readonly taskViewService: TaskViewService
  ) {}

  public async create(
    partial: AtLeast<Workspace, "organizationId" | "name">
  ): Promise<Workspace> {
    const created = await this.repo.save({
      ...partial,
      sortKey: Date.now().toString(),
      slug: await this.generateSlug(partial.name),
    });
    await this.taskViewService.create({
      name: "Board",
      workspaceId: created.id,
      filters: [],
      type: TaskViewType.BOARD,
    });
    return this.repo.findOneOrFail(created.id);
  }

  public async update(
    partial: DeepAtLeast<Workspace, "id" | "organizationId">
  ): Promise<Workspace> {
    const workspace = await this.repo.findOneOrFail(partial.id);
    await workspace.organization;
    Object.assign(workspace, partial);
    await this.repo.save(workspace);
    return workspace;
  }

  public async findById(id: string): Promise<Workspace | undefined> {
    return this.repo.findOne(id);
  }

  public async findBySlug(slug: string): Promise<Workspace | undefined> {
    return this.repo.findOne({ slug });
  }

  public async generateSlug(name: string): Promise<string> {
    const slug = slugify(name.slice(0, 20), { lower: true, strict: true });
    const matchingSlugs = await this.repo
      .find({
        where: { slug: Raw((alias) => `${alias} ~ '^${slug}(-\\d+)?$'`) },
        withDeleted: true,
      })
      .then((workspaces) => workspaces.map((w) => w.slug));

    if (!matchingSlugs.length && !slugBlacklist.has(slug)) return slug;
    const set = new Set(matchingSlugs);
    for (let i = 1; i < matchingSlugs.length + 2; i++) {
      const candidate = `${slug}-${i}`;
      if (!set.has(candidate)) return candidate;
    }
    throw new Error("Could not generate slug");
  }

  public async getProjects(
    workspaceId: string,
    userId: string | undefined
  ): Promise<Project[]> {
    const workspace = await this.findById(workspaceId);
    if (!workspace) throw new NotFoundException();
    const projects = await workspace?.projects;

    const ability = await this.rbacService.abilityForUser(
      userId,
      workspace.organizationId
    );
    return projects.filter((project) => ability.can("read", project));
  }
}
