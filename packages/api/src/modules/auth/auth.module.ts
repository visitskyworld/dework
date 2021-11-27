import { Global, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ConfigType } from "@dewo/api/modules/app/config";
import { PassportModule } from "@nestjs/passport";
import { GithubStrategy } from "./strategies/github.strategy";
import { AuthController } from "./auth.controller";
import { LoggerMiddleware } from "./logger";
import { DiscordStrategy } from "./strategies/discord.strategy";
import { ThreepidService } from "./threepid.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Threepid } from "@dewo/api/models/Threepid";

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
  ],
  exports: [JwtModule],
})
export class GlobalJwtModule {}

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    TypeOrmModule.forFeature([Threepid]),
  ],
  providers: [GithubStrategy, DiscordStrategy, ThreepidService],
  controllers: [AuthController],
  exports: [ThreepidService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(AuthController);
  }
}
