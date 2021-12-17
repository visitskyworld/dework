import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Task } from "./Task";

export enum GithubPullRequestStatusEnum {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  DONE = "CLOSED",
}

registerEnumType(GithubPullRequestStatusEnum, {
  name: "GithubPullRequestStatusEnum",
});

@Entity()
@ObjectType()
export class GithubPullRequest extends Audit {
  @Column()
  @Field()
  public title!: string;

  @Column()
  @Field()
  public link!: string;

  @Column()
  @Field()
  public branchName!: string;

  @Column({ enum: GithubPullRequestStatusEnum })
  @Field(() => GithubPullRequestStatusEnum)
  public status!: GithubPullRequestStatusEnum;

  @JoinColumn()
  @ManyToOne(() => Task)
  @Field(() => Task)
  public task!: Promise<Task>;
  @Column({ type: "uuid" })
  @Field()
  public taskId!: string;
}
