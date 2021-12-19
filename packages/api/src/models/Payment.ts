import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { PaymentMethod, PaymentMethodType } from "./PaymentMethod";

export enum PaymentStatus {
  PROCESSING = "PROCESSING",
  CONFIRMED = "CONFIRMED",
}

registerEnumType(PaymentStatus, { name: "PaymentStatus" });

export interface GnosisSafePaymentData {
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
  public from!: Promise<PaymentMethod>;
  @Column({ type: "uuid" })
  @Field()
  public fromId!: string;

  @JoinColumn()
  @ManyToOne(() => PaymentMethod)
  @Field(() => PaymentMethod)
  public to!: Promise<PaymentMethod>;
  @Column({ type: "uuid" })
  @Field()
  public toId!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public txHash?: string;

  @Column("json", { nullable: true })
  @Field(() => GraphQLJSONObject, { nullable: true })
  public data!: PaymentDataMap[TPaymentMethodType];
}
