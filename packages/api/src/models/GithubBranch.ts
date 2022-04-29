import { Field, ObjectType } from "@nestjs/graphql";
import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
} from "typeorm";
import { Audit } from "./Audit";
import { Task } from "./Task";

@Entity()
@ObjectType()
@Unique(["name", "organization", "repo", "taskId"])
export class GithubBranch extends Audit {
  @Column()
  @Field()
  public name!: string;

  @Column()
  @Field()
  public organization!: string;

  @Column()
  @Field()
  public repo!: string;

  @JoinColumn()
  @ManyToOne(() => Task)
  @Field(() => Task)
  public task!: Promise<Task>;
  @Column({ type: "uuid" })
  @Field()
  public taskId!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public deletedAt?: Date;

  @Field()
  public link!: string;

  @AfterLoad()
  getSlug() {
    this.link = `https://github.com/${this.organization}/${this.repo}/compare/${this.name}`;
  }
}
