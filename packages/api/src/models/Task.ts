import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from "@nestjs/graphql";
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
import { TaskReaction } from "./TaskReaction";
import { GithubIssue } from "./GithubIssue";

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

registerEnumType(TaskStatus, { name: "TaskStatus" });

@ObjectType()
@InputType("TaskOptionsInput")
export class TaskOptions {
  @Field({ nullable: true })
  public enableTaskApplicationSubmission?: boolean;
}

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

  @Column({ enum: TaskStatus })
  @Field(() => TaskStatus)
  public status!: TaskStatus;

  @Column({ nullable: true, length: 4096 })
  @Field({ nullable: true })
  public submission?: string;

  @Column()
  @Field()
  public sortKey!: string;

  @Column({ type: "int", nullable: true })
  @Field(() => Int, { nullable: true })
  public storyPoints?: number;

  @JoinColumn()
  @ManyToOne(() => Task)
  @Field(() => Task, { nullable: true })
  public parentTask?: Promise<Task>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public parentTaskId?: string;

  @OneToMany(() => Task, (x: Task) => x.parentTask)
  @Field(() => [Task])
  public subtasks!: Promise<Task[]>;

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

  @OneToMany(() => TaskReaction, (r: TaskReaction) => r.task)
  @Field(() => [TaskReaction])
  public reactions!: Promise<TaskReaction[]>;

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

  @OneToMany(() => GithubBranch, (g: GithubBranch) => g.task)
  @Field(() => [GithubBranch])
  public githubBranches?: Promise<GithubBranch[]>;

  @OneToOne(() => GithubIssue, (x: GithubIssue) => x.task, {
    nullable: true,
  })
  @Field(() => GithubIssue, { nullable: true })
  public githubIssue?: Promise<GithubIssue>;

  @OneToOne(() => DiscordChannel, (d: DiscordChannel) => d.task, {
    nullable: true,
  })
  @Field(() => DiscordChannel, { nullable: true })
  public discordChannel?: Promise<DiscordChannel>;

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

  @Column("json", { nullable: true })
  @Field({ nullable: true })
  public options?: TaskOptions;

  @Field()
  public slug!: string;

  @AfterLoad()
  getSlug() {
    this.slug = slugify(this.name.slice(0, 24), { lower: true, strict: true });
  }
}
