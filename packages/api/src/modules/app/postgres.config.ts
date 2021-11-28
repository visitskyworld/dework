import * as path from "path";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigType } from "./config";

export const postgresConfig = (
  configService: ConfigService<ConfigType>
): TypeOrmModuleOptions => ({
  type: "postgres",
  username: configService.get("POSTGRES_USER"),
  password: configService.get("POSTGRES_PASSWORD"),
  host: configService.get("POSTGRES_HOST"),
  port: configService.get<number>("POSTGRES_PORT"),
  database: configService.get("POSTGRES_DATABASE"),
  entities: [path.join(__dirname, "../../models/**/*.{js,ts}")],
  // Note(fant): "1*" so that we only grab migrations
  // synchronize: process.env.NODE_ENV === 'test',
  migrations: [path.join(process.cwd(), "src/migrations/**/1*.ts")],
  migrationsRun: false,
  logging: process.env.DEBUG === "*" ? "all" : ["error"],
  extra: {
    connectionLimit: 2,
  },
});
