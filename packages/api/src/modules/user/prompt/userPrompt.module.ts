import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserPromptService } from "./userPrompt.service";
import { UserPromptResolver } from "./userPrompt.resolver";
import { UserPrompt } from "@dewo/api/models/UserPrompt";
import { UserPromptTaskUpdatedEventHandler } from "./userPrompt.eventHandlers";

@Module({
  imports: [TypeOrmModule.forFeature([UserPrompt])],
  providers: [
    UserPromptService,
    UserPromptResolver,
    UserPromptTaskUpdatedEventHandler,
  ],
  exports: [UserPromptService],
})
export class UserPromptModule {}
