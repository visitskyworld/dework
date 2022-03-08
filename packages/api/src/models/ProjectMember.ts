import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinColumn,
  PrimaryColumn,
  ManyToOne,
  Index,
} from "typeorm";
import { Audit } from "./Audit";
import { ProjectRole } from "./enums/ProjectRole";
import { Project } from "./Project";
import { User } from "./User";

@ObjectType()
@Entity()
@Index("IDX_unique_user_project", ["userId", "projectId"], {
  unique: true,
})
export class ProjectMember extends Audit {
  @JoinColumn()
  @ManyToOne(() => Project)
  @Field(() => Project)
  public project!: Promise<Project>;
  @PrimaryColumn({ type: "uuid" })
  @Field()
  public projectId!: string;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public user!: Promise<User>;
  @PrimaryColumn({ type: "uuid" })
  @Field()
  public userId!: string;

  @Column("enum", { enum: ProjectRole })
  @Field(() => ProjectRole)
  public role!: ProjectRole;
}
