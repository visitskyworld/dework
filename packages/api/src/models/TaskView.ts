import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Project } from "./Project";
import { TaskPriority, TaskStatus } from "./Task";

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
}

export enum TaskViewSortByDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export enum TaskViewGroupBy {
  status = "status",
}

export enum TaskViewFilterType {
  TAGS = "TAGS",
  STATUSES = "STATUSES",
  ASSIGNEES = "ASSIGNEES",
  OWNERS = "OWNERS",
  ROLES = "ROLES",
  PRIORITIES = "PRIORITIES",
}

registerEnumType(TaskViewType, { name: "TaskViewType" });
registerEnumType(TaskViewSortByField, { name: "TaskViewSortByField" });
registerEnumType(TaskViewSortByDirection, { name: "TaskViewSortByDirection" });
registerEnumType(TaskViewGroupBy, { name: "TaskViewGroupBy" });
registerEnumType(TaskViewFilterType, { name: "TaskViewFilterType" });

@InputType("TaskViewFilterInput")
@ObjectType()
export class TaskViewFilter {
  @Field(() => TaskViewFilterType)
  public type!: TaskViewFilterType;

  @Field(() => [GraphQLUUID], { nullable: true })
  public tagIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: "itemsAndList" })
  public assigneeIds?: (string | null)[];

  @Field(() => [GraphQLUUID], { nullable: true })
  public ownerIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: true })
  public roleIds?: string[];

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

  @JoinColumn()
  @ManyToOne(() => Project)
  @Field(() => Project)
  public project!: Promise<Project>;
  @Column({ type: "uuid" })
  @Field()
  public projectId!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public deletedAt?: Date;
}
