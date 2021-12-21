import { Field, ObjectType } from "@nestjs/graphql";
import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Audit } from "./Audit";
import { Organization } from "./Organization";
import { PaymentMethod } from "./PaymentMethod";
import { ProjectIntegration } from "./ProjectIntegration";
import { Task } from "./Task";
import { TaskTag } from "./TaskTag";
import slugify from "slugify";
import encoder from "uuid-base62";

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

  @Field()
  public slug!: string;

  @AfterLoad()
  getSlug() {
    const slug = slugify(this.name.slice(0, 12), { lower: true, strict: true });
    this.slug = `${slug}-${encoder.encode(this.id)}`;
  }

  @OneToMany(() => Task, (t: Task) => t.project)
  @Field(() => [Task])
  public tasks!: Promise<Task[]>;

  @OneToMany(() => TaskTag, (t: TaskTag) => t.project)
  @Field(() => [TaskTag])
  public taskTags!: Promise<TaskTag[]>;

  @OneToMany(() => ProjectIntegration, (p: ProjectIntegration) => p.project)
  @Field(() => [ProjectIntegration])
  public integrations!: Promise<ProjectIntegration[]>;

  @OneToMany(() => PaymentMethod, (p: PaymentMethod) => p.project)
  @Field(() => [PaymentMethod])
  public paymentMethods!: Promise<PaymentMethod[]>;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public deletedAt?: Date;
}
