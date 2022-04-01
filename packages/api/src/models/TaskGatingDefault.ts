import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";
import { Project } from "./Project";
import { Role } from "./rbac/Role";

export enum TaskGatingType {
  APPLICATION = "APPLICATION",
  ROLES = "ROLES",
  OPEN_SUBMISSION = "OPEN_SUBMISSION",
}

registerEnumType(TaskGatingType, { name: "TaskGatingType" });

@Entity()
@ObjectType()
@Index(["userId", "projectId"], { unique: true })
export class TaskGatingDefault extends Audit {
  @Column("enum", { enum: TaskGatingType })
  @Field(() => TaskGatingType)
  public type!: TaskGatingType;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public user!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public userId!: string;

  @JoinColumn()
  @ManyToOne(() => Project)
  @Field(() => Project)
  public project!: Promise<Project>;
  @Column({ type: "uuid" })
  @Field()
  public projectId!: string;

  @ManyToMany(() => Role)
  @JoinTable({ name: "task_gating_default_role" })
  @Field(() => [Role])
  public roles!: Promise<Role[]>;
}
