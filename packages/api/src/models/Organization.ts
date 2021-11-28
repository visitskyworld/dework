import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";

@Entity()
@ObjectType()
export class Organization extends Audit {
  @Column({ nullable: true })
  @Field({ nullable: true })
  public name?: string;

  @Column({ nullable: true, length: 1024 })
  @Field({ nullable: true })
  public imageUrl?: string;

  @ManyToMany(() => User, (user: User) => user.organizations)
  @JoinTable({ name: "organization_users" })
  @Field(() => [User])
  public users!: Promise<User[]>;
}
