import { Field, ObjectType } from "@nestjs/graphql";
import { AfterLoad, Column, Entity, JoinColumn, OneToOne } from "typeorm";
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

  @Column()
  @Field()
  public name!: string;

  @JoinColumn()
  @OneToOne(() => Task)
  @Field(() => Task)
  public task!: Promise<Task>;
  @Column({ type: "uuid" })
  @Field()
  public taskId!: string;

  @Field()
  public link!: string;

  @AfterLoad()
  loadLink() {
    this.link = `https://discordapp.com/channels/${this.guildId}/${this.channelId}`;
  }
}
