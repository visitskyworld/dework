import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, PrimaryColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";
import { Task } from "./Task";

@ObjectType()
@Entity()
export class TaskApplication extends Audit {
  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public user!: Promise<User>;
  @PrimaryColumn({ type: "uuid" })
  @Field()
  public userId!: string;

  @Column()
  @Field()
  public applicationMessage!: string;

  @Column()
  @Field()
  public startDate!: Date;

  @Column()
  @Field()
  public endDate!: Date;

  @JoinColumn()
  @ManyToOne(() => Task)
  @Field(() => Task)
  public task!: Promise<Task>;
  @PrimaryColumn({ type: "uuid" })
  @Field()
  public taskId!: string;
}
