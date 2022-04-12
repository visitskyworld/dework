import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";

type UserPromptType =
  | "Onboarding.v1.ConnectWallet"
  | "Onboarding.v1.ConnectDiscord"
  | "Task.v1.ConnectWalletToReceiveReward";

@Entity()
@ObjectType()
export class UserPrompt extends Audit {
  @Column()
  @Field()
  public type!: UserPromptType;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public user!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public userId!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public completedAt?: Date;
}
