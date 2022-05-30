import { Injectable, Logger, Module } from "@nestjs/common";
import { AppBootstrapModuleImports } from "../modules/app/app.module";
import { NestFactory } from "@nestjs/core";

import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TaskSearchService } from "../modules/task/search/task.search.service";
import { Task } from "../models/Task";
import { TaskSearchModule } from "../modules/task/search/task.search.module";

@Injectable()
export class IndexTasksService {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly taskSearch: TaskSearchService,
    @InjectRepository(Task)
    private readonly repo: Repository<Task>
  ) {}

  public async run() {
    // await this.taskSearch.deleteIndex().catch(() => {});
    // await this.taskSearch.createIndex();

    let offset = 0;
    const batchSize = 500;
    while (true) {
      const batch = await this.repo
        .createQueryBuilder("task")
        .take(batchSize)
        .skip(offset)
        .orderBy("task.createdAt", "ASC")
        .getMany();

      this.logger.log(
        `Indexing tasks: ${offset} - ${offset + batch.length - 1}`
      );

      const tasks = await this.repo
        .createQueryBuilder("task")
        .leftJoinAndSelect("task.assignees", "assignee")
        .leftJoinAndSelect("task.owners", "owner")
        .leftJoinAndSelect("task.tags", "tag")
        .leftJoinAndSelect("task.applications", "application")
        .leftJoinAndSelect("task.skills", "skill")
        .leftJoinAndSelect("task.rewards", "reward")
        .leftJoinAndSelect("task.reactions", "reactions")
        .leftJoinAndSelect("reward.token", "token")
        .innerJoinAndSelect("task.project", "project")
        .innerJoinAndSelect("project.organization", "organization")
        .where("task.id IN (:...ids)", { ids: batch.map((b) => b.id) })
        .orderBy("task.createdAt", "ASC")
        .getMany();

      await this.taskSearch.index(tasks);

      if (batch.length !== batchSize) break;
      offset += batchSize;
    }
  }
}

@Module({
  imports: [
    ...AppBootstrapModuleImports!,
    TaskSearchModule,
    TypeOrmModule.forFeature([Task]),
  ],
  providers: [IndexTasksService],
})
export class IndexTasksModule {}

async function run() {
  const app = await NestFactory.create(IndexTasksModule);
  await app.init();
  const service = app.get(IndexTasksService);
  await service.run();
  await app.close();
  process.exit(0);
}

run();
