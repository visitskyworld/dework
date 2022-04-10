import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import GraphQLUUID from "graphql-type-uuid";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";
import { Diff } from "deep-diff";
import { Task } from "./Task";

type AuditLogEventEntity = "Task";

export interface AuditLogEventEntityType {
  Task: Pick<Task, "status">;
}

@Entity()
@ObjectType()
export class AuditLogEvent<
  Entity extends AuditLogEventEntity = AuditLogEventEntity
> extends Audit {
  @Index()
  @Column()
  @Field()
  public entity!: Entity;

  @Index()
  @Column({ type: "uuid" })
  @Field(() => GraphQLUUID)
  public entityId!: string;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  public user?: Promise<User>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public userId?: string;

  @Column({ type: "uuid", nullable: true })
  @Field(() => GraphQLUUID, { nullable: true })
  public sessionId?: string;

  @Column("json")
  @Field(() => [GraphQLJSONObject])
  public diff!: Diff<AuditLogEventEntityType[Entity] | undefined>[];
}

export type TaskAuditLogEvent = AuditLogEvent<"Task">;
