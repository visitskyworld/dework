import { Injectable, Logger, Module } from "@nestjs/common";
import { AppBootstrapModuleImports } from "../modules/app/app.module";
import { NestFactory } from "@nestjs/core";
import { Fixtures, FixturesModule } from "../testing/Fixtures";
import _ from "lodash";
import Bluebird from "bluebird";

@Injectable()
export class SeedDataService {
  private logger = new Logger(this.constructor.name);

  constructor(private readonly fixtures: Fixtures) {}

  public async run() {
    const num = 1000;
    await Bluebird.map(
      _.range(num),
      async (i) => {
        this.logger.debug(`[${i + 1} / ${num}] Creating project and task`);
        const project = await this.fixtures.createProject({
          createdAt: new Date(0),
        });
        await this.fixtures.createTask({
          projectId: project.id,
          reward: { amount: "1" },
        });
      },
      { concurrency: 20 }
    );
  }
}

@Module({
  imports: [...AppBootstrapModuleImports!, FixturesModule],
  providers: [SeedDataService],
})
export class SeedDataModule {}

async function run() {
  const app = await NestFactory.create(SeedDataModule);
  await app.init();
  const service = app.get(SeedDataService);
  await service.run();
  await app.close();
  process.exit(0);
}

run();
