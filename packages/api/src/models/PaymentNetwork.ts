import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column, Entity, OneToMany } from "typeorm";
import { Audit } from "./Audit";
import { PaymentToken } from "./PaymentToken";

export enum PaymentNetworkType {
  ETHEREUM = "ETHEREUM",
  SOLANA = "SOLANA",
  STACKS = "STACKS",
}

registerEnumType(PaymentNetworkType, { name: "PaymentNetworkType" });

export interface EthereumConfig {
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  gnosisSafe?: {
    serviceUrl: string;
    safeUrlPrefix?: string;
  };
}

interface SolanaConfig {
  cluster: string;
  rpcUrl: string;
}

interface StacksConfig {
  chain: string;
  rpcUrl: string;
}

export interface PaymentNetworkConfig extends Record<PaymentNetworkType, any> {
  [PaymentNetworkType.ETHEREUM]: EthereumConfig;
  [PaymentNetworkType.SOLANA]: SolanaConfig;
  [PaymentNetworkType.STACKS]: StacksConfig;
}

@Entity()
@ObjectType()
export class PaymentNetwork<
  TPaymentNetworkType extends PaymentNetworkType = PaymentNetworkType
> extends Audit {
  @Field(() => PaymentNetworkType)
  @Column("enum", { enum: PaymentNetworkType })
  public type!: TPaymentNetworkType;

  @Column()
  @Field()
  public name!: string;

  @Column()
  @Field()
  public slug!: string;

  @Column()
  @Field()
  public sortKey!: string;

  @Column("json")
  @Field(() => GraphQLJSONObject)
  public config!: PaymentNetworkConfig[TPaymentNetworkType];

  @OneToMany(() => PaymentToken, (t: PaymentToken) => t.network)
  @Field(() => [PaymentToken])
  public tokens!: Promise<PaymentToken[]>;
}
