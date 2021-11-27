import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Profile as DiscordProfile } from "passport-discord";
import { Profile as GithubProfile } from "passport-github";
import { Audit } from "./Audit";
import { User } from "./User";

export enum ThreepidSource {
  github = "github",
  discord = "discord",
}

export interface GithubThreepidConfig {
  accessToken: string;
  refreshToken: undefined;
  profile: GithubProfile;
}

export interface DiscordThreepidConfig {
  accessToken: string;
  refreshToken: string;
  profile: DiscordProfile;
}

interface ThreepidConfigMap extends Record<ThreepidSource, any> {
  [ThreepidSource.github]: GithubThreepidConfig;
  [ThreepidSource.discord]: DiscordThreepidConfig;
}

@Entity()
@ObjectType()
@Index("IDX_unique_threepid_source", ["threepid", "source"], { unique: true })
export class Threepid<
  TSource extends ThreepidSource = ThreepidSource
> extends Audit {
  @Field()
  @Column()
  public threepid!: string;

  @Field()
  @Column("enum", { enum: ThreepidSource })
  public source!: TSource;

  @Column("json")
  public config!: ThreepidConfigMap[TSource];

  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  public user!: Promise<User | undefined>;
  @Column({ nullable: true })
  @Field({ nullable: true })
  public userId?: string;
}
