import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { ProjectRole } from "./enums/ProjectRole";
import { PaymentToken } from "./PaymentToken";
import { Project } from "./Project";

@ObjectType()
@Entity()
export class ProjectTokenGate extends Audit {
  @JoinColumn()
  @ManyToOne(() => Project)
  @Field(() => Project)
  public project!: Promise<Project>;
  @Column({ type: "uuid" })
  @Field()
  public projectId!: string;

  @JoinColumn()
  @ManyToOne(() => PaymentToken)
  @Field(() => PaymentToken)
  public token!: Promise<PaymentToken>;
  @Column({ type: "uuid" })
  @Field()
  public tokenId!: string;

  @Column("enum", { enum: ProjectRole })
  @Field(() => ProjectRole)
  public role!: ProjectRole;
}
