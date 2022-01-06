import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Task } from "./Task";

export enum GithubPullRequestStatus {
  OPEN = "OPEN",
  DRAFT = "DRAFT",
  CLOSED = "CLOSED",
  MERGED = "MERGED",
}

registerEnumType(GithubPullRequestStatus, { name: "GithubPullRequestStatus" });

@Entity()
@ObjectType()
export class GithubPullRequest extends Audit {
  @Column()
  @Field()
  public title!: string;

  @Column()
  @Field()
  public link!: string;

  @Column({ type: "int" })
  @Field(() => Int)
  public number!: number;

  @Column()
  @Field()
  public branchName!: string;

  @Column({ enum: GithubPullRequestStatus })
  @Field(() => GithubPullRequestStatus)
  public status!: GithubPullRequestStatus;

  @JoinColumn()
  @ManyToOne(() => Task)
  @Field(() => Task)
  public task!: Promise<Task>;
  @Column({ type: "uuid" })
  @Field()
  public taskId!: string;
}
