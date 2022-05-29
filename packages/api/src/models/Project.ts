import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Audit } from "./Audit";
import { Organization } from "./Organization";
import { PaymentMethod } from "./PaymentMethod";
import { ProjectIntegration } from "./ProjectIntegration";
import { Task } from "./Task";
import { TaskTag } from "./TaskTag";
import { ProjectTokenGate } from "./ProjectTokenGate";
import { Workspace } from "./Workspace";
import { TaskSection } from "./TaskSection";
import { TaskView } from "./TaskView";

@ObjectType()
@InputType("ProjectOptionsInput")
export class ProjectOptions {
  @Field({ nullable: true })
  public showCommunitySuggestions?: boolean;
}

@Entity({ orderBy: { sortKey: "ASC" } })
@ObjectType()
export class Project extends Audit {
  @Column()
  @Field()
  public name!: string;

  @Column({ nullable: true, length: 4096 })
  @Field({ nullable: true })
  public description!: string;

  @JoinColumn()
  @ManyToOne(() => Organization)
  @Field(() => Organization)
  public organization!: Promise<Organization>;
  @Column({ type: "uuid" })
  @Field()
  public organizationId!: string;

  @JoinColumn()
  @ManyToOne(() => Workspace)
  @Field(() => Workspace)
  public workspace!: Promise<Workspace>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public workspaceId?: string;

  @Column({ unique: true })
  @Field()
  public slug!: string;

  @OneToMany(() => Task, (t: Task) => t.project)
  @Field(() => [Task])
  public tasks!: Promise<Task[]>;

  @OneToMany(() => TaskTag, (t: TaskTag) => t.project)
  @Field(() => [TaskTag])
  public taskTags!: Promise<TaskTag[]>;

  @OneToMany(() => ProjectIntegration, (p: ProjectIntegration) => p.project)
  @Field(() => [ProjectIntegration])
  public integrations!: Promise<ProjectIntegration[]>;

  @OneToMany(() => TaskSection, (x: TaskSection) => x.project)
  @Field(() => [TaskSection])
  public taskSections!: Promise<TaskSection[]>;

  @OneToMany(() => PaymentMethod, (p: PaymentMethod) => p.project)
  @Field(() => [PaymentMethod])
  public paymentMethods!: Promise<PaymentMethod[]>;

  @OneToMany(() => ProjectTokenGate, (p: ProjectTokenGate) => p.project)
  @Field(() => [ProjectTokenGate])
  public tokenGates!: Promise<ProjectTokenGate[]>;

  @OneToMany(() => TaskView, (p: TaskView) => p.project)
  @Field(() => [TaskView])
  public taskViews!: Promise<TaskView[]>;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public deletedAt?: Date;

  @Column("json", { nullable: true })
  @Field({ nullable: true })
  public options?: ProjectOptions;

  @Column()
  @Field()
  public sortKey!: string;

  public taskCount?: number;
}
