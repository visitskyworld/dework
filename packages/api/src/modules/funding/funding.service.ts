import { FundingSession } from "@dewo/api/models/funding/FundingSession";
import { FundingVote } from "@dewo/api/models/funding/FundingVote";
import { Task, TaskStatus } from "@dewo/api/models/Task";
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import _ from "lodash";
import { Repository } from "typeorm";
import { PermalinkService } from "../permalink/permalink.service";
import { BigNumber } from "ethers";
import { TaskSearchService } from "../task/search/task.search.service";
import {
  TaskViewSortByDirection,
  TaskViewSortByField,
} from "@dewo/api/models/TaskView";
import { TaskService } from "../task/task.service";
import { CreateFundingSessionInput } from "./dto/CreateFundingSessionInput";
import { FundingSessionVoter } from "./dto/FundingSessionVoter";

@Injectable()
export class FundingService {
  private logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(FundingSession)
    private readonly sessionRepo: Repository<FundingSession>,
    @InjectRepository(FundingVote)
    private readonly voteRepo: Repository<FundingVote>,
    private readonly taskService: TaskService,
    private readonly taskSearchService: TaskSearchService,
    private readonly permalink: PermalinkService
  ) {}

  public async createSession(
    input: CreateFundingSessionInput
  ): Promise<FundingSession> {
    const session = await this.sessionRepo.save(input);
    if (!!input.projectIds.length) {
      await this.sessionRepo
        .createQueryBuilder()
        .relation("projects")
        .of(session)
        .add(input.projectIds);
    }
    return this.sessionRepo.findOneOrFail(session.id);
  }

  public async findById(id: string): Promise<FundingSession | undefined> {
    return this.sessionRepo.findOne(id);
  }

  public async vote(
    data: Pick<FundingVote, "weight" | "sessionId" | "taskId" | "userId">
  ): Promise<FundingVote> {
    const session = await this.sessionRepo.findOneOrFail(data.sessionId);
    if (!!session.closedAt) {
      throw new ForbiddenException("Funding session is closed");
    }

    const tasks = await this.getSessionTasks(session);
    if (!tasks.some((t) => t.id === data.taskId)) {
      throw new BadRequestException();
    }

    await this.voteRepo.upsert(data, {
      conflictPaths: ["userId", "sessionId", "taskId"],
    });
    return this.voteRepo.findOneOrFail(
      _.pick(data, ["userId", "sessionId", "taskId"])
    );
  }

  public async closeSession(id: string): Promise<FundingSession> {
    const session = await this.sessionRepo.findOneOrFail(id);
    if (!!session.closedAt) {
      throw new ForbiddenException("Funding session is closed");
    }

    const tasks = await this.getSessionTasks(session);
    const userWeightById = tasks.reduce<Record<string, number>>((acc, task) => {
      task.owners.forEach((owner) => {
        acc[owner.id] = (acc[owner.id] || 0) + 1;
      });
      return acc;
    }, {});
    const totalUserWeight = _.sum(Object.values(userWeightById));

    const votes = (await session.votes).filter((v) =>
      tasks.some((t) => t.id === v.taskId)
    );
    const totalVoteWeightByUserId = votes.reduce<Record<string, number>>(
      (acc, v) => ({ ...acc, [v.userId]: (acc[v.userId] || 0) + v.weight }),
      {}
    );

    const shareOfRewardByTaskId = votes.reduce<Record<string, number>>(
      (acc, v) => {
        const shareOfUser = v.weight / totalVoteWeightByUserId[v.userId];
        const userShareOfTotal =
          (userWeightById[v.userId] ?? 0) / totalUserWeight;
        return {
          ...acc,
          [v.taskId]: (acc[v.taskId] || 0) + shareOfUser / userShareOfTotal,
        };
      },
      {}
    );

    this.logger.log(
      `Completing funding session: ${JSON.stringify({
        session,
        userWeightById,
        totalVoteWeightByUserId,
        shareOfRewardByTaskId,
        totalUserWeight,
      })}`
    );

    for (const task of tasks) {
      const shareOfReward = shareOfRewardByTaskId[task.id];
      if (!shareOfReward) continue;

      const precision = 1_000_000;
      const amount = BigNumber.from(session.amount)
        .mul(Math.round(precision * shareOfReward))
        .div(precision)
        .toString();

      const subtask = await this.taskService.create({
        projectId: task.projectId,
        status: TaskStatus.DONE,
        parentTaskId: task.id,
        name: "Retroactive Funding",
        description: `[This reward was awarded as part of this funding session](${await this.permalink.get(
          session
        )})`,
        assignees: task.assignees,
        reward: {
          amount,
          tokenId: session.tokenId,
          fundingSessionId: session.id,
        },
      });

      this.logger.debug(
        `Created subtask for retroactive funding: ${JSON.stringify({
          amount,
          sessionId: session.id,
          taskId: task.id,
          subtaskId: subtask.id,
        })}`
      );
    }

    session.closedAt = new Date();
    await this.sessionRepo.save(session);
    return session;
  }

  private async getSessionTasks(session: FundingSession): Promise<Task[]> {
    const projects = await session.projects;
    const tasks: Task[] = [];
    let cursor: string | undefined;
    do {
      const page = await this.taskSearchService.search(
        {
          doneAt: { gte: session.startDate, lt: session.endDate },
          statuses: [TaskStatus.DONE],
          projectIds: projects.map((p) => p.id),
          cursor,
          parentTaskId: null,
        },
        {
          field: TaskViewSortByField.createdAt,
          direction: TaskViewSortByDirection.ASC,
        }
      );

      tasks.push(...page.tasks);
      cursor = page.cursor;
    } while (!!cursor);

    return tasks;
  }

  public async getVoters(sessionId: string): Promise<FundingSessionVoter[]> {
    const session = await this.sessionRepo.findOneOrFail(sessionId);
    const tasks = await this.getSessionTasks(session);

    const users = _.uniqBy(tasks.map((t) => t.owners).flat(), (u) => u.id);
    const reviewedTasksById = tasks.reduce<Record<string, number>>(
      (acc, task) => {
        task.owners.forEach((owner) => {
          acc[owner.id] = (acc[owner.id] || 0) + 1;
        });
        return acc;
      },
      {}
    );
    if (_.isEmpty(reviewedTasksById)) return [];
    const totalReviews = _.sum(Object.values(reviewedTasksById));

    const votes = await this.voteRepo
      .createQueryBuilder("vote")
      .innerJoinAndSelect("vote.user", "user")
      .where("vote.sessionId = :sessionId", { sessionId })
      .andWhere("vote.weight > 0")
      .getMany();
    const votesByUserId = _.groupBy(votes, (v) => v.userId);
    return _.sortBy(
      users.map((user) => ({
        user,
        votes: votesByUserId[user.id] ?? [],
        weight: (reviewedTasksById[user.id] ?? 0) / totalReviews,
      })),
      (u) => -u.weight
    );
  }
}
