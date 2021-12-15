import { GithubPullRequest } from "@dewo/api/models/GithubPullRequest";
import { Task } from "@dewo/api/models/Task";
import { DeepAtLeast } from "@dewo/api/types/general";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class GithubPullRequestService {
  constructor(
    @InjectRepository(GithubPullRequest)
    private readonly githubPullRequestRepo: Repository<GithubPullRequest>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>
  ) {}

  public async create(
    partial: Partial<GithubPullRequest>
  ): Promise<GithubPullRequest | undefined> {
    const createdTask = await this.githubPullRequestRepo.save(partial);
    return this.githubPullRequestRepo.findOne(createdTask.id);
  }

  public async update(
    partial: DeepAtLeast<GithubPullRequest, "id">
  ): Promise<GithubPullRequest | undefined> {
    const updated = await this.githubPullRequestRepo.save(partial);
    return this.githubPullRequestRepo.findOne(updated.id);
  }

  public async findByTaskId(
    taskId: string
  ): Promise<GithubPullRequest | undefined> {
    return this.githubPullRequestRepo.findOne({ taskId: taskId });
  }

  public async findCorrespondingTask(
    taskId?: string
  ): Promise<Task | undefined> {
    if (!taskId || taskId.length > 36) {
      return undefined;
    }
    const correspondingTask = await this.taskRepo.findOne(taskId);
    return correspondingTask;
  }
}
