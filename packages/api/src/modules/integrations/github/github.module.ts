import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GithubBranch } from "@dewo/api/models/GithubBranch";
import { GithubPullRequest } from "@dewo/api/models/GithubPullRequest";
import { Task } from "@dewo/api/models/Task";
import { GithubService } from "./github.service";
import { TaskModule } from "../../task/task.module";
import { OrganizationIntegration } from "@dewo/api/models/OrganizationIntegration";
import { GithubResolver } from "./github.resolver";
import { GithubIntegrationService } from "./github.integration.service";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { ProjectModule } from "../../project/project.module";
import { GithubIssue } from "@dewo/api/models/GithubIssue";
import { Project } from "@dewo/api/models/Project";
import { GithubIntegrationTaskCreatedEventHandler } from "./github.eventHandlers";
import { PermalinkModule } from "../../permalink/permalink.module";
import { OrganizationModule } from "../../organization/organization.module";
import { RbacModule } from "../../rbac/rbac.module";
import { IntegrationModule } from "../integration.module";
import { User } from "@dewo/api/models/User";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GithubPullRequest,
      GithubBranch,
      GithubIssue,
      Task,
      User,
      Project,
      ProjectIntegration,
      OrganizationIntegration,
    ]),
    TaskModule,
    ProjectModule,
    OrganizationModule,
    PermalinkModule,
    RbacModule,
    IntegrationModule,
  ],
  providers: [
    GithubService,
    GithubResolver,
    GithubIntegrationService,
    GithubIntegrationTaskCreatedEventHandler,
  ],
  exports: [GithubService, GithubIntegrationService],
})
export class GithubIntegrationModule {}
