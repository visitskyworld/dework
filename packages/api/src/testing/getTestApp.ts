import {
  ConsoleLogger,
  INestApplication,
  ValidationPipe,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { GraphQLTestClient } from "./GraphQLTestClient";
import { WebhookTestClient } from "./WebhookTestClient";
import { FixturesModule } from "./Fixtures";
import { AppModuleImports } from "../modules/app/app.module";
import { MigrationService } from "../modules/app/migration/migration.service";
import { MigrationModule } from "../modules/app/migration/migration.module";

export async function getTestApp(): Promise<INestApplication> {
  const logger = new ConsoleLogger();
  logger.setLogLevels([]);

  const module = await Test.createTestingModule({
    imports: [...AppModuleImports!, FixturesModule, MigrationModule],
    providers: [GraphQLTestClient, WebhookTestClient],
  })
    .setLogger(logger)
    .compile();
  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  const database = app.get(MigrationService);
  await database.connection.dropDatabase();
  await database.connection.synchronize();
  // await database.migrate();
  await app.init();

  logger.setLogLevels(["debug"]);
  return app;
}
