import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Audit } from "./Audit";
import { Organization } from "./Organization";
import { ProjectIntegration } from "./ProjectIntegration";
import { Task } from "./Task";
import { TaskTag } from "./TaskTag";

@Entity()
@ObjectType()
export class Project extends Audit {
  @Column()
  @Field()
  public name!: string;

  @JoinColumn()
  @ManyToOne(() => Organization)
  @Field(() => Organization)
  public organization!: Promise<Organization>;
  @Column({ type: "uuid" })
  @Field()
  public organizationId!: string;

  @OneToMany(() => Task, (t: Task) => t.project)
  @Field(() => [Task])
  public tasks!: Promise<Task[]>;

  @OneToMany(() => TaskTag, (t: TaskTag) => t.project)
  @Field(() => [TaskTag])
  public taskTags!: Promise<TaskTag[]>;

  @OneToMany(() => ProjectIntegration, (p: ProjectIntegration) => p.project)
  @Field(() => [ProjectIntegration])
  public integrations!: Promise<ProjectIntegration[]>;

  // @OneToMany(() => TaskStatus, (t: TaskStatus) => t.project)
  // @Field(() => [TaskStatus])
  // public taskStatuses!: Promise<TaskStatus[]>;
}
