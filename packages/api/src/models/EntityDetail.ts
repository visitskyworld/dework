import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";
import { Organization } from "./Organization";

export enum EntityDetailType {
  twitter = "twitter",
  linkedin = "linkedin",
  website = "website",
  github = "github",
  discord = "discord",
  location = "location",
}

registerEnumType(EntityDetailType, { name: "EntityDetailType" });

@Entity()
@ObjectType()
@Index("IDX_unique_user_type", ["userId", "type"], {
  unique: true,
})
export class EntityDetail extends Audit {
  @Column({ enum: EntityDetailType })
  @Field(() => EntityDetailType)
  public type!: EntityDetailType;

  @Column({ length: 1024 })
  @Field()
  public value!: string;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  public user?: Promise<User>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public userId?: string;

  @JoinColumn()
  @ManyToOne(() => Organization, { nullable: true })
  @Field(() => Organization, { nullable: true })
  public organization?: Promise<Organization>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public organizationId?: string;
}
