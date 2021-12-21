import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { PaymentNetwork } from "./PaymentNetwork";

export enum PaymentTokenType {
  ETHER = "ETHER",
  ERC20 = "ERC20",
  ERC721 = "ERC721",
  ERC1155 = "ERC1155",
  SOL = "SOL",
  SPL_TOKEN = "SPL_TOKEN",
}

registerEnumType(PaymentTokenType, { name: "PaymentTokenType" });

@Entity()
@ObjectType()
export class PaymentToken extends Audit {
  @Field(() => PaymentTokenType)
  @Column("enum", { enum: PaymentTokenType })
  public type!: PaymentTokenType;

  @Column()
  @Field()
  public name!: string;

  @Column()
  @Field()
  public exp!: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public address?: string;

  @JoinColumn()
  @ManyToOne(() => PaymentNetwork)
  @Field(() => PaymentNetwork)
  public network!: Promise<PaymentNetwork>;
  @Column({ type: "uuid" })
  @Field()
  public networkId!: string;
}
