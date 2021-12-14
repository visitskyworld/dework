import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Task } from "./Task";

export enum GithubPrStatusEnum {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  DONE = "CLOSED",
}

registerEnumType(GithubPrStatusEnum, { name: "GithubPrStatusEnum" });

@Entity()
@ObjectType()
export class GithubPr extends Audit {
  @Column()
  @Field()
  public title!: string;

  @Column()
  @Field()
  public link!: string;

  @Column({ enum: GithubPrStatusEnum })
  @Field(() => GithubPrStatusEnum)
  public status!: GithubPrStatusEnum;

  @JoinColumn()
  @ManyToOne(() => Task)
  @Field(() => Task)
  public task!: Promise<Task>;
  @Column({ type: "uuid" })
  @Field()
  public taskId!: string;
}
