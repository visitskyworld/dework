import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Audit } from "./Audit";
import { Organization } from "./Organization";
import { Project } from "./Project";
import { TaskView } from "./TaskView";

@Entity({ orderBy: { sortKey: "ASC" } })
@ObjectType()
export class Workspace extends Audit {
  @Column()
  @Field()
  public name!: string;

  @Column()
  @Field()
  public sortKey!: string;

  @JoinColumn()
  @ManyToOne(() => Organization)
  @Field(() => Organization)
  public organization!: Promise<Organization>;
  @Column({ type: "uuid" })
  @Field()
  public organizationId!: string;

  @Column({ unique: true })
  @Field()
  public slug!: string;

  @DeleteDateColumn()
  @Field({ nullable: true })
  public deletedAt?: Date;

  @OneToMany(() => TaskView, (x: TaskView) => x.workspace)
  @Field(() => [TaskView])
  public taskViews!: Promise<TaskView[]>;

  @OneToMany(() => Project, (x: Project) => x.workspace)
  @Field(() => [Project])
  public projects!: Promise<Project[]>;
}
