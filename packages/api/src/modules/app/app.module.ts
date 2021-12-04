import { Module, ModuleMetadata } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configSchema } from "./config";
import { postgresConfig } from "./postgres.config";
import { gqlConfig } from "./gql.config";
import { AuthModule, GlobalJwtModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { DatabaseModule } from "@dewo/api/testing/Database";
import { OrganizationModule } from "../organization/organization.module";
import { ProjectModule } from "../project/project.module";
import { TaskModule } from "../task/task.module";
import { DiscordIntegrationModule } from "../integrations/discord/discord.integration.module";
import { InviteModule } from "../invite/invite.module";
import { PaymentModule } from "../payment/payment.module";

export const AppBootstrapModuleImports: ModuleMetadata["imports"] = [
  ConfigModule.forRoot({ isGlobal: true, validationSchema: configSchema }),
  GraphQLModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: gqlConfig,
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: postgresConfig,
  }),
  GlobalJwtModule,
  DatabaseModule,
];

export const AppModuleImports: ModuleMetadata["imports"] = [
  ...AppBootstrapModuleImports,
  UserModule,
  AuthModule,
  OrganizationModule,
  ProjectModule,
  TaskModule,
  InviteModule,
  DiscordIntegrationModule,
  PaymentModule,
];

@Module({
  imports: AppModuleImports,
})
export class AppModule {}
