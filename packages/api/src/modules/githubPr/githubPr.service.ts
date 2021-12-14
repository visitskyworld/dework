import { GithubPr } from "@dewo/api/models/GithubPr";
import { Task } from "@dewo/api/models/Task";
import { DeepAtLeast } from "@dewo/api/types/general";
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class GithubPrService {
  constructor(
    @InjectRepository(GithubPr)
    private readonly githubPrRepo: Repository<GithubPr>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>
  ) {}

  public async create(
    partial: Partial<GithubPr>
  ): Promise<GithubPr | undefined> {
    if (!this.findCorrespondingTask(partial.taskId)) {
      // This will happen often until we intelligently look task id in description
      return;
    }

    const createdTask = await this.githubPrRepo.save(partial);
    return this.githubPrRepo.findOne(createdTask.id);
  }

  public async update(partial: DeepAtLeast<GithubPr, "id">): Promise<GithubPr> {
    const updated = await this.githubPrRepo.save({
      ...partial,
      updatedAt: new Date(),
    });
    return this.githubPrRepo.findOne(updated.id) as Promise<GithubPr>;
  }

  public async findByTaskId(taskId: string): Promise<GithubPr | undefined> {
    return this.githubPrRepo
      .createQueryBuilder("github_pr")
      .where("github_pr.taskId = :taskId", { taskId: taskId })
      .getOne();
  }

  private async findCorrespondingTask(
    taskId?: string
  ): Promise<Task | undefined> {
    if (!taskId || taskId.length > 36) {
      return undefined;
    }
    const correspondingTask = await this.taskRepo.findOne(taskId);
    return correspondingTask;
  }
}
