import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";

enum ThreepidSource {
  github = "github",
}

interface GithubThreepidConfig {
  accessToken: string;
  refreshToken: string;
}

interface ThreepidConfigMap extends Record<ThreepidSource, any> {
  [ThreepidSource.github]: GithubThreepidConfig;
}

@Entity()
@ObjectType()
export class Threepid extends Audit {
  @Field()
  @Column({ unique: true })
  public threepid!: string;

  @Field()
  @Column("enum", { enum: ThreepidSource })
  public source!: ThreepidSource;

  @Column("json")
  public config!: ThreepidConfigMap[ThreepidSource];

  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  public user!: Promise<User | undefined>;
  @Column()
  @Field({ nullable: true })
  public userId?: string;
}
