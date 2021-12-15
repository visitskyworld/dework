import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";

export enum UserDetailType {
  twitter = "twitter",
  linkedin = "linkedin",
  country = "country",
}

registerEnumType(UserDetailType, { name: "UserDetailType" });

@Entity()
@ObjectType()
export class UserDetail extends Audit {
  @Column({ enum: UserDetailType })
  @Field(() => UserDetailType)
  public type!: UserDetailType;

  @Column({ length: 1024 })
  @Field()
  public value!: string;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public user!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public userId!: string;
}
