import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Audit } from "./Audit";
import { PaymentMethod } from "./PaymentMethod";
import { Threepid } from "./Threepid";

@Entity()
@ObjectType()
export class User extends Audit {
  @Column({ unique: true, nullable: true })
  @Field({ nullable: true })
  public username?: string;

  @Column({ nullable: true, length: 4096 })
  @Field({ nullable: true })
  public bio?: string;

  @Column({ nullable: true, length: 1024 })
  @Field({ nullable: true })
  public imageUrl?: string;

  @OneToMany(() => Threepid, (t: Threepid) => t.user)
  @Field(() => [Threepid])
  public threepids!: Promise<Threepid[]>;

  @JoinColumn()
  @ManyToOne(() => PaymentMethod, { nullable: true })
  @Field(() => PaymentMethod, { nullable: true })
  public paymentMethod?: Promise<PaymentMethod>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public paymentMethodId?: string;
}
