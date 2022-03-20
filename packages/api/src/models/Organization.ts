import encoder from "uuid-base62";
import { Field, ObjectType } from "@nestjs/graphql";
import slugify from "slugify";
import {
  AfterLoad,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { Audit } from "./Audit";
import { OrganizationMember } from "./OrganizationMember";
import { Project } from "./Project";
import { OrganizationIntegration } from "./OrganizationIntegration";
import { OrganizationTag } from "./OrganizationTag";
import { EntityDetail } from "./EntityDetail";
import { ProjectSection } from "./ProjectSection";
import { Role } from "./rbac/Role";

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

  @Field()
  public slug!: string;

  @AfterLoad()
  getSlug() {
    const slug = slugify(this.name.slice(0, 12), { lower: true, strict: true });
    this.slug = `${slug}-${encoder.encode(this.id)}`;
  }

  @ManyToMany(() => OrganizationTag, { eager: true })
  @JoinTable({ name: "organization_tag_map" })
  @Field(() => [OrganizationTag])
  public tags!: OrganizationTag[];

  @OneToMany(
    () => OrganizationMember,
    (om: OrganizationMember) => om.organization
  )
  public members!: Promise<OrganizationMember[]>;

  @OneToMany(() => Project, (p: Project) => p.organization)
  @Field(() => [Project])
  public projects!: Promise<Project[]>;

  @OneToMany(() => ProjectSection, (p: ProjectSection) => p.organization)
  @Field(() => [ProjectSection])
  public projectSections!: Promise<ProjectSection[]>;

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

  @Column({ nullable: true })
  @Field({ nullable: true })
  public deletedAt?: Date;
}
