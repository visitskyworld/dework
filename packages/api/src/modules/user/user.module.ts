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
import { PermalinkModule } from "../permalink/permalink.module";
import { DiscordRolesModule } from "../integrations/discord/roles/discord.roles.module";
import { FileUploadModule } from "../fileUpload/fileUpload.module";
import { UserPromptModule } from "./prompt/userPrompt.module";
import { TaskViewModule } from "../task/taskView/taskView.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EntityDetail, Organization, Project, Task]),
    FileUploadModule,
    ThreepidModule,
    PermalinkModule,
    DiscordRolesModule,
    UserPromptModule,
    TaskViewModule,
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
