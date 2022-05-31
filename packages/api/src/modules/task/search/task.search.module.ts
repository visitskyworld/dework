import { Task } from "@dewo/api/models/Task";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { ConfigType } from "../../app/config";
import { TaskSearchService } from "./task.search.service";
import {
  TaskSearchApplicationCreatedEventHandler,
  TaskSearchApplicationDeletedEventHandler,
  TaskSearchCreatedEventHandler,
  TaskSearchDeletedEventHandler,
  TaskSearchRuleCreatedEventHandler,
  TaskSearchRuleDeletedEventHandler,
  TaskSearchUpdatedEventHandler,
} from "./task.search.eventHandlers";
import {
  ProjectTaskCountResolver,
  TaskSearchResolver,
} from "./task.search.resolver";
import { OrganizationModule } from "../../organization/organization.module";
import { RbacModule } from "../../rbac/rbac.module";
import { WorkspaceModule } from "../../workspace/workspace.module";

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
    WorkspaceModule,
    RbacModule,
  ],
  providers: [
    TaskSearchService,
    TaskSearchCreatedEventHandler,
    TaskSearchUpdatedEventHandler,
    TaskSearchDeletedEventHandler,
    TaskSearchApplicationCreatedEventHandler,
    TaskSearchApplicationDeletedEventHandler,
    TaskSearchRuleDeletedEventHandler,
    TaskSearchRuleCreatedEventHandler,
    TaskSearchResolver,
    ProjectTaskCountResolver,
  ],
  exports: [TaskSearchService],
})
export class TaskSearchModule {}
