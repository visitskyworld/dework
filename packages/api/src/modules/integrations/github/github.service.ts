import { GithubBranch } from "@dewo/api/models/GithubBranch";
import { GithubPullRequest } from "@dewo/api/models/GithubPullRequest";
import { ProjectIntegrationSource } from "@dewo/api/models/ProjectIntegration";
import { Task } from "@dewo/api/models/Task";
import { DeepAtLeast } from "@dewo/api/types/general";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class GithubService {
  constructor(
    @InjectRepository(GithubPullRequest)
    private readonly githubPullRequestRepo: Repository<GithubPullRequest>,
    @InjectRepository(GithubBranch)
    private readonly githubBranchRepo: Repository<GithubBranch>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>
  ) {}

  public async createPullRequest(
    partial: Partial<GithubPullRequest>
  ): Promise<GithubPullRequest | undefined> {
    const createdTask = await this.githubPullRequestRepo.save(partial);
    return this.githubPullRequestRepo.findOne(createdTask.id);
  }

  public async updatePullRequest(
    partial: DeepAtLeast<GithubPullRequest, "id">
  ): Promise<GithubPullRequest | undefined> {
    const updated = await this.githubPullRequestRepo.save(partial);
    return this.githubPullRequestRepo.findOne(updated.id);
  }

  public async findPullRequestByTaskId(
    taskId: string
  ): Promise<GithubPullRequest | undefined> {
    return this.githubPullRequestRepo.findOne({ taskId: taskId });
  }

  public async createBranch(
    partial: Partial<GithubBranch>
  ): Promise<GithubBranch | undefined> {
    const createdTask = await this.githubBranchRepo.save(partial);
    return this.githubBranchRepo.findOne(createdTask.id);
  }

  public async updateBranch(
    partial: DeepAtLeast<GithubBranch, "id">
  ): Promise<GithubBranch | undefined> {
    const updated = await this.githubBranchRepo.save(partial);
    return this.githubBranchRepo.findOne(updated.id);
  }

  public async findBranchByName(
    name: string
  ): Promise<GithubBranch | undefined> {
    return this.githubBranchRepo.findOne({ name: name });
  }

  public parseTaskNumberFromBranchName(branchName: string): number | undefined {
    const taskNumber = branchName?.match(/\/dw-([0-9]+)\//)?.[1];
    if (!taskNumber) return undefined;
    return Number(taskNumber);
  }

  public async findTask(
    taskNumber: number,
    githubInstallationId: string
  ): Promise<Task | undefined> {
    return this.taskRepo
      .createQueryBuilder("task")
      .innerJoin("task.project", "taskProject")
      .innerJoin("taskProject.organization", "organization")
      .innerJoin("organization.projects", "allProjects")
      .innerJoin("allProjects.integrations", "integration")
      .where("task.number = :number", { number: taskNumber })
      .andWhere("integration.source = :source", {
        source: ProjectIntegrationSource.github,
      })
      .andWhere("integration.config->>'installationId' = :installationId", {
        installationId: githubInstallationId,
      })
      .getOne();
  }
}
