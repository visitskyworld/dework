import { PaymentToken } from "./PaymentToken";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { Audit } from "./Audit";
import { Project } from "./Project";
import { OrganizationIntegration } from "./OrganizationIntegration";
import { OrganizationTag } from "./OrganizationTag";
import { EntityDetail } from "./EntityDetail";
import { Workspace } from "./Workspace";
import { Role } from "./rbac/Role";
import { TaskView } from "./TaskView";
import { FundingSession } from "./funding/FundingSession";

@Entity()
@ObjectType()
export class Organization extends Audit {
  @Column()
  @Field()
  public name!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public tagline?: string;

  @Column({ nullable: true, length: 4096 })
  @Field({ nullable: true })
  public description?: string;

  @Column({ nullable: true, length: 1024 })
  @Field({ nullable: true })
  public imageUrl?: string;

  @Column({ unique: true })
  @Field()
  public slug!: string;

  @ManyToMany(() => OrganizationTag, { eager: true })
  @JoinTable({ name: "organization_tag_map" })
  @Field(() => [OrganizationTag])
  public tags!: OrganizationTag[];

  @ManyToMany(() => PaymentToken)
  @JoinTable({ name: "organization_token" })
  @Field(() => [PaymentToken])
  public tokens!: Promise<PaymentToken[]>;

  @OneToMany(() => Project, (p: Project) => p.organization)
  @Field(() => [Project])
  public projects!: Promise<Project[]>;

  @OneToMany(() => Workspace, (x: Workspace) => x.organization)
  @Field(() => [Workspace])
  public workspaces!: Promise<Workspace[]>;

  @OneToMany(() => FundingSession, (x: FundingSession) => x.organization)
  @Field(() => [FundingSession])
  public fundingSessions!: Promise<FundingSession[]>;

  @OneToMany(() => EntityDetail, (d: EntityDetail) => d.organization)
  @Field(() => [EntityDetail])
  public details!: Promise<EntityDetail[]>;

  @OneToMany(
    () => OrganizationIntegration,
    (o: OrganizationIntegration) => o.organization
  )
  @Field(() => [OrganizationIntegration])
  public integrations!: Promise<OrganizationIntegration[]>;

  @OneToMany(() => Role, (x: Role) => x.organization)
  @Field(() => [Role])
  public roles!: Promise<Role[]>;

  @Column({ default: false })
  @Field()
  public featured!: boolean;

  @Column({ default: false })
  @Field()
  public mintTaskNFTs!: boolean;

  @OneToMany(() => TaskView, (p: TaskView) => p.organization)
  @Field(() => [TaskView])
  public taskViews!: Promise<TaskView[]>;

  @DeleteDateColumn()
  @Field({ nullable: true })
  public deletedAt?: Date;

  @Field(() => Int)
  public userCount?: number;
}
