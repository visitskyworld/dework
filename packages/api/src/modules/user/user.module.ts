import { Organization } from "@dewo/api/models/Organization";
import { Project } from "@dewo/api/models/Project";
import { Task } from "@dewo/api/models/Task";
import { User } from "@dewo/api/models/User";
import { EntityDetail } from "@dewo/api/models/EntityDetail";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThreepidModule } from "../threepid/threepid.module";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";
import { UserOnboarding } from "@dewo/api/models/UserOnboarding";
import { PermalinkModule } from "../permalink/permalink.module";
import { DiscordRolesModule } from "../integrations/discord/roles/discord.roles.module";
import { FileUploadModule } from "../fileUpload/fileUpload.module";
import { UserPromptModule } from "./prompt/userPrompt.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserOnboarding,
      EntityDetail,
      Organization,
      Project,
      Task,
    ]),
    FileUploadModule,
    ThreepidModule,
    PermalinkModule,
    DiscordRolesModule,
    UserPromptModule,
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
