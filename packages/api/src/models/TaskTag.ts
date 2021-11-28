import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Project } from "./Project";
import { Task } from "./Task";

@Entity()
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
}
