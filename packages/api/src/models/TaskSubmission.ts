import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, PrimaryColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";
import { Task } from "./Task";

@ObjectType()
@Entity()
export class TaskSubmission extends Audit {
  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public user!: Promise<User>;
  @PrimaryColumn({ type: "uuid" })
  @Field()
  public userId!: string;

  @Column()
  @Field()
  public content!: string;

  @JoinColumn()
  @ManyToOne(() => Task)
  @Field(() => Task)
  public task!: Promise<Task>;
  @PrimaryColumn({ type: "uuid" })
  @Field()
  public taskId!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public deletedAt?: Date;
}
