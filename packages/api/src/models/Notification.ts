import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";
import { Task } from "./Task";

@Entity({ orderBy: { createdAt: "DESC" } })
@ObjectType()
export class Notification extends Audit {
  @Column()
  @Field()
  public message!: string;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public user!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public userId!: string;

  @JoinColumn()
  @ManyToOne(() => Task)
  @Field(() => Task, { nullable: true })
  public task?: Promise<Task>;
  @Column({ type: "uuid", nullable: true })
  @Field()
  public taskId?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public archivedAt?: Date;
}
