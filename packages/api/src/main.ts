import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./modules/app/app.module";
// import { DatabaseService } from "./testing/Database";

async function bootstrap() {
  const port = process.env.PORT || 8080;

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  // const database = app.get(DatabaseService);
  // await database.connection.dropDatabase();
  // await database.connection.synchronize();
  await app.listen(port);
}

bootstrap();
