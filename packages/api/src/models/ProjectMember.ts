import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinColumn,
  PrimaryColumn,
  ManyToOne,
  Index,
} from "typeorm";
import { Audit } from "./Audit";
import { Project } from "./Project";
import { User } from "./User";

export enum ProjectRole {
  ADMIN = "ADMIN",
  CONTRIBUTOR = "CONTRIBUTOR",
}

registerEnumType(ProjectRole, { name: "ProjectRole" });

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

  @Column({ enum: ProjectRole })
  @Field(() => ProjectRole)
  public role!: ProjectRole;
}
