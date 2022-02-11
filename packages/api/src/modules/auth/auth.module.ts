import { Global, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ConfigType } from "@dewo/api/modules/app/config";
import { PassportModule } from "@nestjs/passport";
import { GithubStrategy } from "./strategies/github.strategy";
import { AuthController } from "./auth.controller";
import { LoggerMiddleware } from "./logger";
import {
  DiscordJoinGuildStrategy,
  DiscordStrategy,
} from "./strategies/discord.strategy";
import { ThreepidModule } from "../threepid/threepid.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@dewo/api/models/User";
import { PermalinkModule } from "../permalink/permalink.module";
import { IntegrationModule } from "../integrations/integration.module";
import { ProjectModule } from "../project/project.module";
import { WalletConnectResolver } from "./walletconnect.resolver";
import { NotionStrategy } from "./strategies/notion.strategy";

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigType>) => ({
        secret: configService.get("JWT_SECRET"),
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  exports: [JwtModule],
})
export class GlobalJwtModule {}

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    ThreepidModule,
    ProjectModule,
    IntegrationModule,
    PermalinkModule,
  ],
  providers: [
    GithubStrategy,
    DiscordStrategy,
    DiscordJoinGuildStrategy,
    NotionStrategy,
    WalletConnectResolver,
  ],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(AuthController);
  }
}
