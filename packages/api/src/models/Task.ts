import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  OneToMany,
  AfterLoad,
} from "typeorm";
import slugify from "slugify";
import { Audit } from "./Audit";
import { Project } from "./Project";
import { TaskReward } from "./TaskReward";
import { TaskReview } from "./TaskReview";
import { TaskTag } from "./TaskTag";
import { User } from "./User";
import { GithubBranch } from "./GithubBranch";
import { GithubPullRequest } from "./GithubPullRequest";
import { DiscordChannel } from "./DiscordChannel";
import { TaskApplication } from "./TaskApplication";

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
  @Column({ type: "int" })
  @Field(() => Int)
  public number!: number;

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

  @OneToMany(
    () => TaskApplication,
    (application: TaskApplication) => application.task
  )
  @Field(() => [TaskApplication])
  public applications!: Promise<TaskApplication[]>;

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

  @OneToMany(() => GithubPullRequest, (g: GithubPullRequest) => g.task)
  @Field(() => [GithubPullRequest])
  public githubPullRequests?: Promise<GithubPullRequest[]>;

  @OneToOne(() => DiscordChannel, (d: DiscordChannel) => d.task, {
    nullable: true,
  })
  @Field(() => DiscordChannel, { nullable: true })
  public discordChannel?: Promise<DiscordChannel>;

  @OneToMany(() => GithubBranch, (g: GithubBranch) => g.task)
  @Field(() => [GithubBranch])
  public githubBranches?: Promise<GithubBranch[]>;

  @JoinColumn()
  @OneToOne(() => TaskReward, { nullable: true, eager: true, cascade: true })
  @Field(() => TaskReward, { nullable: true })
  public reward?: TaskReward;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public rewardId?: string;

  @JoinColumn()
  @OneToOne(() => TaskReview, { nullable: true, cascade: true })
  @Field(() => TaskReview, { nullable: true })
  public review?: TaskReview;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public reviewId?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public deletedAt?: Date;

  @Field()
  public slug!: string;

  @AfterLoad()
  getSlug() {
    this.slug = slugify(this.name.slice(0, 24), { lower: true, strict: true });
  }
}
