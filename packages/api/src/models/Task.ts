import {
  Field,
  Float,
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
  RelationCount,
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
import { TaskSubmission } from "./TaskSubmission";
import { TaskNFT } from "./TaskNFT";
import { TaskSection } from "./TaskSection";
import { TaskGatingType } from "./enums/TaskGatingType";
import { Skill } from "./Skill";

export enum TaskStatus {
  COMMUNITY_SUGGESTIONS = "COMMUNITY_SUGGESTIONS",
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

registerEnumType(TaskStatus, { name: "TaskStatus" });

export enum TaskPriority {
  URGENT = "URGENT",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
  NONE = "NONE",
}

registerEnumType(TaskPriority, { name: "TaskPriority" });

@Entity()
@ObjectType()
export class Task extends Audit {
  @Column({ type: "int" })
  @Field(() => Int)
  public number!: number;

  @Column()
  @Field()
  public name!: string;

  @Column({ nullable: true, length: 16384 })
  @Field({ nullable: true })
  public description?: string;

  @Column({ enum: TaskStatus })
  @Field(() => TaskStatus)
  public status!: TaskStatus;

  @Column({ type: "enum", enum: TaskPriority, default: TaskPriority.NONE })
  @Field(() => TaskPriority)
  public priority!: TaskPriority;

  @Column()
  @Field()
  public sortKey!: string;

  @Column({ type: "float4", nullable: true })
  @Field(() => Float, { nullable: true })
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

  @ManyToMany(() => User, { eager: true })
  @JoinTable({ name: "task_assignees" })
  @Field(() => [User])
  public assignees!: User[];

  @ManyToMany(() => User, { eager: true })
  @JoinTable({ name: "task_owners" })
  @Field(() => [User])
  public owners!: User[];

  @OneToMany(() => TaskApplication, (x: TaskApplication) => x.task)
  @Field(() => [TaskApplication])
  public applications!: Promise<TaskApplication[]>;

  @RelationCount((t: Task) => t.applications)
  @Field(() => Int)
  public applicationCount!: number;

  @OneToMany(() => TaskSubmission, (x: TaskSubmission) => x.task)
  @Field(() => [TaskSubmission])
  public submissions!: Promise<TaskSubmission[]>;

  @RelationCount((t: Task) => t.submissions, "submission", (qb) =>
    qb.andWhere("submission.deletedAt IS NULL")
  )
  @Field(() => Int)
  public submissionCount!: number;

  @OneToMany(() => TaskReaction, (r: TaskReaction) => r.task)
  @Field(() => [TaskReaction])
  public reactions!: Promise<TaskReaction[]>;

  @OneToMany(() => TaskNFT, (x: TaskNFT) => x.task)
  @Field(() => [TaskNFT])
  public nfts!: Promise<TaskNFT[]>;

  @ManyToMany(() => TaskTag, { eager: true })
  @JoinTable({ name: "task_tag_map" })
  @Field(() => [TaskTag])
  public tags!: TaskTag[];

  @ManyToMany(() => Skill, { eager: true })
  @JoinTable({ name: "task_skill" })
  @Field(() => [Skill])
  public skills!: Skill[];

  @OneToMany(() => GithubPullRequest, (g: GithubPullRequest) => g.task)
  @Field(() => [GithubPullRequest])
  public githubPullRequests!: Promise<GithubPullRequest[]>;

  @OneToMany(() => GithubBranch, (g: GithubBranch) => g.task)
  @Field(() => [GithubBranch])
  public githubBranches!: Promise<GithubBranch[]>;

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
  @ManyToOne(() => TaskSection, { nullable: true })
  @Field(() => TaskSection, { nullable: true })
  public section?: Promise<TaskSection>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public sectionId?: string;

  @JoinColumn()
  @OneToOne(() => TaskReward, { nullable: true, eager: true, cascade: true })
  @Field(() => TaskReward, { nullable: true })
  public reward?: TaskReward;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public rewardId?: string;

  @Column({ default: false })
  @Field()
  public featured!: boolean;

  @JoinColumn()
  @OneToOne(() => TaskReview, { nullable: true, cascade: true })
  @Field(() => TaskReview, { nullable: true })
  public review?: TaskReview;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public reviewId?: string;

  @Column({ type: "timestamp", nullable: true })
  @Field(() => Date, { nullable: true })
  public deletedAt?: Date | null;

  @Column({ type: "timestamp", nullable: true })
  @Field(() => Date, { nullable: true })
  public doneAt?: Date | null;

  @Column({ type: "timestamp", nullable: true })
  @Field(() => Date, { nullable: true })
  public dueDate?: Date | null;

  @Column("enum", { enum: TaskGatingType, default: TaskGatingType.APPLICATION })
  @Field(() => TaskGatingType)
  public gating!: TaskGatingType;

  @Column({ default: false })
  public spam!: boolean;

  @Field()
  public slug!: string;

  @AfterLoad()
  getSlug() {
    this.slug = slugify(this.name.slice(0, 24), { lower: true, strict: true });
  }
}
