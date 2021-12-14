import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Audit } from "./Audit";
import { Project } from "./Project";
import { TaskReward } from "./TaskReward";
import { TaskTag } from "./TaskTag";
import { User } from "./User";
import { GithubPr } from "./GithubPr";

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

  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  public creator?: Promise<User>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public creatorId?: string;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  public owner?: Promise<User>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public ownerId?: string;

  @ManyToMany(() => User, { eager: true })
  @JoinTable({ name: "task_assignees" })
  @Field(() => [User])
  public assignees!: User[];

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

  @OneToMany(() => GithubPr, (g: GithubPr) => g.task)
  @Field(() => [GithubPr])
  public githubPrs?: Promise<GithubPr[]>;

  @JoinColumn()
  @OneToOne(() => TaskReward, { nullable: true, eager: true, cascade: true })
  @Field(() => TaskReward, { nullable: true })
  public reward?: TaskReward;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public rewardId?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public deletedAt?: Date;
}
