import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";
import { Task } from "./Task";

@Entity()
@ObjectType()
export class Skill extends Audit {
  @Column()
  @Field()
  public name!: string;

  @ManyToMany(() => User)
  @JoinTable({ name: "user_skill" })
  @Field(() => [User])
  public users!: Promise<User[]>;

  @ManyToMany(() => Task)
  @JoinTable({ name: "task_skill" })
  @Field(() => [User])
  public tasks!: Promise<Task[]>;
}
