import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm";
import { Audit } from "./Audit";
import { Project } from "./Project";
import { TaskTag } from "./TaskTag";

export enum TaskStatusEnum {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

registerEnumType(TaskStatusEnum, { name: "TaskStatusEnum" });

@Entity()
@ObjectType()
export class Task extends Audit {
  @Column()
  @Field()
  public name!: string;

  @Column({ nullable: true, length: 4096 })
  @Field({ nullable: true })
  public description?: string;

  @Column({ enum: TaskStatusEnum })
  @Field(() => TaskStatusEnum)
  public status!: TaskStatusEnum;

  @Column()
  @Field()
  public sortKey!: string;

  @JoinColumn()
  @ManyToOne(() => Project)
  @Field(() => Project)
  public project!: Promise<Project>;
  @Column({ type: "uuid" })
  @Field()
  public projectId!: string;

  // @JoinColumn()
  // @ManyToOne(() => TaskStatus)
  // @Field(() => TaskStatus)
  // public status!: Promise<TaskStatus>;
  // @Column({ type: "uuid" })
  // @Field()
  // public statusId!: string;

  @ManyToMany(() => TaskTag, { eager: true })
  @JoinTable({ name: "task_tag_map" })
  @Field(() => [TaskTag])
  public tags!: TaskTag[];
}
