import { Field, Float, ObjectType, registerEnumType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { PaymentNetwork } from "./PaymentNetwork";

export enum PaymentTokenType {
  NATIVE = "NATIVE",
  ERC20 = "ERC20",
  ERC721 = "ERC721",
  ERC1155 = "ERC1155",
  SPL_TOKEN = "SPL_TOKEN",
  STACKS_TOKEN = "STACKS_TOKEN",
}

export enum PaymentTokenVisibility {
  ALWAYS = "ALWAYS",
  IF_HAS_BALANCE = "IF_HAS_BALANCE",
}

registerEnumType(PaymentTokenType, { name: "PaymentTokenType" });
registerEnumType(PaymentTokenVisibility, { name: "PaymentTokenVisibility" });

interface CoinMarketCapConfig {
  coinmarketcapUrl: string;
}

export interface PaymentTokenConfig extends Record<PaymentTokenType, any> {
  [PaymentTokenType.ERC20]: CoinMarketCapConfig;
}

@Entity()
@ObjectType()
export class PaymentToken<
  TPaymentTokenType extends PaymentTokenType = PaymentTokenType
> extends Audit {
  @Field(() => PaymentTokenType)
  @Column("enum", { enum: PaymentTokenType })
  public type!: TPaymentTokenType;

  @Column()
  @Field()
  public name!: string;

  @Column()
  @Field()
  public symbol!: string;

  @Column()
  @Field()
  public exp!: number;

  @Column("enum", {
    enum: PaymentTokenVisibility,
    default: PaymentTokenVisibility.IF_HAS_BALANCE,
  })
  @Field(() => PaymentTokenVisibility)
  public visibility!: PaymentTokenVisibility;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public address?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public identifier?: string;

  @JoinColumn()
  @ManyToOne(() => PaymentNetwork)
  @Field(() => PaymentNetwork)
  public network!: Promise<PaymentNetwork>;
  @Column({ type: "uuid" })
  @Field()
  public networkId!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public imageUrl?: string;

  @Column("float", { nullable: true })
  @Field(() => Float, { nullable: true })
  public usdPrice?: number;

  @Column("json", { nullable: true })
  @Field(() => GraphQLJSONObject, { nullable: true })
  public config?: CoinMarketCapConfig; // PaymentTokenConfig[TPaymentTokenType];
}
