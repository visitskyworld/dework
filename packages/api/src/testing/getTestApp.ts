import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { GraphQLTestClient } from "./GraphQLTestClient";
import { DatabaseService, FixturesModule } from "./Fixtures";
import { AppModuleImports } from "../modules/app/app.module";

export async function getTestApp(): Promise<INestApplication> {
  const module = await Test.createTestingModule({
    imports: [...AppModuleImports!, FixturesModule],
    providers: [GraphQLTestClient],
  }).compile();
  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  const database = app.get(DatabaseService);
  await database.connection.dropDatabase();
  await database.connection.synchronize();
  await app.init();
  return app;
}
