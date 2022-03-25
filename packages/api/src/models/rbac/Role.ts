import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
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

export enum RoleSource {
  DISCORD = "DISCORD",
}

registerEnumType(RoleSource, { name: "RoleSource" });

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
  public fallback!: boolean;

  @Field(() => RoleSource, { nullable: true })
  @Column("enum", { enum: RoleSource, nullable: true })
  public source?: RoleSource;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public externalId?: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: "user_role",
    joinColumn: { name: "roleId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "userId", referencedColumnName: "id" },
  })
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

  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  public user?: Promise<User>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public userId?: string;
}
