import { Workspace } from "@dewo/api/models/Workspace";
import { AtLeast, DeepAtLeast } from "@dewo/api/types/general";
import { slugBlacklist } from "@dewo/api/utils/slugBlacklist";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import slugify from "slugify";
import { Raw, Repository } from "typeorm";

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly repo: Repository<Workspace>
  ) {}

  public async create(
    partial: AtLeast<Workspace, "organizationId" | "name">
  ): Promise<Workspace> {
    const created = await this.repo.save({
      ...partial,
      sortKey: Date.now().toString(),
      slug: await this.generateSlug(partial.name),
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

  public async generateSlug(name: string): Promise<string> {
    const slug = slugify(name.slice(0, 20), { lower: true, strict: true });
    const matchingSlugs = await this.repo
      .find({
        where: { slug: Raw((alias) => `${alias} ~ '^${slug}(-\\d+)?$'`) },
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
}
