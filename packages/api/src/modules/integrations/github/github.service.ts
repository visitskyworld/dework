import { GithubBranch } from "@dewo/api/models/GithubBranch";
import { GithubPullRequest } from "@dewo/api/models/GithubPullRequest";
import Bluebird from "bluebird";
import { OrganizationIntegrationType } from "@dewo/api/models/OrganizationIntegration";
import {
  ProjectIntegration,
  ProjectIntegrationType,
} from "@dewo/api/models/ProjectIntegration";
import { Task } from "@dewo/api/models/Task";
import { AtLeast, DeepAtLeast } from "@dewo/api/types/general";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GithubIssue } from "@dewo/api/models/GithubIssue";
import { User } from "@dewo/api/models/User";
import { ThreepidSource } from "@dewo/api/models/Threepid";

@Injectable()
export class GithubService {
  constructor(
    @InjectRepository(GithubPullRequest)
    private readonly githubPullRequestRepo: Repository<GithubPullRequest>,
    @InjectRepository(GithubBranch)
    private readonly githubBranchRepo: Repository<GithubBranch>,
    @InjectRepository(GithubIssue)
    private readonly githubIssueRepo: Repository<GithubIssue>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ProjectIntegration)
    private readonly projectIntegrationRepo: Repository<ProjectIntegration>
  ) {}

  public async createPullRequest(
    partial: Partial<GithubPullRequest>
  ): Promise<GithubPullRequest> {
    const created = await this.githubPullRequestRepo.save(partial);
    return this.githubPullRequestRepo.findOne(
      created.id
    ) as Promise<GithubPullRequest>;
  }

  public async updatePullRequest(
    partial: DeepAtLeast<GithubPullRequest, "id">
  ): Promise<GithubPullRequest> {
    const updated = await this.githubPullRequestRepo.save(partial);
    return this.githubPullRequestRepo.findOne(
      updated.id
    ) as Promise<GithubPullRequest>;
  }

  public async findPullRequestByTaskId(
    taskId: string
  ): Promise<GithubPullRequest | undefined> {
    return this.githubPullRequestRepo.findOne({ taskId });
  }

  public async createBranch(
    partial: Partial<GithubBranch>
  ): Promise<GithubBranch> {
    const created = await this.githubBranchRepo.save(partial);
    return this.githubBranchRepo.findOne(created.id) as Promise<GithubBranch>;
  }

  public async updateBranch(
    partial: DeepAtLeast<GithubBranch, "id">
  ): Promise<GithubBranch> {
    const updated = await this.githubBranchRepo.save(partial);
    return this.githubBranchRepo.findOne(updated.id) as Promise<GithubBranch>;
  }

  public async findBranchByName(
    name: string
  ): Promise<GithubBranch | undefined> {
    return this.githubBranchRepo.findOne({ name: name });
  }

  public async createIssue(
    partial: AtLeast<GithubIssue, "taskId" | "number" | "externalId">
  ): Promise<GithubIssue> {
    const created = await this.githubIssueRepo.save(partial);
    return this.githubIssueRepo.findOne(created.id) as Promise<GithubIssue>;
  }

  public async updateIssue(
    partial: DeepAtLeast<GithubIssue, "id">
  ): Promise<GithubIssue> {
    const updated = await this.githubIssueRepo.save(partial);
    return this.githubIssueRepo.findOne(updated.id) as Promise<GithubIssue>;
  }

  public async findIssue(
    externalId: number,
    projectId: string
  ): Promise<GithubIssue | undefined> {
    return this.githubIssueRepo
      .createQueryBuilder("issue")
      .innerJoin("issue.task", "task")
      .where("task.projectId = :projectId", { projectId })
      .andWhere("issue.externalId = :externalId", { externalId })
      .getOne();
  }

  public parseTaskNumberFromBranchName(branchName: string): number | undefined {
    const taskNumber = branchName?.match(/\/dw-([0-9]+)\//)?.[1];
    if (!taskNumber) return undefined;
    return Number(taskNumber);
  }

  public async findTask(query: {
    taskNumber: number;
    organization: string;
    repo: string;
    installationId: number;
  }): Promise<Task | undefined> {
    return this.taskRepo
      .createQueryBuilder("task")
      .leftJoinAndSelect("task.assignees", "assignees")
      .leftJoinAndSelect("task.owners", "owners")
      .innerJoin("task.project", "project")
      .innerJoin("project.integrations", "projInt")
      .innerJoin("projInt.organizationIntegration", "orgInt")
      .where("task.number = :number", { number: query.taskNumber })
      .andWhere("projInt.deletedAt IS NULL")
      .andWhere("projInt.type = :type", { type: ProjectIntegrationType.GITHUB })
      .andWhere(`"projInt"."config"->>'repo' = :repo`, { repo: query.repo })
      .andWhere(`"projInt"."config"->>'organization' = :organization`, {
        organization: query.organization,
      })
      .andWhere("orgInt.type = :type", {
        type: OrganizationIntegrationType.GITHUB,
      })
      .andWhere(`"orgInt"."config"->>'installationId' = :installationId`, {
        installationId: query.installationId,
      })
      .getOne();
  }

  public async findIntegrations(
    organization: string,
    repo: string
  ): Promise<ProjectIntegration<ProjectIntegrationType.GITHUB>[]> {
    return this.projectIntegrationRepo
      .createQueryBuilder("projInt")
      .innerJoin("projInt.project", "project")
      .where("projInt.deletedAt IS NULL")
      .andWhere("project.deletedAt IS NULL")
      .andWhere("projInt.type = :type", { type: ProjectIntegrationType.GITHUB })
      .andWhere(`"projInt"."config"->>'repo' = :repo`, { repo })
      .andWhere(`"projInt"."config"->>'organization' = :organization`, {
        organization,
      })
      .getMany() as Promise<
      ProjectIntegration<ProjectIntegrationType.GITHUB>[]
    >;
  }

  public async getUsersFromGithubIds(
    githubIds: number[]
  ): Promise<Record<number, User>> {
    const users = await this.userRepo
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.threepids", "threepid")
      .where("threepid.source = :source", { source: ThreepidSource.github })
      .andWhere("threepid.threepid IN (:...githubIds)", {
        githubIds: githubIds.map(String),
      })
      .getMany();
    return Bluebird.reduce<User, Record<number, User>>(
      users,
      async (acc, user) => {
        const threepids = await user.threepids;
        const discordId = threepids.find(
          (t) => t.source === ThreepidSource.github
        )?.threepid;
        if (!discordId) return acc;
        return { ...acc, [Number(discordId)]: user };
      },
      {}
    );
  }
}
