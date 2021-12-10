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
import { DatabaseModule } from "@dewo/api/testing/Database";
import { OrganizationModule } from "../organization/organization.module";
import { ProjectModule } from "../project/project.module";
import { TaskModule } from "../task/task.module";
import { DiscordIntegrationModule } from "../integrations/discord/discord.integration.module";
import { InviteModule } from "../invite/invite.module";
import { PaymentModule } from "../payment/payment.module";
import { Roles } from "./app.roles";
import { User } from "@dewo/api/models/User";
import { SubscriptionModule } from "../subscription/subscription.module";

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
    getUserFromRequest: (req) => req.caslUser,
  }),
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
  SubscriptionModule,
];

@Module({
  imports: AppModuleImports,
})
export class AppModule {}
