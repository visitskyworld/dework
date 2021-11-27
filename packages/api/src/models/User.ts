import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";
import { Audit } from "./Audit";

@Entity()
@ObjectType()
export class User extends Audit {
  @Column({ unique: true })
  @Field()
  public username?: string;

  @Column({ nullable: true, length: 1024 })
  @Field({ nullable: true })
  public imageUrl?: string;
}
