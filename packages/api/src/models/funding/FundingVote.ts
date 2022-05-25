import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { Audit } from "../Audit";
import { Task } from "../Task";
import { User } from "../User";
import { FundingSession } from "./FundingSession";

@Entity()
@ObjectType()
@Unique(["sessionId", "taskId", "userId"])
export class FundingVote extends Audit {
  @Column("int")
  @Field(() => Int)
  public weight!: number;

  @JoinColumn()
  @ManyToOne(() => FundingSession)
  @Field(() => FundingSession)
  public session!: Promise<FundingSession>;
  @Column({ type: "uuid" })
  @Field()
  public sessionId!: string;

  @JoinColumn()
  @ManyToOne(() => Task)
  @Field(() => Task)
  public task!: Promise<Task>;
  @Column({ type: "uuid" })
  @Field()
  public taskId!: string;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public user!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public userId!: string;
}
