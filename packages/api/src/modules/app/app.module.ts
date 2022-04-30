import { Module, ModuleMetadata } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configSchema } from "./config";
import { postgresConfig } from "./postgres.config";
import { GraphQLConfig } from "./graphql.config";
import { AuthModule, GlobalJwtModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { OrganizationModule } from "../organization/organization.module";
import { ProjectModule } from "../project/project.module";
import { TaskModule } from "../task/task.module";
import { DiscordIntegrationModule } from "../integrations/discord/discord.integration.module";
import { InviteModule } from "../invite/invite.module";
import { PaymentModule } from "../payment/payment.module";
import { User } from "@dewo/api/models/User";
import { SubscriptionModule } from "../subscription/subscription.module";
import { GithubIntegrationModule } from "../integrations/github/github.module";
import { FileUploadModule } from "../fileUpload/fileUpload.module";
import { PermalinkModule } from "../permalink/permalink.module";
import { ScheduleModule } from "@nestjs/schedule";
import { ThreepidModule } from "../threepid/threepid.module";
import { MigrationModule } from "./migration/migration.module";
import { NotionModule } from "../integrations/notion/notion.module";
import { TrelloModule } from "../integrations/trello/trello.module";
import { CoordinapeModule } from "../integrations/coordinape/coordinape.module";
import { NFTModule } from "../nft/nft.module";
import { RbacModule } from "../rbac/rbac.module";
import { DiscordRolesModule } from "../integrations/discord/roles/discord.roles.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { UserPromptModule } from "../user/prompt/userPrompt.module";
import { GithubWebhookModule } from "../integrations/github/webhook/github.webhook.module";
import { TaskViewModule } from "../task/taskView/taskView.module";
import { TaskApplicationModule } from "../task/taskApplication/taskApplication.module";
import { ReputationModule } from "../reputation/reputation.module";

export const AppBootstrapModuleImports: ModuleMetadata["imports"] = [
  ConfigModule.forRoot({ isGlobal: true, validationSchema: configSchema }),
  GlobalJwtModule,
  GraphQLModule.forRootAsync({
    imports: [TypeOrmModule.forFeature([User]), AnalyticsModule],
    useClass: GraphQLConfig,
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: postgresConfig,
  }),
  MigrationModule,
  ScheduleModule.forRoot(),
];

export const AppModuleImports: ModuleMetadata["imports"] = [
  ...AppBootstrapModuleImports,
  UserModule,
  UserPromptModule,
  AuthModule,
  OrganizationModule,
  ProjectModule,
  TaskModule,
  TaskViewModule,
  TaskApplicationModule,
  ThreepidModule,
  InviteModule,
  GithubIntegrationModule,
  GithubWebhookModule,
  DiscordIntegrationModule,
  NotionModule,
  TrelloModule,
  CoordinapeModule,
  PaymentModule,
  SubscriptionModule,
  FileUploadModule,
  PermalinkModule,
  NFTModule,
  RbacModule,
  DiscordRolesModule,
  AnalyticsModule,
  ReputationModule,
];

@Module({
  imports: AppModuleImports,
})
export class AppModule {}
