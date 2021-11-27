import * as path from "path";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigType } from "./config";

export const mysqlConfig = (
  configService: ConfigService<ConfigType>
): TypeOrmModuleOptions => ({
  type: "mysql",
  username: configService.get("MYSQL_USER"),
  password: configService.get("MYSQL_PASSWORD"),
  host: configService.get("MYSQL_HOST"),
  port: configService.get<number>("MYSQL_PORT"),
  database: configService.get("MYSQL_DATABASE"),
  entities: [path.join(__dirname, "../../models/**/*.{js,ts}")],
  // Note(fant): "1*" so that we only grab migrations
  // synchronize: process.env.NODE_ENV === 'test',
  migrations: [path.join(process.cwd(), "src/migrations/**/1*.ts")],
  migrationsRun: false,
  timezone: "Z",
  logging: process.env.DEBUG === "*" ? "all" : ["error"],
  extra: {
    connectionLimit: 2,
  },
  charset: "utf8mb4",
});
