import { Field, ObjectType } from "@nestjs/graphql";
import { Length } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Audit } from "./Audit";
import { PaymentMethod } from "./PaymentMethod";
import { TaskApplication } from "./TaskApplication";
import { Threepid } from "./Threepid";
import { UserDetail } from "./UserDetail";

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

  @OneToMany(() => UserDetail, (t: UserDetail) => t.user)
  @Field(() => [UserDetail])
  public details!: Promise<UserDetail[]>;

  @JoinColumn()
  @ManyToOne(() => PaymentMethod, { nullable: true })
  @Field(() => PaymentMethod, { nullable: true })
  public paymentMethod?: Promise<PaymentMethod>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public paymentMethodId?: string;

  @OneToMany(() => TaskApplication, (taskApplication) => taskApplication.user)
  public taskApplications!: TaskApplication[];
}
