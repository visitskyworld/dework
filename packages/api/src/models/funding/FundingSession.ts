import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Audit } from "../Audit";
import { Organization } from "../Organization";
import { PaymentToken } from "../PaymentToken";
import { Project } from "../Project";
import { TaskReward } from "../TaskReward";
import { FundingVote } from "./FundingVote";

@Entity({ orderBy: { startDate: "DESC" } })
@ObjectType()
export class FundingSession extends Audit {
  @Column()
  @Field()
  public amount!: string;

  @Column()
  @Field()
  public startDate!: Date;

  @Column()
  @Field()
  public endDate!: Date;

  @JoinColumn()
  @ManyToOne(() => PaymentToken)
  @Field(() => PaymentToken)
  public token!: Promise<PaymentToken>;
  @Column({ type: "uuid" })
  @Field()
  public tokenId!: string;

  @JoinColumn()
  @ManyToOne(() => Organization)
  @Field(() => Organization)
  public organization!: Promise<Organization>;
  @Column({ type: "uuid" })
  @Field()
  public organizationId!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public closedAt?: Date;

  @OneToMany(() => FundingVote, (x: FundingVote) => x.session)
  @Field(() => [FundingVote])
  public votes!: Promise<FundingVote[]>;

  @OneToMany(() => TaskReward, (x: TaskReward) => x.fundingSession)
  @Field(() => [TaskReward])
  public rewards!: Promise<TaskReward[]>;

  @ManyToMany(() => Project)
  @JoinTable({ name: "funding_session_project" })
  @Field(() => [Project])
  public projects!: Promise<Project[]>;
}
