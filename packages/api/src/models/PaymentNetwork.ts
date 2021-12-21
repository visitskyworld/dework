import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany } from "typeorm";
import { Audit } from "./Audit";
import { PaymentToken } from "./PaymentToken";

@Entity()
@ObjectType()
export class PaymentNetwork extends Audit {
  @Column()
  @Field()
  public name!: string;

  @Column()
  @Field()
  public url!: string;

  @Column()
  @Field()
  public sortKey!: string;

  @OneToMany(() => PaymentToken, (t: PaymentToken) => t.network)
  @Field(() => [PaymentToken])
  public tokens!: Promise<PaymentToken[]>;
}
