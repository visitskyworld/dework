import { Context, Query } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { User } from "@dewo/api/models/User";
import { GraphQLAuthGuard } from "../auth/auth.guard";

export class UserResolver {
  // constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(GraphQLAuthGuard)
  public me(@Context("user") user: User): User {
    return user;
  }
}
