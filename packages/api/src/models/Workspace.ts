import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Audit } from "./Audit";
import { Organization } from "./Organization";

@Entity({ orderBy: { sortKey: "ASC" } })
@ObjectType()
export class Workspace extends Audit {
  @Column()
  @Field()
  public name!: string;

  @Column()
  @Field()
  public sortKey!: string;

  @JoinColumn()
  @ManyToOne(() => Organization)
  @Field(() => Organization)
  public organization!: Promise<Organization>;
  @Column({ type: "uuid" })
  @Field()
  public organizationId!: string;

  @Column({ unique: true })
  @Field()
  public slug!: string;

  @DeleteDateColumn()
  @Field({ nullable: true })
  public deletedAt?: Date;
}
