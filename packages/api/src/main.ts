import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./modules/app/app.module";

async function bootstrap() {
  const port = process.env.PORT || 8080;

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  if (!!process.env.RUN_MIGRATIONS) {
    // const database = app.get(MigrationService);
    // await database.migrate();
    // await database.connection.synchronize();
  }
  await app.listen(port);
}

bootstrap();
