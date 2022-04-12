import { Args, Context, Mutation } from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { User } from "@dewo/api/models/User";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { UserPromptService } from "./userPrompt.service";
import { UserPrompt } from "@dewo/api/models/UserPrompt";
import { UpdateUserPromptInput } from "./dto/UpdateUserPrompt";

@Injectable()
export class UserPromptResolver {
  constructor(private readonly service: UserPromptService) {}

  @Mutation(() => UserPrompt)
  @UseGuards(AuthGuard)
  public async updateUserPrompt(
    @Context("user") user: User,
    @Args("input") input: UpdateUserPromptInput
  ): Promise<UserPrompt> {
    return this.service.update({ userId: user.id, ...input });
  }
}
