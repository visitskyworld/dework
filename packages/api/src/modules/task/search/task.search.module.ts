import { Task } from "@dewo/api/models/Task";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { ConfigType } from "../../app/config";
import { TaskSearchService } from "./task.search.service";
import {
  TaskSearchCreatedEventHandler,
  TaskSearchUpdatedEventHandler,
} from "./task.search.eventHandlers";
import {
  OrganizationTaskSearchResolver,
  ProjectTaskSearchResolver,
  TaskSearchResolver,
  UserTaskSearchResolver,
} from "./task.search.resolver";
import { OrganizationModule } from "../../organization/organization.module";
import { RbacModule } from "../../rbac/rbac.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService<ConfigType>) => ({
        node: config.get("ELASTICSEARCH_NODE"),
      }),
      inject: [ConfigService],
    }),
    OrganizationModule,
    RbacModule,
  ],
  providers: [
    TaskSearchService,
    TaskSearchCreatedEventHandler,
    TaskSearchUpdatedEventHandler,
    TaskSearchResolver,
    OrganizationTaskSearchResolver,
    ProjectTaskSearchResolver,
    UserTaskSearchResolver,
  ],
  exports: [TaskSearchService],
})
export class TaskSearchModule {}
