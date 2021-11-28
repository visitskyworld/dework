import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm";
import { Audit } from "./Audit";
import { Project } from "./Project";
import { TaskStatus } from "./TaskStatus";
import { TaskTag } from "./TaskTag";

@Entity()
@ObjectType()
export class Task extends Audit {
  @Column()
  @Field()
  public name!: string;

  @Column({ nullable: true, length: 4096 })
  @Field({ nullable: true })
  public description!: string;

  @JoinColumn()
  @ManyToOne(() => Project)
  @Field(() => Project)
  public project!: Promise<Project>;
  @Column({ type: "uuid" })
  @Field()
  public projectId!: string;

  @JoinColumn()
  @ManyToOne(() => TaskStatus)
  @Field(() => TaskStatus)
  public status!: Promise<TaskStatus>;
  @Column({ type: "uuid" })
  @Field()
  public statusId!: string;

  @ManyToMany(() => TaskTag, { eager: true })
  @JoinTable({ name: "task_tag_map" })
  @Field(() => [TaskTag])
  public tags!: TaskTag[];
}
