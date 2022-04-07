import { Field, ObjectType } from "@nestjs/graphql";
import { Length } from "class-validator";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Audit } from "./Audit";
import { Threepid } from "./Threepid";
import { EntityDetail } from "./EntityDetail";
import { UserOnboarding } from "./UserOnboarding";
import { Role } from "./rbac/Role";
import { UserRole } from "./rbac/UserRole";
import { TaskGatingDefault } from "./TaskGatingDefault";

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

  @OneToOne(() => UserOnboarding, (x) => x.user, { nullable: true })
  @Field(() => UserOnboarding, { nullable: true })
  public onboarding?: Promise<UserOnboarding>;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: "user_role",
    joinColumn: { name: "userId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "roleId", referencedColumnName: "id" },
  })
  @Field(() => [Role])
  public roles!: Promise<Role[]>;

  @OneToMany(() => UserRole, (x) => x.user)
  @Field(() => [UserRole])
  public userRoles!: Promise<UserRole[]>;
}
