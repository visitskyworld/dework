import { Field, ObjectType } from "@nestjs/graphql";
import { Length } from "class-validator";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Audit } from "./Audit";
import { PaymentMethod } from "./PaymentMethod";
import { TaskApplication } from "./TaskApplication";
import { Threepid } from "./Threepid";
import { EntityDetail } from "./EntityDetail";
import { UserOnboarding } from "./UserOnboarding";
import { Role } from "./rbac/Role";

@Entity()
@ObjectType()
export class User extends Audit {
  @Column({ unique: true })
  @Field()
  @Length(1)
  public username!: string;

  @Column({ nullable: true, length: 4096 })
  @Field({ nullable: true })
  public bio?: string;

  @Column({ nullable: true, length: 1024 })
  @Field({ nullable: true })
  public imageUrl?: string;

  @OneToMany(() => Threepid, (t: Threepid) => t.user)
  @Field(() => [Threepid])
  public threepids!: Promise<Threepid[]>;

  @OneToMany(() => EntityDetail, (t: EntityDetail) => t.user)
  @Field(() => [EntityDetail])
  public details!: Promise<EntityDetail[]>;

  @OneToMany(() => PaymentMethod, (p: PaymentMethod) => p.user)
  @Field(() => [PaymentMethod])
  public paymentMethods!: Promise<PaymentMethod[]>;

  @OneToMany(() => TaskApplication, (taskApplication) => taskApplication.user)
  public taskApplications!: TaskApplication[];

  @OneToOne(() => UserOnboarding, (x) => x.user, { nullable: true })
  @Field(() => UserOnboarding, { nullable: true })
  public onboarding?: UserOnboarding;

  @ManyToMany(() => Role)
  @JoinTable({ name: "user_role" })
  @Field(() => [Role])
  public roles!: Promise<Role[]>;
}
