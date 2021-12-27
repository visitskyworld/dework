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
import { DatabaseModule, DatabaseService } from "./Database";

export async function getTestApp(): Promise<INestApplication> {
  const logger = new ConsoleLogger();
  logger.setLogLevels([]);

  const module = await Test.createTestingModule({
    imports: [...AppModuleImports!, FixturesModule, DatabaseModule],
    providers: [GraphQLTestClient, WebhookTestClient],
  })
    .setLogger(logger)
    .compile();
  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  const database = app.get(DatabaseService);
  await database.connection.dropDatabase();
  await database.connection.synchronize();
  await app.init();

  logger.setLogLevels(["debug"]);
  return app;
}
