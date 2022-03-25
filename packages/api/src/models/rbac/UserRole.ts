import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "../User";
import { Role } from "./Role";

@Entity()
@ObjectType()
export class UserRole {
  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public user!: Promise<User>;
  @PrimaryColumn({ type: "uuid" })
  @Field()
  public userId!: string;

  @JoinColumn()
  @ManyToOne(() => Role)
  @Field(() => Role)
  public role!: Promise<Role>;
  @PrimaryColumn({ type: "uuid" })
  @Field()
  public roleId!: string;

  @Column({ default: false })
  @Field()
  public hidden!: boolean;
}
