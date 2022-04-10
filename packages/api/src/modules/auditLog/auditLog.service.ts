import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  AuditLogEvent,
  AuditLogEventEntityType,
} from "@dewo/api/models/AuditLogEvent";
import { Task } from "@dewo/api/models/Task";
import * as DeepDiff from "deep-diff";
import _ from "lodash";

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(AuditLogEvent)
    private readonly eventRepo: Repository<AuditLogEvent>
  ) {}

  public async log<T extends Task>(
    oldEntity: T | undefined,
    newEntity: T | undefined,
    userId?: string,
    sessionId?: string
  ): Promise<AuditLogEvent | undefined> {
    this.logger.debug(
      `Creating audit log event: ${JSON.stringify({
        oldEntity,
        newEntity,
        userId,
        sessionId,
      })}`
    );

    const entity = newEntity || oldEntity;
    if (!entity) {
      throw new BadRequestException(
        "Cannot create audit log without old or new entity"
      );
    }

    const diff = DeepDiff.diff(
      this.transform(oldEntity),
      this.transform(newEntity)
    );

    if (!diff) return undefined;
    return this.eventRepo.save({
      entity: "Task",
      entityId: entity.id,
      userId,
      sessionId,
      diff,
    });
  }

  public async get(entity: Task): Promise<AuditLogEvent[]> {
    return this.eventRepo
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.user", "user")
      .where("event.entity = :entity", { entity: "Task" })
      .andWhere("event.entityId = :entityId", { entityId: entity.id })
      .orderBy("event.createdAt", "ASC")
      .getMany();
  }

  private transform(
    entity: Task | undefined
  ): AuditLogEventEntityType["Task"] | undefined {
    if (!entity) return undefined;
    return {
      ..._.pick(entity, [
        // "name",
        // "description",
        "status",
        // "storyPoints",
        // "projectId",
        // "deletedAt",
        // "dueDate",
        // "gating",
      ]),
      // assigneeIds: _.keyBy(entity.assignees.map((u) => u.id)),
      // ownerIds: _.keyBy(entity.owners.map((u) => u.id)),
      // tagIds: _.keyBy(entity.tags.map((u) => u.id)),
    };
  }
}
