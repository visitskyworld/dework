import { Notification } from "@dewo/api/models/Notification";
import { NotificationReadMarker } from "@dewo/api/models/NotificationReadMarker";
import { TaskStatus } from "@dewo/api/models/Task";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { TaskUpdatedEvent } from "../task/task.events";

@Injectable()
export class NotificationService {
  private logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
    @InjectRepository(NotificationReadMarker)
    private readonly readMarkerRepo: Repository<NotificationReadMarker>
  ) {}

  public async process(event: TaskUpdatedEvent) {
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
          task.owners.filter((u) => u.id !== event.userId).map((u) => u.id),
          task.id
        );
      }

      if (event.task.status === TaskStatus.IN_REVIEW) {
        await this.batchSend(
          `Task ready for review: ${task.name}`,
          task.owners.filter((u) => u.id !== event.userId).map((u) => u.id),
          task.id
        );
      }
    }
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
    taskId: string
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
      .innerJoinAndSelect("notification.task", "task")
      .innerJoinAndSelect("task.project", "project")
      .innerJoinAndSelect("project.organization", "organization")
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
