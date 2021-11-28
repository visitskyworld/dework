import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  PrimaryColumn,
} from "typeorm";
import GraphQLUUID from "graphql-type-uuid";

@ObjectType({ isAbstract: true })
export abstract class Audit {
  @PrimaryColumn({ type: "uuid" })
  @Generated("uuid")
  @Field(() => GraphQLUUID)
  public id!: string;

  @Column()
  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Column()
  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;
}
