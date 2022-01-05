import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";
import { Task } from "./Task";

@Entity()
@ObjectType()
@Index(["userId", "taskId", "reaction"], { unique: true })
export class TaskReaction extends Audit {
  @Column()
  @Field()
  public reaction!: string;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public user!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public userId!: string;

  @JoinColumn()
  @ManyToOne(() => Task)
  @Field(() => Task)
  public task!: Promise<Task>;
  @Column({ type: "uuid" })
  @Field()
  public taskId!: string;
}
