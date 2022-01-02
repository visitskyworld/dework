import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";

@Entity()
@ObjectType()
export class TaskReview extends Audit {
  @Column({ nullable: true, length: 160 })
  @Field({ nullable: true })
  public message?: string;

  @Column({ type: "int", nullable: true })
  @Field(() => Int, { nullable: true })
  public rating?: number;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  public reviewer?: Promise<User>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public reviewerId?: string;
}
