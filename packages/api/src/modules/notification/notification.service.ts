import { Notification } from "@dewo/api/models/Notification";
import { NotificationReadMarker } from "@dewo/api/models/NotificationReadMarker";
import { TaskStatus } from "@dewo/api/models/Task";
import { User } from "@dewo/api/models/User";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { InviteAcceptedEvent } from "../invite/invite.events";
import {
  PaymentConfirmedEvent,
  PaymentCreatedEvent,
} from "../payment/payment.events";
import {
  TaskApplicationCreatedEvent,
  TaskApplicationDeletedEvent,
  TaskCreatedEvent,
  TaskSubmissionCreatedEvent,
  TaskUpdatedEvent,
} from "../task/task.events";

const notUser = (userId?: string) => (userToFilter: User) =>
  userToFilter.id !== userId;
const toId = (user: User) => user.id;

@Injectable()
export class NotificationService {
  private logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
    @InjectRepository(NotificationReadMarker)
    private readonly readMarkerRepo: Repository<NotificationReadMarker>
  ) {}

  public async processTaskUpdatedEvent(event: TaskUpdatedEvent) {
    const task = event.task;

    this.logger.debug(
      `Process updated task: ${JSON.stringify({
        taskId: task.id,
        diff: event.diff,
      })}`
    );

    if (event.diff.has("status")) {
      if (event.task.status === TaskStatus.IN_PROGRESS) {
        await this.batchSend(
          `Task in progress: ${task.name}`,
          task.owners.filter(notUser(event.userId)).map(toId),
          task.id
        );
      }

      if (event.task.status === TaskStatus.IN_REVIEW) {
        await this.batchSend(
          `Task ready for review: ${task.name}`,
          task.owners.filter(notUser(event.userId)).map(toId),
          task.id
        );
      }
    }

    if (event.diff.has("assignees")) {
      const assigneesToNotify = event.task.assignees.filter(
        (assignee) =>
          !event.prevTask.assignees.some((a) => a.id === assignee.id)
      );

      if (assigneesToNotify.length) {
        await this.batchSend(
          `You’ve been assigned: ${task.name}`,
          assigneesToNotify.filter(notUser(event.userId)).map(toId),
          task.id
        );

        await this.batchSend(
          `${assigneesToNotify.map((u) => u.username).join(",")} ${
            assigneesToNotify.length === 1 ? "has" : "have"
          } been assigned: ${task.name}`,
          event.task.owners.filter(notUser(event.userId)).map(toId),
          task.id
        );
      }
    }

    if (event.diff.has("owners")) {
      const ownersToNotify = event.task.owners.filter(
        (owner) => !event.prevTask.owners.includes(owner)
      );

      if (ownersToNotify.length) {
        await this.batchSend(
          `You’ve been added as a reviewer: ${task.name}`,
          ownersToNotify.filter(notUser(event.userId)).map(toId),
          task.id
        );
      }
    }
  }

  public async processTaskCreatedEvent(event: TaskCreatedEvent) {
    const task = event.task;

    this.logger.debug(
      `Process created task: ${JSON.stringify({
        taskId: task.id,
        diff: event.diff,
      })}`
    );

    await this.batchSend(
      `You’ve been assigned: ${task.name}`,
      event.task.assignees.filter(notUser(event.userId)).map(toId),
      task.id
    );

    await this.batchSend(
      `You’ve been added as a reviewer: ${task.name}`,
      event.task.owners.filter(notUser(event.userId)).map(toId),
      task.id
    );
  }

  public async processTaskApplicationCreatedEvent(
    event: TaskApplicationCreatedEvent
  ) {
    await this.batchSend(
      `${(await event.application.user).username} has applied to: ${
        event.task.name
      }`,
      event.task.owners.filter(notUser(event.application.userId)).map(toId),
      event.task.id
    );
  }

  public async processTaskApplicationDeletedEvent(
    event: TaskApplicationDeletedEvent
  ) {
    if (event.application.userId !== event.userId) {
      await this.batchSend(
        `Task Application rejected: ${event.task.name}`,
        [event.application.userId],
        event.task.id
      );
    }
  }

  public async processTaskSubmissionCreatedEvent(
    event: TaskSubmissionCreatedEvent
  ) {
    await this.batchSend(
      `${(await event.submission.user).username} has submitted work for: ${
        event.task.name
      }`,
      event.task.owners.filter(notUser(event.submission.userId)).map(toId),
      event.task.id
    );
  }

  public async processInviteAcceptedEvent(event: InviteAcceptedEvent) {
    const inviter = await event.invite.inviter;
    const task = await event.invite.task;
    const project = await (task?.project ?? event.invite.project);
    const organization = await (project?.organization ??
      event.invite.organization);

    await this.batchSend(
      `${event.user.username} has joined ${organization?.name}`,
      [inviter.id],
      (
        await event.invite.task
      )?.id
    );
  }

  public async processPaymentCreatedEvent(event: PaymentCreatedEvent) {
    await this.batchSend(
      `Task reward is processing payment: ${event.task?.name}`,
      event.task.assignees.filter(notUser(event.userId)).map(toId),
      event.task.id
    );
  }

  public async processPaymentConfirmedEvent(event: PaymentConfirmedEvent) {
    if (!event.task) {
      throw new Error("No task found when confirming a Payment.");
    }

    await this.batchSend(
      `Task reward has been paid: ${event.task?.name}`,
      event.task.assignees.map((u) => u.id),
      event.task.id
    );
  }

  public async send(
    data: Pick<Notification, "message" | "userId" | "taskId">
  ): Promise<Notification> {
    const [notification] = await this.batchSend(
      data.message,
      [data.userId],
      data.taskId
    );
    return notification;
  }

  private async batchSend(
    message: string,
    userIds: string[],
    taskId?: string
  ): Promise<Notification[]> {
    const created = await this.repo.save(
      userIds.map((userId) => ({ message, userId, taskId }))
    );

    return this.repo.findByIds(created.map((n) => n.id));
  }

  public async findById(id: string): Promise<Notification | undefined> {
    return this.repo.findOne(id);
  }

  public async archive(notification: Notification): Promise<Notification> {
    notification.archivedAt = new Date();
    return this.repo.save(notification);
  }

  public async markRead(userId: string, readAt: Date) {
    await this.readMarkerRepo.upsert(
      { userId, readAt },
      { conflictPaths: ["userId"] }
    );
  }

  public async getNotifications(userId: string): Promise<Notification[]> {
    return this.repo
      .createQueryBuilder("notification")
      .leftJoinAndSelect("notification.task", "task")
      .leftJoinAndSelect("task.project", "project")
      .leftJoinAndSelect("project.organization", "organization")
      .where("notification.userId = :userId", { userId })
      .andWhere("notification.archivedAt IS NULL")
      .getMany();
  }

  public async getNotificationUnreadCount(userId: string): Promise<number> {
    return this.repo
      .createQueryBuilder("notification")
      .leftJoin(
        NotificationReadMarker,
        "readMarker",
        "readMarker.userId = notification.userId"
      )
      .where("notification.userId = :userId", { userId })
      .andWhere("notification.archivedAt IS NULL")
      .andWhere(
        new Brackets((qb) =>
          qb
            .where("readMarker.userId IS NULL")
            .orWhere("readMarker.readAt < notification.createdAt")
        )
      )
      .getCount();
  }
}
