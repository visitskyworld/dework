import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { Audit } from "./Audit";
import { Organization } from "./Organization";
import { Threepid } from "./Threepid";

@Entity()
@ObjectType()
export class User extends Audit {
  @Column({ unique: true, nullable: true })
  @Field({ nullable: true })
  public username?: string;

  @Column({ nullable: true, length: 1024 })
  @Field({ nullable: true })
  public imageUrl?: string;

  @OneToMany(() => Threepid, (t: Threepid) => t.user)
  @Field(() => [Threepid])
  public threepids!: Promise<Threepid[]>;

  @ManyToMany(() => Organization, (o: Organization) => o.users)
  @Field(() => [Organization])
  public organizations!: Promise<Organization[]>;
}
