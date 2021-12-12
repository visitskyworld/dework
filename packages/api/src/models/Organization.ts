import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany } from "typeorm";
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

  @OneToMany(
    () => OrganizationMember,
    (om: OrganizationMember) => om.organization
  )
  @Field(() => [OrganizationMember])
  public members!: Promise<OrganizationMember[]> | OrganizationMember[];

  @OneToMany(() => Project, (p: Project) => p.organization)
  @Field(() => [Project])
  public projects!: Promise<Project[]>;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public popular?: boolean;
}
