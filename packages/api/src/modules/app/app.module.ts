import { Module, ModuleMetadata } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CaslModule } from "nest-casl";
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
import { Roles } from "./app.roles";
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

export const AppBootstrapModuleImports: ModuleMetadata["imports"] = [
  ConfigModule.forRoot({ isGlobal: true, validationSchema: configSchema }),
  GlobalJwtModule,
  GraphQLModule.forRootAsync({
    imports: [TypeOrmModule.forFeature([User])],
    useClass: GraphQLConfig,
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: postgresConfig,
  }),
  CaslModule.forRoot<Roles>({
    superuserRole: Roles.superadmin,
    getUserFromRequest: (req) => req.caslUser,
  }),
  MigrationModule,
  ScheduleModule.forRoot(),
];

export const AppModuleImports: ModuleMetadata["imports"] = [
  ...AppBootstrapModuleImports,
  UserModule,
  AuthModule,
  OrganizationModule,
  ProjectModule,
  TaskModule,
  ThreepidModule,
  InviteModule,
  GithubIntegrationModule,
  DiscordIntegrationModule,
  NotionModule,
  TrelloModule,
  CoordinapeModule,
  PaymentModule,
  SubscriptionModule,
  FileUploadModule,
  PermalinkModule,
  NFTModule,
];

@Module({
  imports: AppModuleImports,
})
export class AppModule {}
