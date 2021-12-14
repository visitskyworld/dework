import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { User } from "discord.js";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";

export enum UserDetailKey {
  twitter,
  linkedin,
  country,
}

registerEnumType(UserDetailKey, {
  name: "UserDetailKey",
});

@Entity()
@ObjectType()
export class UserDetail extends Audit {
  @Column({ length: 1024 })
  @Field()
  public type!: UserDetailKey;

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
