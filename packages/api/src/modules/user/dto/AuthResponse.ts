import { User } from "@dewo/api/models/User";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AuthResponse {
  @Field()
  public authToken!: string;

  @Field()
  public user!: User;
}
