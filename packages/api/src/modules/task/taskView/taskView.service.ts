import { DeepAtLeast } from "@dewo/api/types/general";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Raw, Repository } from "typeorm";

import {
  TaskView,
  TaskViewFilterType,
  TaskViewType,
} from "@dewo/api/models/TaskView";
import slugify from "slugify";
import { slugBlacklist } from "@dewo/api/utils/slugBlacklist";
import { User } from "@dewo/api/models/User";

@Injectable()
export class TaskViewService {
  constructor(
    @InjectRepository(TaskView)
    private readonly repo: Repository<TaskView>
  ) {}

  public async create(
    partial: DeepAtLeast<TaskView, "name" | "projectId" | "type" | "filters">
  ): Promise<TaskView> {
    const created = await this.repo.save({
      ...partial,
      slug: await this.generateSlug(partial.name),
      sortKey: Date.now().toString(),
    });
    return this.repo.findOneOrFail(created.id);
  }

  public async createDefaultUserTaskViews(user: User): Promise<TaskView[]> {
    return await Promise.all([
      this.create({
        name: "Assigned",
        filters: [
          {
            type: TaskViewFilterType.ASSIGNEES,
            assigneeIds: [user.id],
          },
        ],
        type: TaskViewType.BOARD,
        userId: user.id,
      }),
      // TODO(fant): we need a way to search for task applicants
      // this.create({
      //   name: "Applied",
      //   filters: [
      //     { type: TaskViewFilterType.STATUSES, statuses: [TaskStatus.TODO] },
      //     { type: TaskViewFilterType.ASSIGNEES, assigneeIds: [null] },
      //   ],
      //   type: TaskViewType.LIST,
      //   userId: user.id,
      // }),
      this.create({
        name: "To Review",
        filters: [{ type: TaskViewFilterType.OWNERS, ownerIds: [user.id] }],
        type: TaskViewType.BOARD,
        userId: user.id,
      }),
    ]);
  }

  public async update(partial: DeepAtLeast<TaskView, "id">): Promise<TaskView> {
    await this.repo.update({ id: partial.id }, partial);
    return this.repo.findOneOrFail(partial.id);
  }

  public async findById(id: string): Promise<TaskView | undefined> {
    return this.repo.findOne(id);
  }

  private async generateSlug(name: string): Promise<string> {
    const slug = slugify(name.slice(0, 20), { lower: true, strict: true });
    const slugs = await this.repo
      .find({
        where: {
          slug: Raw((alias) => `${alias} ~ '^${slug}(-\\d+)?$'`),
        },
      })
      .then((views) => views.map((view) => view.slug));

    if (!slugs.length && !slugBlacklist.has(slug)) return slug;
    const set = new Set(slugs);
    for (let i = 1; i < slugs.length + 2; i++) {
      const candidate = `${slug}-${i}`;
      if (!set.has(candidate)) return candidate;
    }
    throw new Error("Could not generate slug");
  }
}
