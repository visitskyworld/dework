import { GithubBranch } from "@dewo/api/models/GithubBranch";
import { GithubPullRequest } from "@dewo/api/models/GithubPullRequest";
import Bluebird from "bluebird";
import * as Github from "@octokit/webhooks-types";
import { OrganizationIntegrationType } from "@dewo/api/models/OrganizationIntegration";
import {
  ProjectIntegration,
  ProjectIntegrationType,
} from "@dewo/api/models/ProjectIntegration";
import { Task } from "@dewo/api/models/Task";
import { AtLeast, DeepAtLeast } from "@dewo/api/types/general";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { GithubIssue } from "@dewo/api/models/GithubIssue";
import { User } from "@dewo/api/models/User";
import { Threepid, ThreepidSource } from "@dewo/api/models/Threepid";
import { Octokit } from "@octokit/rest";
import { ConfigService } from "@nestjs/config";
import { createAppAuth } from "@octokit/auth-app";
import { ConfigType } from "../../app/config";
import { ThreepidService } from "../../threepid/threepid.service";

@Injectable()
export class GithubService {
  private readonly logger = new Logger(this.constructor.name);

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
    private readonly projectIntegrationRepo: Repository<ProjectIntegration>,
    private readonly threepidService: ThreepidService,
    private readonly config: ConfigService<ConfigType>
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

  public async upsertBranch(
    partial: AtLeast<GithubBranch, "name" | "repo" | "organization" | "taskId">
  ): Promise<GithubBranch> {
    const branch = await this.githubBranchRepo.upsert(partial, {
      conflictPaths: ["name", "repo", "organization", "taskId"],
    });
    return this.githubBranchRepo.findOneOrFail(branch.identifiers[0]?.id);
  }

  public async findBranchByName(
    name: string
  ): Promise<GithubBranch | undefined> {
    return this.githubBranchRepo.findOne({ name });
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
    const taskNumber = branchName?.match(/(\/|^)dw-([0-9]+)(\/|$)/)?.[2];
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

  public async getGithubIds(
    userIds: string[]
  ): Promise<Record<string, string>> {
    if (!userIds) return {};
    const threepids = await this.threepidService.find({
      userId: In(userIds),
      source: ThreepidSource.github,
    });
    return userIds.reduce(
      (acc, userId) => ({
        ...acc,
        [userId]: threepids.find((t) => t.userId === userId)?.threepid,
      }),
      {}
    );
  }

  public async getGithubUsernames(
    userIds: string[]
  ): Promise<Record<string, string>> {
    if (!userIds) return {};
    const threepids = (await this.threepidService.find({
      userId: In(userIds),
      source: ThreepidSource.github,
    })) as Threepid<ThreepidSource.github>[];
    return userIds.reduce(
      (acc, userId) => ({
        ...acc,
        [userId]: threepids.find((t) => t.userId === userId)?.config.profile
          .username,
      }),
      {}
    );
  }

  public async getBranchAndTask(
    ref: string,
    repository: Github.Repository,
    installationId: number
  ): Promise<
    { name: string; task: Task; organization: string; repo: string } | undefined
  > {
    const name = ref.replace("refs/head/", "");
    const taskNumber = this.parseTaskNumberFromBranchName(name);

    if (!taskNumber) {
      this.logger.log(
        `Failed to parse task number from branch name: ${JSON.stringify({
          name,
        })}`
      );
      return undefined;
    }

    this.logger.log(
      `Parsed task number from branch name: ${JSON.stringify({
        name,
        taskNumber,
      })}`
    );

    const organization = repository.owner.login;
    const repo = repository.name;

    const task = await this.findTask({
      taskNumber,
      installationId,
      organization,
      repo,
    });

    if (!task) {
      this.logger.log(
        `Failed to find task: ${JSON.stringify({ taskNumber, installationId })}`
      );
      return undefined;
    }

    this.logger.log(
      `Found task: ${JSON.stringify({
        taskId: task.id,
        taskNumber,
        installationId,
      })}`
    );
    return { task, name, organization, repo };
  }

  public createClient(installationId?: number): Octokit {
    const privateKeyBase64 = this.config.get(
      "GITHUB_APP_PRIVATE_KEY"
    ) as string;
    const privateKey = Buffer.from(privateKeyBase64, "base64").toString();

    // const clientId = this.config.get("GITHUB_APP_CLIENT_ID");
    // const clientSecret = this.config.get("GITHUB_APP_CLIENT_SECRET");
    // TODO(fant): figure out how to properly auth with clientId/clientSecret
    return new Octokit(
      !!installationId
        ? {
            authStrategy: createAppAuth,
            auth: {
              appId: this.config.get("GITHUB_APP_ID"),
              privateKey,
              installationId,
              // ...(!!installationId ? { installationId } : { clientId, clientSecret }),
            },
          }
        : undefined
    );
  }
}
