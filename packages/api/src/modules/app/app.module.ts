import { Module, ModuleMetadata } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configSchema } from "./config";
import { mysqlConfig } from "./mysql.config";
import { gqlConfig } from "./gql.config";
import { AuthModule, GlobalJwtModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { DatabaseModule } from "@dewo/api/testing/Database";

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
    useFactory: mysqlConfig,
  }),
  GlobalJwtModule,
  DatabaseModule,
];

export const AppModuleImports: ModuleMetadata["imports"] = [
  ...AppBootstrapModuleImports,
  UserModule,
  AuthModule,
];

@Module({
  imports: AppModuleImports,
})
export class AppModule {}
