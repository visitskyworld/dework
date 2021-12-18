import encoder from "uuid-base62";
import { Field, ObjectType } from "@nestjs/graphql";
import slugify from "slugify";
import { AfterLoad, Column, Entity, OneToMany } from "typeorm";
import { Audit } from "./Audit";
import { OrganizationMember } from "./OrganizationMember";
import { Project } from "./Project";

@Entity()
@ObjectType()
export class Organization extends Audit {
  @Column()
  @Field()
  public name!: string;

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

  @OneToMany(
    () => OrganizationMember,
    (om: OrganizationMember) => om.organization
  )
  @Field(() => [OrganizationMember])
  public members!: Promise<OrganizationMember[]> | OrganizationMember[];

  @OneToMany(() => Project, (p: Project) => p.organization)
  @Field(() => [Project])
  public projects!: Promise<Project[]>;

  @Column({ default: false })
  @Field()
  public featured!: boolean;
}
