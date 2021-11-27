import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, OneToMany } from "typeorm";
import { Audit } from "./Audit";
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

  @JoinColumn()
  @OneToMany(() => Threepid, (t: Threepid) => t.user)
  @Field(() => [Threepid])
  public threepids!: Promise<Threepid[]>;
}
