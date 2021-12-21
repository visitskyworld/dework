import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";
import { Audit } from "./Audit";

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
}
