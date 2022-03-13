import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Audit } from "../Audit";
import { Organization } from "../Organization";
import { User } from "../User";
import { Rule } from "./Rule";

@Entity()
@ObjectType()
export class Role extends Audit {
  @Column()
  @Field()
  public name!: string;

  @Column()
  @Field()
  public color!: string;

  @Column({ default: false })
  @Field()
  public default!: boolean;

  // source?: 'DISCORD';
  // externalId?: string;

  @ManyToMany(() => User)
  @JoinTable({ name: "user_role" })
  @Field(() => [User])
  public users!: Promise<User[]>;

  @OneToMany(() => Rule, (r: Rule) => r.role, { cascade: true })
  @Field(() => [Rule])
  public rules!: Promise<Rule[]>;

  @JoinColumn()
  @ManyToOne(() => Organization)
  @Field(() => Organization)
  public organization!: Promise<Organization>;
  @Column({ type: "uuid" })
  @Field()
  public organizationId!: string;
}
