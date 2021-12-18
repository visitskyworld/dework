import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Audit } from "./Audit";
import { Task } from "./Task";

@Entity()
@ObjectType()
export class DiscordChannel extends Audit {
  @Column()
  @Field()
  public channelId!: string;

  @Column()
  @Field()
  public guildId!: string;

  @JoinColumn()
  @OneToOne(() => Task)
  @Field(() => Task)
  public task!: Promise<Task>;
  @Column({ type: "uuid" })
  @Field()
  public taskId!: string;
}
