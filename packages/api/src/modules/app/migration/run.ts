import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import _ from "lodash";
import { MigrationModule } from "./migration.module";
import { MigrationService } from "./migration.service";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(MigrationModule);
  const service = app.get(MigrationService);

  const firstArgIndex = 2;
  const migrateCommand = process.argv[firstArgIndex];
  const commandMap = new Map<string, () => Promise<void>>([
    ["up", () => service.migrate()],
    ["drop", () => service.dropDatabase()],
    ["revert", () => service.revert()],
  ]);

  const command = commandMap.get(migrateCommand);
  if (!_.isNil(command)) {
    await command();
  } else {
    throw new Error('Expected 1st argument to be "up" or "drop", or "revert"');
  }
  await app.close();
}

bootstrap().catch((error: Error) => {
  Logger.error(error.message);
  process.exit(1);
});
