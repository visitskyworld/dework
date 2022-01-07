import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Audit } from "./Audit";
import { Task } from "./Task";

@Entity()
@ObjectType()
export class GithubIssue extends Audit {
  @Column({ type: "int" })
  @Field(() => Int)
  public externalId!: number;

  @Column({ type: "int" })
  @Field(() => Int)
  public number!: number;

  @JoinColumn()
  @OneToOne(() => Task)
  @Field(() => Task)
  public task!: Promise<Task>;
  @Column({ type: "uuid" })
  @Field()
  public taskId!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public deletedAt?: Date;
}
