import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Project } from "./Project";

export enum TaskTagSource {
  GITHUB = "GITHUB",
  NOTION = "NOTION",
  TRELLO = "TRELLO",
}

registerEnumType(TaskTagSource, { name: "TaskTagSource" });

@Entity({ orderBy: { createdAt: "ASC" } })
@ObjectType()
export class TaskTag extends Audit {
  @Column()
  @Field()
  public label!: string;

  @Column()
  @Field()
  public color!: string;

  @JoinColumn()
  @ManyToOne(() => Project)
  @Field(() => Project)
  public project!: Promise<Project>;
  @Column({ type: "uuid" })
  @Field()
  public projectId!: string;

  @Column({ enum: TaskTagSource, nullable: true })
  public source?: TaskTagSource;

  @Column({ nullable: true })
  public externalId?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public deletedAt?: Date;
}
