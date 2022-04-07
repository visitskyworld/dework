import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";

@Entity()
@ObjectType()
export class UserOnboarding extends Audit {
  @Column()
  @Field()
  public type!: string;

  @JoinColumn()
  @OneToOne(() => User)
  @Field(() => User)
  public user!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public userId!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public completedAt?: Date;
}
