import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Project } from "./Project";

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
}
