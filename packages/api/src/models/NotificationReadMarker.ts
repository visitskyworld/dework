import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";

@Entity()
@ObjectType()
export class NotificationReadMarker extends Audit {
  @JoinColumn()
  @OneToOne(() => User)
  @Field(() => User)
  public user!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public userId!: string;

  @Column()
  @Field()
  public readAt!: Date;
}
