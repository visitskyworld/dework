import * as path from "path";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigType } from "./config";

export const postgresConfig = (
  configService: ConfigService<ConfigType>
): TypeOrmModuleOptions => ({
  type: "postgres",
  url: configService.get("POSTGRES_URL"),
  cache: {
    tableName: "typeorm_query_cache",
  },
  entities: [path.join(__dirname, "../../models/**/*.{js,ts}")],
  // Note(fant): "1*" so that we only grab migrations
  // synchronize: process.env.NODE_ENV === 'test',
  migrations: [path.join(__dirname, "../../migrations/**.{js,ts}")],
  migrationsRun: false,
  logging: process.env.DEBUG === "*" ? "all" : ["error"],
  extra: {
    connectionLimit: 2,
  },
});
