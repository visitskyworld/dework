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
import { Audit } from "./Audit";
import { PaymentMethod } from "./PaymentMethod";
import { Project } from "./Project";
import { User } from "./User";

@Entity()
@ObjectType()
export class Organization extends Audit {
  @Column()
  @Field()
  public name!: string;

  @Column({ nullable: true, length: 1024 })
  @Field({ nullable: true })
  public imageUrl?: string;

  @ManyToMany(() => User, (user: User) => user.organizations)
  @JoinTable({ name: "organization_users" })
  @Field(() => [User])
  public users!: Promise<User[]> | User[];

  @OneToMany(() => Project, (p: Project) => p.organization)
  @Field(() => [Project])
  public projects!: Promise<Project[]>;

  @JoinColumn()
  @ManyToOne(() => PaymentMethod, { nullable: true })
  @Field(() => PaymentMethod, { nullable: true })
  public paymentMethod?: Promise<PaymentMethod>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public paymentMethodId?: string;
}
