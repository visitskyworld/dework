import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./modules/app/app.module";
import { MigrationService } from "./modules/app/migration/migration.service";
import "source-map-support/register";

async function bootstrap() {
  const port = process.env.PORT || 8080;

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const database = app.get(MigrationService);
  if (process.env.RUN_DB_SYNCHRONIZATION === String(true)) {
    await database.connection.synchronize();
  } else if (process.env.RUN_MIGRATIONS === String(true)) {
    await database.migrate();
  }
  await app.listen(port);
}

bootstrap();
