import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Project } from "./Project";

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
