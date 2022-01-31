import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";

export enum UserOnboardingType {
  DAO_CORE_TEAM = "DAO_CORE_TEAM",
  CONTRIBUTOR = "CONTRIBUTOR",
}

registerEnumType(UserOnboardingType, { name: "UserOnboardingType" });

@Entity()
@ObjectType()
export class UserOnboarding extends Audit {
  @Column({ enum: UserOnboardingType })
  @Field(() => UserOnboardingType)
  public type!: UserOnboardingType;

  @JoinColumn()
  @OneToOne(() => User)
  @Field(() => User)
  public user!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public userId!: string;
}
