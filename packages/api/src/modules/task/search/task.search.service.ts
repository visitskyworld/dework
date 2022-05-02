import { Task, TaskPriority, TaskStatus } from "@dewo/api/models/Task";
import { TaskViewSortBy } from "@dewo/api/models/TaskView";
import { Bulk } from "@elastic/elasticsearch/api/requestParams";
import { SearchResponse } from "@elastic/elasticsearch/api/types";
import * as ms from "milliseconds";
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { InjectRepository } from "@nestjs/typeorm";
import _ from "lodash";
import moment from "moment";
import { Repository } from "typeorm";
import { RbacService } from "../../rbac/rbac.service";

const TaskPriorityNumber: Record<TaskPriority, number> = {
  [TaskPriority.NONE]: 0,
  [TaskPriority.LOW]: 1,
  [TaskPriority.MEDIUM]: 2,
  [TaskPriority.HIGH]: 3,
  [TaskPriority.URGENT]: 4,
};

interface IndexedTask {
  id: string;
  name: string;
  status: TaskStatus;
  priority: number;
  sortKey: string;
  createdAt: string;
  doneAt: string | undefined;
  dueDate: string | undefined;
  projectId: string;
  parentTaskId: string | undefined;
  hasReward: boolean;
  spam: boolean;
  public: boolean;
  reward: number | undefined;

  tagIds: string[];
  organizationId: string;
  assigneeIds: string[];
  ownerIds: string[];
}

@Injectable()
export class TaskSearchService implements OnModuleInit {
  private readonly logger = new Logger(this.constructor.name);
  private readonly indexName = "tasks-220501";
  private readonly maxSize = 50;

  constructor(
    private readonly elasticsearch: ElasticsearchService,
    private readonly rbacService: RbacService,
    @InjectRepository(Task)
    private readonly repo: Repository<Task>
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === "test") {
      await this.deleteIndex().catch(() => {});
    }

    const exists = await this.elasticsearch.indices.exists({
      index: this.indexName,
    });
    if (exists.statusCode !== HttpStatus.OK) {
      await this.createIndex();
    } else {
      this.logger.log(
        `Index '${this.indexName}' already exists in ElasticSearch, skipping create`
      );
    }
  }

  public async createIndex() {
    this.logger.log(`Creating '${this.indexName}' index in ElasticSearch`);
    await this.elasticsearch.indices.create({
      index: this.indexName,
      body: {
        mappings: {
          properties: {
            status: { type: "keyword" },
            priority: { type: "byte" },
            reward: { type: "long" },
            spam: { type: "boolean" },
            public: { type: "boolean" },
            hasReward: { type: "boolean" },
            sortKey: { type: "text", fielddata: true },
            createdAt: { type: "date" },
            doneAt: { type: "date" },
            dueDate: { type: "date" },
            assigneeIds: { type: "keyword" },
            ownerIds: { type: "keyword" },
            tagIds: { type: "keyword" },
            parentTaskId: { type: "keyword" },
            projectId: { type: "keyword" },
            organizationId: { type: "keyword" },
          },
        },
      },
    });
  }

  public async deleteIndex() {
    await this.elasticsearch.indices.delete({ index: this.indexName });
  }

  public async index(tasks: Task[], refresh: boolean = false) {
    this.logger.debug(
      `Indexing tasks: ${JSON.stringify({ count: tasks.length })}`
    );

    const projectIds = _.uniq(tasks.map((t) => t.projectId));
    const isProjectPrivate = await this.rbacService.isProjectsPrivate(
      projectIds
    );

    const documents = await Promise.all(
      tasks.map((t) =>
        !!t.deletedAt
          ? undefined
          : this.toDocument(t, !isProjectPrivate[t.projectId])
      )
    );

    const bulk: Bulk = {
      index: this.indexName,
      refresh,
      body: tasks
        .map((t, index) =>
          !!t.deletedAt
            ? [{ delete: { _index: this.indexName, _id: t.id } }]
            : [
                { index: { _index: this.indexName, _id: t.id } },
                documents[index]!,
              ]
        )
        .flat(),
    };
    const response = await this.elasticsearch.bulk(bulk);

    if (response.body.errors) {
      const errorMessage = `Error adding items to the '${this.indexName}' index`;
      this.logger.error(
        `Error adding items to the '${this.indexName}' index: ${JSON.stringify(
          response.body.errors
        )}`
      );
      throw new Error(errorMessage);
    }
  }

  public async refresh() {
    await this.elasticsearch.indices.refresh({ index: this.indexName });
  }

  public async search(q: {
    statuses?: TaskStatus[];
    priorities?: TaskPriority[];
    projectIds?: string[];
    ownerIds?: (string | null)[];
    assigneeIds?: (string | null)[];
    parentTaskId?: null;
    tagIds?: string[];
    hasReward?: boolean;
    spam?: boolean;
    public?: boolean;

    size?: number;
    sortBy: TaskViewSortBy;
    cursor?: string;
  }): Promise<{
    tasks: Task[];
    cursor?: string;
    total: number;
  }> {
    const size = q.size ?? this.maxSize;
    this.logger.debug(`Searching tasks: ${JSON.stringify({ query: q, size })}`);

    if (size > this.maxSize) {
      throw new BadRequestException(`Size must be less than ${this.maxSize}`);
    }

    const startedAt = Date.now();
    const response = await this.elasticsearch.search<
      SearchResponse<IndexedTask>
    >({
      index: this.indexName,
      body: {
        size,
        sort: [{ [q.sortBy.field]: q.sortBy.direction.toLowerCase() }],
        search_after: !!q.cursor ? this.fromCursor(q.cursor) : undefined,
        track_total_hits: 1000,
        query: {
          bool: {
            must_not: [
              ...(q.ownerIds?.includes(null)
                ? [{ exists: { field: "ownerIds" } }]
                : []),
              ...(q.assigneeIds?.includes(null)
                ? [{ exists: { field: "assigneeIds" } }]
                : []),
              ...(q.parentTaskId === null
                ? [{ exists: { field: "parentTaskId" } }]
                : []),
            ],
            filter: [
              ...(!!q.statuses ? [{ terms: { status: q.statuses } }] : []),
              ...(!!q.priorities
                ? [
                    {
                      terms: {
                        priority: q.priorities.map(
                          (p) => TaskPriorityNumber[p]
                        ),
                      },
                    },
                  ]
                : []),
              ...(!!q.projectIds
                ? [{ terms: { projectId: q.projectIds } }]
                : []),
              ...(!!q.ownerIds?.filter((id) => !!id).length
                ? [
                    {
                      terms_set: {
                        ownerIds: {
                          terms: q.ownerIds.filter((id): id is string => !!id),
                          minimum_should_match_script: { source: "1" },
                        },
                      },
                    },
                  ]
                : []),
              ...(!!q.assigneeIds?.filter((id) => !!id).length
                ? [
                    {
                      terms_set: {
                        assigneeIds: {
                          terms: q.assigneeIds.filter(
                            (id): id is string => !!id
                          ),
                          minimum_should_match_script: { source: "1" },
                        },
                      },
                    },
                  ]
                : []),
              ...(!!q.tagIds
                ? [
                    {
                      terms_set: {
                        tagIds: {
                          terms: q.tagIds,
                          minimum_should_match_script: { source: "1" },
                        },
                      },
                    },
                  ]
                : []),
              ...(q.hasReward !== undefined
                ? [{ match: { hasReward: q.hasReward } }]
                : []),
              ...(q.spam !== undefined ? [{ match: { spam: q.spam } }] : []),
              ...(q.public !== undefined
                ? [{ match: { public: q.public } }]
                : []),
            ],
          },
        },
      },
    });

    const results = response.body.hits.hits
      .map((hit) => hit._source)
      .filter((s): s is IndexedTask => !!s);

    const cursor =
      results.length === size
        ? this.toCursor([_.last(results)![q.sortBy.field]])
        : undefined;
    const total =
      typeof response.body.hits.total === "number"
        ? response.body.hits.total
        : response.body.hits.total?.value ?? 0;

    this.logger.debug(
      `Found tasks: ${JSON.stringify({
        query: q,
        total,
        cursor,
        count: response.body.hits.hits.length,
        duration: Date.now() - startedAt,
      })}`
    );

    if (!results.length) return { tasks: [], total: 0 };
    return {
      cursor,
      total,
      tasks: await this.repo
        .createQueryBuilder("task")
        .leftJoinAndSelect("task.assignees", "assignee")
        .leftJoinAndSelect("task.owners", "owner")
        .leftJoinAndSelect("task.tags", "tag")
        .leftJoinAndSelect("task.reward", "reward")
        .leftJoinAndSelect("reward.payment", "payment")
        .leftJoinAndSelect("reward.token", "token")
        .leftJoinAndSelect("task.review", "review")
        .leftJoinAndSelect("task.reactions", "reaction")
        .leftJoinAndSelect("task.subtasks", "subtask")
        .leftJoinAndSelect("task.applications", "application")
        .leftJoinAndSelect("task.submissions", "submission")
        .innerJoinAndSelect("task.project", "project")
        .innerJoinAndSelect("project.organization", "organization")
        .where("task.id IN (:...ids)", { ids: results.map((r) => r.id) })
        .getMany()
        .then((tasks) =>
          // TODO(fant): move this into the SQL query
          // https://stackoverflow.com/a/35456954/12338002
          _.sortBy(tasks, (t) => results.findIndex((r) => r.id === t.id))
        ),
    };
  }

  private async toDocument(
    task: Task,
    isPublic: boolean
  ): Promise<IndexedTask> {
    const project = await task.project;
    const organization = await project.organization;
    return {
      ..._.pick(task, ["id", "name", "status", "sortKey", "projectId"]),
      priority: TaskPriorityNumber[task.priority],
      createdAt: task.createdAt.toISOString(),
      doneAt: task.doneAt?.toISOString(),
      dueDate: task.doneAt?.toISOString(),
      parentTaskId: task.parentTaskId,
      hasReward: !!task.rewardId,
      organizationId: organization.id,
      tagIds: task.tags.map((t) => t.id),
      assigneeIds: task.assignees.map((u) => u.id),
      ownerIds: task.owners.map((u) => u.id),
      public: isPublic,
      reward: undefined,
      spam:
        !!task.name.match(/(demo|test)/i) ||
        !!project.name.match(/(demo|test)/i) ||
        !!organization.name.match(/(demo|test)/i) ||
        moment(task.createdAt).diff(moment(project.createdAt)) < ms.hours(2),
    };
  }

  private toCursor(data: any): string {
    return Buffer.from(JSON.stringify(data)).toString("base64");
  }

  private fromCursor(cursor: string): any {
    return JSON.parse(Buffer.from(cursor, "base64").toString());
  }
}
