import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { Controller, Get, Logger, Post, Req, Res } from "@nestjs/common";
import * as Github from "@octokit/webhooks-types";
import {
  GithubPullRequest,
  GithubPullRequestStatus,
} from "@dewo/api/models/GithubPullRequest";
import { ConfigType } from "../../../app/config";
import { GithubService } from "../github.service";
import { TaskService } from "../../../task/task.service";
import { IntegrationService } from "../../integration.service";
import { OrganizationIntegrationType } from "@dewo/api/models/OrganizationIntegration";
import { GithubIntegrationService } from "../github.integration.service";
import { DiscordIntegrationService } from "../../discord/discord.integration.service";
import { TaskStatus } from "@dewo/api/models/Task";
import {
  GithubProjectIntegrationFeature,
  ProjectIntegration,
  ProjectIntegrationType,
} from "@dewo/api/models/ProjectIntegration";
import * as qs from "query-string";
import { GithubSyncIncomingService } from "../sync/github.sync.incoming";

type GithubPullRequestPayload = Pick<
  GithubPullRequest,
  | "title"
  | "status"
  | "number"
  | "branchName"
  | "link"
  | "taskId"
  | "externalId"
>;

function PreventConcurrency(): MethodDecorator {
  let promise = Promise.resolve();
  return function (
    _target: any,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const fn = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      await promise;
      promise = promise.finally(() => fn.apply(this, args));
      return promise;
    };
  };
}

@Controller("github")
export class GithubWebhookController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly configService: ConfigService<ConfigType>,
    private readonly integrationService: IntegrationService,
    private readonly taskService: TaskService,
    private readonly githubService: GithubService,
    private readonly githubIntegrationService: GithubIntegrationService,
    private readonly discordIntegrationService: DiscordIntegrationService,
    private readonly githubSyncIncomingService: GithubSyncIncomingService
  ) {}

  // Hit when user finishes the GH app installation
  @Get("app-callback")
  async githubAppCallback(@Req() { query }: Request, @Res() res: Response) {
    const stateString = query.state as string;
    const installationId = Number(query.installation_id);
    const { creatorId, organizationId, appUrl, ...redirectProps } =
      JSON.parse(stateString);

    await this.integrationService.upsertOrganizationIntegration({
      creatorId,
      organizationId,
      type: OrganizationIntegrationType.GITHUB,
      config: { installationId },
    });

    res.redirect(
      `${this.getAppUrl(stateString)}?${qs.stringify(redirectProps)}`
    );
  }

  @Post("webhook")
  @PreventConcurrency()
  async githubWebhook(@Req() request: Request) {
    const event = request.body as Github.WebhookEvent;
    this.logger.debug(`Incoming Github webhook: ${JSON.stringify(event)}`);

    await this.githubSyncIncomingService.handleWebhook(event);

    if (!("repository" in event) || !event.repository) {
      this.logger.debug("No Github repository in event");
      return;
    }

    const integrations = await this.githubService.findIntegrations(
      event.repository.owner.login,
      event.repository.name
    );

    for (const integration of integrations) {
      await this.handleWebhookEventForIntegration(event, integration);
    }
  }

  private async handleWebhookEventForIntegration(
    event: Github.WebhookEvent,
    integration: ProjectIntegration<ProjectIntegrationType.GITHUB>
  ) {
    if (!("installation" in event) || !event.installation) {
      this.logger.debug("No Github installation in event");
      return;
    }

    this.logger.debug(
      `Found project integration for Github installation: ${JSON.stringify(
        integration
      )}`
    );
    if ("issue" in event) {
      const project = await integration.project;
      await this.githubIntegrationService.updateIssue(event.issue, project);
    }

    if (
      "pull_request" in event &&
      integration.config.features.includes(
        GithubProjectIntegrationFeature.SHOW_PULL_REQUESTS
      )
    ) {
      const result = await this.githubService.getBranchAndTask(
        event.pull_request.head.ref,
        event.repository,
        event.installation.id
      );

      if (!result) return;
      const { task, name: branchName } = result;

      const { id, title, state, html_url, number, draft } = event.pull_request;
      const pr = await this.githubService.findPullRequestByTaskId(task.id);
      const prData: GithubPullRequestPayload = {
        title,
        number,
        branchName,
        externalId: id,
        status: {
          open: GithubPullRequestStatus.OPEN,
          closed: GithubPullRequestStatus.CLOSED,
        }[state],
        link: html_url,
        taskId: task.id,
      };

      if (event.action === "closed") {
        if (!pr) {
          this.logger.debug(
            "Closed PR but no GithubPullRequest registered in Dework"
          );
          return;
        }
        const merged = event.pull_request.merged;
        const status = merged
          ? GithubPullRequestStatus.MERGED
          : GithubPullRequestStatus.CLOSED;
        this.logger.debug(
          `Closed PR: ${JSON.stringify({ merged, status, prId: pr.id })}`
        );
        await this.githubService.updatePullRequest({
          ...prData,
          id: pr.id,
          status,
        });

        this.logger.debug(
          `Updated PR's status: ${JSON.stringify({ title: pr.title, status })}`
        );

        if (merged) {
          await this.taskService.update({
            id: task.id,
            status: TaskStatus.DONE,
          });
          this.logger.debug(
            `Updated task status: ${JSON.stringify({
              taskNumber: task.number,
              status: TaskStatus.DONE,
            })}`
          );
        }
      } else if (event.action === "submitted") {
        const wasSingleCommentAdded = event.review.body === null;
        if (!wasSingleCommentAdded) {
          await this.discordIntegrationService
            .postReviewSubmittal(
              task.id,
              event.review.html_url,
              event.review?.state === "approved"
            )
            .catch(() => {});
          this.logger.debug(
            `A review was submitted in Github: ${JSON.stringify({
              pullRequestTitle: prData.title,
              taskId: task.id,
            })}`
          );
        }
      } else {
        if (pr) {
          await this.githubService.updatePullRequest({ ...prData, id: pr.id });
          this.logger.debug(
            `Updated PR: ${JSON.stringify({
              title: pr.title,
              taskId: task.id,
            })}`
          );
        } else {
          await this.githubService.createPullRequest(prData);
          this.logger.debug(
            `Created a new PR: ${JSON.stringify({
              title: prData.title,
              taskId: task.id,
            })}`
          );
        }

        if (!draft) {
          if (task.status !== TaskStatus.IN_REVIEW) {
            await this.taskService.update({
              id: task.id,
              status: TaskStatus.IN_REVIEW,
            });
            this.logger.debug(
              `Updated task status: ${JSON.stringify({
                taskNumber: task.number,
                status: TaskStatus.IN_REVIEW,
              })}`
            );
          } else if (event.action === "review_requested") {
            this.discordIntegrationService.postReviewRequest(
              task,
              event.pull_request.html_url
            );
            this.logger.debug(
              `Another review was requested from Github: ${JSON.stringify({
                pullRequestTitle: prData.title,
                taskId: task.id,
              })}`
            );
          }
        }
      }

      await this.triggerTaskUpdatedSubscription(task.id);
    }
  }

  private async triggerTaskUpdatedSubscription(taskId: string) {
    await this.taskService.update({ id: taskId });
  }

  private getAppUrl(stateString: unknown): string {
    try {
      if (typeof stateString === "string") {
        const state = JSON.parse(stateString);
        if (!!state.appUrl) return state.appUrl;
      }
    } catch {}
    return this.configService.get("APP_URL") as string;
  }
}
