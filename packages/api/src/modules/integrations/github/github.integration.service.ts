import { Task, TaskStatus } from "@dewo/api/models/Task";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import * as Github from "@octokit/webhooks-types";
import * as Colors from "@ant-design/colors";
import NearestColor from "nearest-color";
import { TaskService } from "../../task/task.service";
import { TaskTag, TaskTagSource } from "@dewo/api/models/TaskTag";
import { Project } from "@dewo/api/models/Project";
import { ProjectService } from "../../project/project.service";
import { GithubService } from "./github.service";
import { IntegrationService } from "../integration.service";
import { ConfigType } from "../../app/config";
import { ConfigService } from "@nestjs/config";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { GithubRepo } from "./dto/GithubRepo";
import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "@dewo/api/models/OrganizationIntegration";
import {
  GithubProjectIntegrationConfig,
  GithubProjectIntegrationFeature,
  ProjectIntegrationType,
} from "@dewo/api/models/ProjectIntegration";
import { PermalinkService } from "../../permalink/permalink.service";
import { GithubIssue } from "@dewo/api/models/GithubIssue";
import { Connection } from "typeorm";
import { InjectConnection } from "@nestjs/typeorm";
import { RbacService } from "../../rbac/rbac.service";
import { RulePermission } from "@dewo/api/models/rbac/Rule";

@Injectable()
export class GithubIntegrationService {
  private logger = new Logger(this.constructor.name);
  private githubIssueLabel: Github.Label = {
    id: 0,
    node_id: "",
    url: "",
    name: "github issue",
    description: null,
    color: "238636",
    default: false,
  };

  private nearestColor = NearestColor.from({
    red: Colors.red.primary!,
    volcano: Colors.volcano.primary!,
    gold: Colors.gold.primary!,
    orange: Colors.orange.primary!,
    yellow: Colors.yellow.primary!,
    lime: Colors.lime.primary!,
    green: Colors.green.primary!,
    cyan: Colors.cyan.primary!,
    blue: Colors.blue.primary!,
    geekblue: Colors.geekblue.primary!,
    purple: Colors.purple.primary!,
    magenta: Colors.magenta.primary!,
    grey: Colors.grey.primary!,
  });

  constructor(
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService,
    private readonly githubService: GithubService,
    private readonly integrationService: IntegrationService,
    private readonly rbacService: RbacService,
    private readonly permalink: PermalinkService,
    private readonly config: ConfigService<ConfigType>,
    @InjectConnection() public readonly connection: Connection
  ) {}

  public async updateIssue(
    issue: Pick<
      Github.Issue,
      "id" | "html_url" | "state" | "title" | "body" | "labels" | "number"
    >,
    project: Project,
    taskOverride: Partial<Task> = {}
  ) {
    this.logger.log(
      `Processing Github issue: ${JSON.stringify({
        issueId: issue.id,
        projectId: project.id,
      })}`
    );

    const tags = await this.getOrCreateTaskTags(
      [...(issue.labels ?? []), this.githubIssueLabel],
      project
    );

    const existingIssue = await this.githubService.findIssue(
      issue.id,
      project.id
    );

    const description = [
      issue.body,
      `Originally created from Github issue: ${issue.html_url}`,
    ]
      .filter((s) => !!s)
      .join("\n\n");

    if (!!existingIssue) {
      this.logger.log(`Found existing issue: ${JSON.stringify(existingIssue)}`);

      const updatedStatus =
        issue.state === "closed" ? TaskStatus.DONE : undefined;
      if (!!updatedStatus) {
        this.logger.log(
          `Will update task status: ${JSON.stringify({
            issueState: issue.state,
            updatedStatus,
          })}`
        );
      }

      const existingTask = (await this.taskService.findById(
        existingIssue.taskId
      )) as Task;
      const nonGithubTags = existingTask.tags.filter(
        (t) => t.source !== TaskTagSource.GITHUB
      );

      const task = await this.taskService.update({
        id: existingIssue.taskId,
        name: issue.title,
        description,
        tags: [...tags, ...nonGithubTags],
        status: updatedStatus,
        ...taskOverride,
      });

      this.logger.log(`Updated task: ${JSON.stringify(task)}`);
    } else {
      this.logger.log(
        `Creating task from GH issue: ${JSON.stringify({
          issue,
          taskOverride,
        })}`
      );
      const status =
        issue.state === "closed" ? TaskStatus.DONE : TaskStatus.TODO;

      const taskNumber = await this.taskService.getNextTaskNumber(project.id);
      const task = await this.connection.transaction(async (manager) => {
        const task = await manager.save(Task, {
          name: issue.title,
          description,
          tags,
          status,
          projectId: project.id,
          number: taskNumber,
          sortKey: Date.now().toString(),
          ...taskOverride,
        });

        await manager.save(GithubIssue, {
          externalId: issue.id,
          number: issue.number,
          taskId: task.id,
        });

        return task;
      });

      this.logger.debug(
        `Created task from Github Issue: ${JSON.stringify({
          taskId: task.id,
          githubIssueId: (await task.githubIssue)?.id,
        })}`
      );
    }
  }

  public async createIssueFromTask(task: Task): Promise<void> {
    if (!!task.parentTaskId || task.status === TaskStatus.BACKLOG) return;
    const projInt = await this.integrationService.findProjectIntegration(
      task.projectId,
      ProjectIntegrationType.GITHUB
    );
    if (!projInt) return;
    if (
      !projInt.config.features.includes(
        GithubProjectIntegrationFeature.CREATE_ISSUES_FROM_TASKS
      )
    ) {
      return;
    }

    const orgInt = (await projInt.organizationIntegration) as
      | OrganizationIntegration<OrganizationIntegrationType.GITHUB>
      | undefined;
    if (!orgInt) return;

    this.logger.log(
      `Creating issue on Github for task: ${JSON.stringify({
        taskId: task.id,
      })}`
    );

    const existingIssue = await task.githubIssue;
    if (!!existingIssue) {
      this.logger.warn(
        "Aborting creation of Github issue for task: issue already exists"
      );
      return;
    }

    const client = this.createClient(orgInt.config.installationId);
    const res = await client.issues.create({
      owner: projInt.config.organization,
      repo: projInt.config.repo,
      title: task.name,
      body: [
        task.description,
        `[Read more about this task and rewards on Dework.xyz](${await this.permalink.get(
          task
        )})`,
      ]
        .filter((s): s is string => !!s)
        .join("\n\n"),
    });

    const githubIssue = await this.githubService.createIssue({
      externalId: res.data.id,
      number: res.data.number,
      taskId: task.id,
    });

    this.logger.log(
      `Created GithubIssue for task: ${JSON.stringify(githubIssue)}`
    );
  }

  public async createTasksFromGithubIssues(
    projectId: string,
    userId: string,
    github?: { organization: string; repo: string }
  ): Promise<void> {
    const project = await this.projectService.findById(projectId);
    if (!project) throw new NotFoundException();
    const issues = await (!!github
      ? this.getGithubIssues(github.organization, github.repo)
      : this.getProjectIssues(projectId));
    for (const issue of issues) {
      await this.updateIssue(
        {
          ...issue,
          state: issue.state as any,
          body: issue.body ?? null,
          labels: issue.labels as any as Github.Label[],
        },
        project,
        { creatorId: userId }
      );
    }
  }

  public async createProjectsFromRepos(
    organizationId: string,
    userId: string,
    repoIds: string[]
  ): Promise<void> {
    this.logger.log(
      `Starting Github import: ${JSON.stringify({
        repoIds,
        organizationId,
        userId,
      })}`
    );

    const integration =
      await this.integrationService.findOrganizationIntegration(
        organizationId,
        OrganizationIntegrationType.GITHUB
      );
    if (!integration) {
      throw new NotFoundException("Organization integration not found");
    }

    const fallbackRole = await this.rbacService.getFallbackRole(organizationId);
    const personalRole = await this.rbacService.getOrCreatePersonalRole(
      userId,
      organizationId
    );
    if (!fallbackRole) throw new Error("Organization is missing fallback role");

    const client = this.createClient(integration.config.installationId);
    const res = await client.paginate(
      client.apps.listReposAccessibleToInstallation
    );

    // Note(fant): return type of client.paginate is wrong
    const repos = repoIds.map((repoId) =>
      (res as any as typeof res["repositories"]).find(
        (r) => r.node_id === repoId
      )
    );

    for (const repo of repos) {
      if (!repo) continue;

      this.logger.debug(`Import Github repo: ${JSON.stringify(repo)}`);

      const project = await this.projectService.create({
        organizationId,
        name: repo.name,
        description: repo.description ?? undefined,
      });
      if (repo.private) {
        await this.rbacService.createRules([
          {
            roleId: fallbackRole.id,
            permission: RulePermission.VIEW_PROJECTS,
            inverted: true,
            projectId: project.id,
          },
          {
            roleId: personalRole.id,
            permission: RulePermission.VIEW_PROJECTS,
            projectId: project.id,
          },
        ]);
      }

      const config: GithubProjectIntegrationConfig = {
        repo: repo.name,
        organization: repo.owner.login,
        features: [
          GithubProjectIntegrationFeature.SHOW_BRANCHES,
          GithubProjectIntegrationFeature.SHOW_PULL_REQUESTS,
        ],
      };
      await this.integrationService.createProjectIntegration({
        projectId: project.id,
        creatorId: userId,
        organizationIntegrationId: integration.id,
        type: ProjectIntegrationType.GITHUB,
        config,
      });

      await this.createTasksFromGithubIssues(project.id, userId);
    }
  }

  private async getOrCreateTaskTags(
    githubLabels: Github.Label[],
    project: Project
  ): Promise<TaskTag[]> {
    if (!githubLabels) return [];

    const matchesLabel = (label: Github.Label) => (tag: TaskTag) =>
      tag.source === TaskTagSource.GITHUB &&
      tag.externalId === String(label.id);

    const existingTags = await project.taskTags;
    const newGithubLabels = githubLabels.filter(
      (label) => !existingTags.some(matchesLabel(label))
    );

    this.logger.log(
      `Getting/creating task tags: ${JSON.stringify({
        existing: existingTags.map((t) => t.id),
        newGithubLabels,
      })}`
    );

    const newTags = await Promise.all(
      newGithubLabels.map((label) =>
        this.projectService.createTag({
          color: this.nearestColor(`#${label.color}`).name,
          label: label.name,
          projectId: project.id,
          source: TaskTagSource.GITHUB,
          externalId: String(label.id),
        })
      )
    );
    existingTags.push(...newTags);

    if (!!newGithubLabels.length) {
      this.logger.log(
        `Created new task tags: ${JSON.stringify({
          tagIds: newTags.map((t) => t.id),
        })}`
      );
    }

    return githubLabels
      .map((l) => existingTags.find(matchesLabel(l)))
      .filter((tag): tag is TaskTag => !!tag);
  }

  public async getOrganizationRepos(
    organizationId: string
  ): Promise<GithubRepo[]> {
    const integration =
      await this.integrationService.findOrganizationIntegration(
        organizationId,
        OrganizationIntegrationType.GITHUB
      );
    if (!integration) {
      throw new NotFoundException("Organization integration not found");
    }

    const client = this.createClient(integration.config.installationId);
    const repos = await client.paginate(
      client.apps.listReposAccessibleToInstallation
    );

    // Note(fant): return type of client.paginate is wrong
    return (repos as any as typeof repos["repositories"]).map((repo) => ({
      id: repo.node_id,
      name: repo.name,
      organization: repo.owner.login,
      integrationId: integration.id,
    }));
  }

  public async getProjectIssues(projectId: string) {
    const projInt = await this.integrationService.findProjectIntegration(
      projectId,
      ProjectIntegrationType.GITHUB
    );
    if (!projInt) {
      throw new NotFoundException("Project integration not found");
    }

    const orgInt = (await projInt.organizationIntegration) as
      | OrganizationIntegration<OrganizationIntegrationType.GITHUB>
      | undefined;
    if (!orgInt) {
      throw new NotFoundException("Organization integration not found");
    }

    return this.getGithubIssues(
      projInt.config.organization,
      projInt.config.repo,
      orgInt.config.installationId
    );
  }

  public async getGithubIssues(
    organization: string,
    repo: string,
    installationId?: number
  ) {
    this.logger.debug(
      `Getting github issues: ${JSON.stringify({
        organization,
        repo,
        installationId,
      })}`
    );
    const client = this.createClient(installationId);
    const issues = await client.paginate(
      client.issues.listForRepo,
      { owner: organization, repo, state: "all", page_size: 100 },
      (res) => res.data.filter((issue) => !issue.pull_request)
    );
    this.logger.debug(
      `Got github issues: ${JSON.stringify({
        count: issues.length,
        organization,
        repo,
        installationId,
      })}`
    );
    return issues;
  }

  private createClient(installationId?: number): Octokit {
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
