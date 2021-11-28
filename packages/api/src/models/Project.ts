import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Audit } from "./Audit";
import { Organization } from "./Organization";
import { TaskStatus } from "./TaskStatus";
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

  @OneToMany(() => TaskTag, (t: TaskTag) => t.project)
  @Field(() => [TaskTag])
  public taskTags!: Promise<TaskTag[]>;

  @OneToMany(() => TaskStatus, (t: TaskStatus) => t.project)
  @Field(() => [TaskStatus])
  public taskStatuses!: Promise<TaskStatus[]>;
}
