import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";
import { Task } from "./Task";

export enum TaskSubmissionStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

registerEnumType(TaskSubmissionStatus, { name: "TaskSubmissionStatus" });

@ObjectType()
@Entity()
export class TaskSubmission extends Audit {
  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public user!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public userId!: string;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  public approver?: Promise<User>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public approverId?: string;

  @Column()
  @Field()
  public content!: string;

  @JoinColumn()
  @ManyToOne(() => Task)
  @Field(() => Task)
  public task!: Promise<Task>;
  @Column({ type: "uuid" })
  @Field()
  public taskId!: string;

  @Column({
    type: "enum",
    enum: TaskSubmissionStatus,
    default: TaskSubmissionStatus.PENDING,
  })
  @Field(() => TaskSubmissionStatus)
  public status!: TaskSubmissionStatus;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public deletedAt?: Date;
}
