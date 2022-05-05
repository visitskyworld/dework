import { Field, ObjectType } from "@nestjs/graphql";
import { Length } from "class-validator";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { Audit } from "./Audit";
import { Threepid } from "./Threepid";
import { EntityDetail } from "./EntityDetail";
import { Role } from "./rbac/Role";
import { UserRole } from "./rbac/UserRole";
import { TaskGatingDefault } from "./TaskGatingDefault";
import { UserPrompt } from "./UserPrompt";
import { TaskView } from "./TaskView";
import { Skill } from "./Skill";

@Entity()
@ObjectType()
export class User extends Audit {
  @Column({ unique: true })
  @Field()
  @Length(1)
  public username!: string;

  @Column({ nullable: true, length: 4096 })
  @Field({ nullable: true })
  public bio?: string;

  @Column({ nullable: true, length: 1024 })
  @Field({ nullable: true })
  public imageUrl?: string;

  @OneToMany(() => Threepid, (t: Threepid) => t.user)
  @Field(() => [Threepid])
  public threepids!: Promise<Threepid[]>;

  @OneToMany(() => EntityDetail, (t: EntityDetail) => t.user)
  @Field(() => [EntityDetail])
  public details!: Promise<EntityDetail[]>;

  @OneToMany(() => TaskGatingDefault, (x) => x.user)
  @Field(() => [TaskGatingDefault])
  public taskGatingDefaults!: Promise<TaskGatingDefault[]>;

  @OneToMany(() => UserPrompt, (x) => x.user)
  @Field(() => [UserPrompt])
  public prompts!: Promise<UserPrompt[]>;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: "user_role",
    joinColumn: { name: "userId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "roleId", referencedColumnName: "id" },
  })
  @Field(() => [Role])
  public roles!: Promise<Role[]>;

  @OneToMany(() => TaskView, (p: TaskView) => p.user)
  @Field(() => [TaskView])
  public taskViews!: Promise<TaskView[]>;

  @ManyToMany(() => Skill)
  @JoinTable({ name: "user_skill" })
  @Field(() => [Skill])
  public skills!: Promise<Skill[]>;

  @OneToMany(() => UserRole, (x) => x.user)
  @Field(() => [UserRole])
  public userRoles!: Promise<UserRole[]>;
}
