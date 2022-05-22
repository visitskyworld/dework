import { Task, TaskPriority, TaskStatus } from "@dewo/api/models/Task";
import { TaskViewSortBy, TaskViewSortByField } from "@dewo/api/models/TaskView";
import { Bulk } from "@elastic/elasticsearch/api/requestParams";
import { SearchResponse } from "@elastic/elasticsearch/api/types";
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
import * as ms from "milliseconds";
import { Language } from "@dewo/api/models/enums/Language";
import { formatFixed } from "@ethersproject/bignumber";
import { DateRangeFilter } from "./dto/SearchTasksInput";

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
  language: Language;
  sortKey: string;
  createdAt: string;
  doneAt: string | undefined;
  dueDate: string | undefined;
  projectId: string;
  parentTaskId: string | undefined;
  spam: boolean;
  public: boolean;
  reward: number | undefined;
  featured: boolean;
  votes: number;

  tagIds: string[];
  skillIds: string[];
  roleIds: string[];
  organizationId: string;
  assigneeIds: string[];
  ownerIds: string[];
  applicantIds: string[];
}

const toId = (x: { id: string }) => x.id;

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
        // https://gist.github.com/vrsandeep/f2cf494b2b407aaf4b904389f8fe83a3
        settings: {
          analysis: {
            tokenizer: {
              ngram_tokenizer: {
                type: "ngram",
                min_gram: "3",
                max_gram: "4",
                token_chars: ["letter", "digit"],
              },
            },
            analyzer: {
              ngram_analyzer: {
                tokenizer: "ngram_tokenizer",
                type: "custom",
                filter: ["lowercase"],
              },
            },
          },
        },
        mappings: {
          properties: {
            name: {
              type: "text",
              term_vector: "yes",
              analyzer: "ngram_analyzer",
            },
            status: { type: "keyword" },
            language: { type: "keyword" },
            priority: { type: "byte" },
            reward: { type: "float" },
            spam: { type: "boolean" },
            public: { type: "boolean" },
            sortKey: { type: "text", fielddata: true },
            createdAt: { type: "date" },
            doneAt: { type: "date" },
            dueDate: { type: "date" },
            assigneeIds: { type: "keyword" },
            ownerIds: { type: "keyword" },
            applicantIds: { type: "keyword" },
            tagIds: { type: "keyword" },
            skillIds: { type: "keyword" },
            roleIds: { type: "keyword" },
            parentTaskId: { type: "keyword" },
            projectId: { type: "keyword" },
            organizationId: { type: "keyword" },
            featured: { type: "boolean" },
          },
        },
      },
    });
  }

  public async deleteIndex() {
    await this.elasticsearch.indices.delete({ index: this.indexName });
  }

  public async index(tasks: Task[], refresh: boolean = false) {
    if (!tasks.length) return;
    this.logger.debug(
      `Indexing tasks: ${JSON.stringify({ count: tasks.length })}`
    );

    const projectIds = _.uniq(tasks.map((t) => t.projectId));
    const isProjectPrivate = await this.rbacService.isProjectsPrivate(
      projectIds
    );

    const roles = await this.rbacService.findRolesForTasks(
      tasks.map((t) => t.id)
    );

    const documents = await Promise.all(
      tasks.map((t) =>
        !!t.deletedAt
          ? undefined
          : this.toDocument(
              t,
              !isProjectPrivate[t.projectId],
              roles[t.id]?.map((r) => r.id) ?? []
            )
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
    name?: string;
    statuses?: TaskStatus[];
    priorities?: TaskPriority[];
    languages?: Language[];
    projectIds?: string[];
    roleIds?: string[];
    ownerIds?: (string | null)[];
    assigneeIds?: (string | null)[];
    applicantIds?: string[];
    parentTaskId?: null;
    tagIds?: string[];
    skillIds?: string[];
    hasReward?: boolean;
    spam?: boolean;
    public?: boolean;
    featured?: boolean;
    doneAt?: DateRangeFilter;
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

    const sort = [
      ...(!!q.name ? [{ _score: "desc" }] : []),
      { [q.sortBy.field]: q.sortBy.direction.toLowerCase() },
      ...(q.sortBy.field !== TaskViewSortByField.createdAt
        ? [{ createdAt: "desc" }]
        : []),
    ];
    const startedAt = Date.now();
    const response = await this.elasticsearch.search<
      SearchResponse<IndexedTask>
    >({
      index: this.indexName,
      body: {
        size,
        sort,
        search_after: !!q.cursor ? this.fromCursor(q.cursor) : undefined,
        track_total_hits: 1000,
        query: {
          bool: {
            must: [
              ...(!!q.name ? [{ match: { name: { query: q.name } } }] : []),
              ...(q.hasReward === true
                ? [{ exists: { field: "reward" } }]
                : []),
            ],
            must_not: [
              ...(q.hasReward === false
                ? [{ exists: { field: "reward" } }]
                : []),
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
              ...(Object.keys(q.doneAt ?? {}) as (keyof DateRangeFilter)[]).map(
                (op) => ({
                  range: { doneAt: { [op]: q.doneAt![op] } },
                })
              ),
              ...(!!q.statuses ? [{ terms: { status: q.statuses } }] : []),
              ...(!!q.languages ? [{ terms: { language: q.languages } }] : []),
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

              !!q.ownerIds?.filter((id) => !!id).length &&
                this.toTermSetFilter(
                  "ownerIds",
                  q.ownerIds?.filter((id) => !!id)
                ),
              !!q.assigneeIds?.filter((id) => !!id).length &&
                this.toTermSetFilter(
                  "assigneeIds",
                  q.assigneeIds?.filter((id) => !!id)
                ),
              this.toTermSetFilter(
                "tagIds",
                q.tagIds?.filter((id) => !!id)
              ),
              this.toTermSetFilter(
                "applicantIds",
                q.applicantIds?.filter((id) => !!id)
              ),
              this.toTermSetFilter(
                "skillIds",
                q.skillIds?.filter((id) => !!id)
              ),
              this.toTermSetFilter(
                "roleIds",
                q.roleIds?.filter((id) => !!id)
              ),
              ...(q.spam !== undefined ? [{ match: { spam: q.spam } }] : []),
              ...(q.featured !== undefined
                ? [{ match: { featured: q.featured } }]
                : []),
              ...(q.public !== undefined
                ? [{ match: { public: q.public } }]
                : []),
            ].filter((f) => !!f),
          },
        },
      },
    });

    const results = response.body.hits.hits
      .map((hit) => hit._source)
      .filter((s): s is IndexedTask => !!s);

    const cursor =
      results.length === size
        ? this.toCursor(_.last(response.body.hits.hits)!.sort)
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
        .leftJoinAndSelect("task.skills", "skill")
        .leftJoinAndSelect("task.reward", "reward")
        .leftJoinAndSelect("reward.payments", "rewardPayment")
        .leftJoinAndSelect("rewardPayment.payment", "payment")
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

  private async toDocumentReward(task: Task): Promise<number | undefined> {
    const reward = await task.reward;
    if (!reward) return undefined;

    const numDecimalsInUsdPeg = 6;

    if (reward.peggedToUsd) {
      return Number(formatFixed(reward.amount, numDecimalsInUsdPeg));
    }

    const token = await reward.token;
    if (!!token.usdPrice) {
      return Number(formatFixed(reward.amount, token.exp)) * token.usdPrice;
    }

    const reallyLowUsdPricePerUnpeggedToken = Math.pow(10, -6);
    return (
      Number(formatFixed(reward.amount, token.exp)) *
      reallyLowUsdPricePerUnpeggedToken
    );
  }

  private async toDocument(
    task: Task,
    isPublic: boolean,
    roleIds: string[]
  ): Promise<IndexedTask> {
    const [project, reactions, skills, applications, reward] =
      await Promise.all([
        task.project,
        task.reactions,
        task.skills,
        task.applications,
        this.toDocumentReward(task),
      ]);
    const organization = await project.organization;

    const demoOrTestRegex = /(demo|test)/i;
    const chineseRegex = /[\u4e00-\u9fa5]/g;
    const japaneseRegex = /[ぁ-ん]/g;
    return {
      ..._.pick(task, ["id", "name", "status", "sortKey", "projectId"]),
      priority: TaskPriorityNumber[task.priority],
      createdAt: task.createdAt.toISOString(),
      doneAt: task.doneAt?.toISOString(),
      dueDate: task.doneAt?.toISOString(),
      parentTaskId: task.parentTaskId,
      organizationId: organization.id,
      tagIds: task.tags.map(toId),
      skillIds: skills.map(toId),
      roleIds,
      assigneeIds: task.assignees.map(toId),
      ownerIds: task.owners.map(toId),
      applicantIds: applications.map((a) => a.userId),
      featured: task.featured,
      public: isPublic,
      reward,
      votes: reactions.filter((r) => r.reaction === ":arrow_up_small:").length,
      spam:
        [task.name, project.name, organization.name].some((s) =>
          demoOrTestRegex.test(s)
        ) ||
        moment(task.createdAt).diff(moment(project.createdAt)) < ms.hours(2),
      language: [task.name, project.name, organization.name].some(
        (s) => chineseRegex.test(s) && !japaneseRegex.test(s)
      )
        ? Language.CHINESE
        : Language.ENGLISH,
    };
  }

  private toTermSetFilter(name: string, value: unknown[] | undefined) {
    if (!value) return undefined;
    return {
      terms_set: {
        [name]: { terms: value, minimum_should_match_script: { source: "1" } },
      },
    };
  }

  private toCursor(data: any): string {
    return Buffer.from(JSON.stringify(data)).toString("base64");
  }

  private fromCursor(cursor: string): any {
    return JSON.parse(Buffer.from(cursor, "base64").toString());
  }
}
