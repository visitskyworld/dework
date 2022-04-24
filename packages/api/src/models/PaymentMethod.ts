import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { PaymentNetwork } from "./PaymentNetwork";
import { Project } from "./Project";
import { User } from "./User";

export enum PaymentMethodType {
  METAMASK = "METAMASK",
  GNOSIS_SAFE = "GNOSIS_SAFE",
  PHANTOM = "PHANTOM",
  HIRO = "HIRO",
}

registerEnumType(PaymentMethodType, { name: "PaymentMethodType" });

@Entity()
@ObjectType()
export class PaymentMethod extends Audit {
  @Field(() => PaymentMethodType)
  @Column("enum", { enum: PaymentMethodType })
  public type!: PaymentMethodType;

  @Column()
  @Field()
  public address!: string;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public creator!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public creatorId!: string;

  @JoinColumn()
  @ManyToOne(() => PaymentNetwork)
  @Field(() => PaymentNetwork)
  public network!: Promise<PaymentNetwork>;
  @Column({ type: "uuid" })
  @Field()
  public networkId!: string;

  @JoinColumn()
  @ManyToOne(() => Project, { nullable: true })
  @Field(() => Project, { nullable: true })
  public project?: Promise<Project>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public projectId?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public deletedAt?: Date;
}
