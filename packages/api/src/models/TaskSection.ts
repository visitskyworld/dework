import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Project } from "./Project";
import { TaskStatus } from "./Task";

@Entity({ orderBy: { sortKey: "ASC" } })
@ObjectType()
export class TaskSection extends Audit {
  @Column()
  @Field()
  public name!: string;

  @Column()
  @Field()
  public sortKey!: string;

  @JoinColumn()
  @ManyToOne(() => Project)
  @Field(() => Project)
  public project!: Promise<Project>;
  @Column({ type: "uuid" })
  @Field()
  public projectId!: string;

  @Column({ enum: TaskStatus })
  @Field(() => TaskStatus)
  public status!: TaskStatus;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public deletedAt?: Date;
}
