import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Organization } from "./Organization";
import { Project } from "./Project";
import { TaskPriority, TaskStatus } from "./Task";
import { User } from "./User";

export enum TaskViewType {
  LIST = "LIST",
  BOARD = "BOARD",
}

export enum TaskViewSortByField {
  priority = "priority",
  sortKey = "sortKey",
  createdAt = "createdAt",
  dueDate = "dueDate",
  doneAt = "doneAt",
  reward = "reward",
  votes = "votes",
}

export enum TaskViewSortByDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export enum TaskViewGroupBy {
  status = "status",
}

export enum TaskViewField {
  status = "status",
  gating = "gating",
  number = "number",
  name = "name",
  priority = "priority",
  dueDate = "dueDate",
  createdAt = "createdAt",
  doneAt = "doneAt",
  skills = "skills",
  tags = "tags",
  reward = "reward",
  assignees = "assignees",
  button = "button",
}

export enum TaskViewFilterType {
  TAGS = "TAGS",
  STATUSES = "STATUSES",
  ASSIGNEES = "ASSIGNEES",
  OWNERS = "OWNERS",
  APPLICANTS = "APPLICANTS",
  ROLES = "ROLES",
  PRIORITIES = "PRIORITIES",
  SKILLS = "SKILLS",
  SUBTASKS = "SUBTASKS",
}

registerEnumType(TaskViewType, { name: "TaskViewType" });
registerEnumType(TaskViewSortByField, { name: "TaskViewSortByField" });
registerEnumType(TaskViewSortByDirection, { name: "TaskViewSortByDirection" });
registerEnumType(TaskViewGroupBy, { name: "TaskViewGroupBy" });
registerEnumType(TaskViewField, { name: "TaskViewField" });
registerEnumType(TaskViewFilterType, { name: "TaskViewFilterType" });

@InputType("TaskViewFilterInput")
@ObjectType()
export class TaskViewFilter {
  @Field(() => TaskViewFilterType)
  public type!: TaskViewFilterType;

  @Field(() => Boolean, { nullable: true })
  public subtasks?: boolean;

  @Field(() => [GraphQLUUID], { nullable: true })
  public tagIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: "itemsAndList" })
  public assigneeIds?: (string | null)[];

  @Field(() => [GraphQLUUID], { nullable: true })
  public ownerIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: true })
  public applicantIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: true })
  public roleIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: true })
  public skillIds?: string[];

  @Field(() => [TaskStatus], { nullable: true })
  public statuses?: TaskStatus[];

  @Field(() => [TaskPriority], { nullable: true })
  public priorities?: TaskPriority[];
}

@InputType("TaskViewSortByInput")
@ObjectType()
export class TaskViewSortBy {
  @Field(() => TaskViewSortByDirection)
  public direction!: TaskViewSortByDirection;

  @Field(() => TaskViewSortByField)
  public field!: TaskViewSortByField;
}

@Entity({ orderBy: { sortKey: "ASC" } })
@ObjectType()
export class TaskView extends Audit {
  @Column()
  @Field()
  public name!: string;

  @Column()
  @Field()
  public slug!: string;

  @Column()
  @Field()
  public sortKey!: string;

  @Column({ type: "enum", enum: TaskViewType })
  @Field(() => TaskViewType)
  public type!: TaskViewType;

  @Column({
    type: "enum",
    enum: TaskViewGroupBy,
    default: TaskViewGroupBy.status,
  })
  @Field(() => TaskViewGroupBy)
  public groupBy!: TaskViewGroupBy;

  @Column("json")
  @Field(() => [TaskViewFilter])
  public filters!: TaskViewFilter[];

  @Column("json", {
    default: [
      {
        field: TaskViewSortByField.sortKey,
        direction: TaskViewSortByDirection.ASC,
      },
    ],
  })
  @Field(() => [TaskViewSortBy])
  public sortBys!: TaskViewSortBy[];

  @Column("json", {
    default: [
      TaskViewField.status,
      TaskViewField.gating,
      TaskViewField.name,
      TaskViewField.priority,
      TaskViewField.dueDate,
      TaskViewField.skills,
      TaskViewField.tags,
      TaskViewField.reward,
      TaskViewField.assignees,
      TaskViewField.button,
    ],
  })
  @Field(() => [TaskViewField])
  public fields!: TaskViewField[];

  @JoinColumn()
  @ManyToOne(() => Project)
  @Field(() => Project, { nullable: true })
  public project?: Promise<Project>;
  @Column({ type: "uuid", nullable: true })
  @Field(() => GraphQLUUID, { nullable: true })
  public projectId?: string;

  @JoinColumn()
  @ManyToOne(() => Organization)
  @Field(() => Organization, { nullable: true })
  public organization?: Promise<Organization>;
  @Column({ type: "uuid", nullable: true })
  @Field(() => GraphQLUUID, { nullable: true })
  public organizationId?: string;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User, { nullable: true })
  public user?: Promise<User>;
  @Column({ type: "uuid", nullable: true })
  @Field(() => GraphQLUUID, { nullable: true })
  public userId?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public deletedAt?: Date;
}
