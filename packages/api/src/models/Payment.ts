import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { PaymentMethod, PaymentMethodType } from "./PaymentMethod";
import { PaymentNetwork } from "./PaymentNetwork";

export enum PaymentStatus {
  PROCESSING = "PROCESSING",
  CONFIRMED = "CONFIRMED",
}

registerEnumType(PaymentStatus, { name: "PaymentStatus" });

export interface GnosisSafePaymentData {
  txHash?: string;
  safeTxHash: string;
}

interface PaymentDataMap extends Record<PaymentMethodType, any> {
  [PaymentMethodType.METAMASK]: undefined;
  [PaymentMethodType.PHANTOM]: undefined;
  [PaymentMethodType.GNOSIS_SAFE]: GnosisSafePaymentData;
}

export type PaymentData = PaymentDataMap[keyof PaymentDataMap];

@Entity()
@ObjectType()
export class Payment<
  TPaymentMethodType extends PaymentMethodType = PaymentMethodType
> extends Audit {
  @Field(() => PaymentStatus)
  @Column("enum", { enum: PaymentStatus })
  public status!: PaymentStatus;

  @JoinColumn()
  @ManyToOne(() => PaymentMethod)
  @Field(() => PaymentMethod)
  public paymentMethod!: Promise<PaymentMethod>;
  @Column({ type: "uuid" })
  @Field()
  public paymentMethodId!: string;

  @JoinColumn()
  @ManyToOne(() => PaymentNetwork)
  @Field(() => PaymentNetwork)
  public network!: Promise<PaymentNetwork>;
  @Column({ type: "uuid" })
  @Field()
  public networkId!: string;

  @Column("json", { nullable: true })
  @Field(() => GraphQLJSONObject, { nullable: true })
  public data!: PaymentDataMap[TPaymentMethodType];
}
