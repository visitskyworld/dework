import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Task } from "./Task";

@Entity()
@ObjectType()
export class GithubBranch extends Audit {
  @Column()
  @Field()
  public name!: string;

  @Column()
  @Field()
  public link!: string;

  @Column()
  @Field()
  public repository!: string;

  @JoinColumn()
  @ManyToOne(() => Task)
  @Field(() => Task)
  public task!: Promise<Task>;
  @Column({ type: "uuid" })
  @Field()
  public taskId!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public deletedAt?: Date;
}
