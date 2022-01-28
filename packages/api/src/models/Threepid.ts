import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Profile as DiscordProfile } from "passport-discord";
import { Profile as GithubPullRequestofile } from "passport-github";
import { Audit } from "./Audit";
import { User } from "./User";
import { NotionOAuthToken } from "passport-notion/lib/passport-notion/strategy";

export enum ThreepidSource {
  github = "github",
  discord = "discord",
  metamask = "metamask",
  notion = "notion",
}

export interface GithubThreepidConfig {
  accessToken: string;
  refreshToken: undefined;
  profile: GithubPullRequestofile;
}

export interface DiscordThreepidConfig {
  accessToken: string;
  refreshToken: string;
  profile: DiscordProfile;
}

export interface NotionThreepidConfig {
  accessToken: string;
  profile: NotionOAuthToken;
}

export interface MetamaskThreepidConfig {
  message: string;
  signature: string;
}

interface ThreepidConfigMap extends Record<ThreepidSource, any> {
  [ThreepidSource.github]: GithubThreepidConfig;
  [ThreepidSource.discord]: DiscordThreepidConfig;
  [ThreepidSource.metamask]: MetamaskThreepidConfig;
  [ThreepidSource.notion]: NotionThreepidConfig;
}

registerEnumType(ThreepidSource, { name: "ThreepidSource" });

@Entity()
@ObjectType()
@Index("IDX_unique_threepid_source", ["threepid", "source"], { unique: true })
export class Threepid<
  TSource extends ThreepidSource = ThreepidSource
> extends Audit {
  @Field()
  @Column()
  public threepid!: string;

  @Field(() => ThreepidSource)
  @Column("enum", { enum: ThreepidSource })
  public source!: TSource;

  @Column("json")
  public config!: ThreepidConfigMap[TSource];

  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  public user!: Promise<User | undefined>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public userId?: string;
}
