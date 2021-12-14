import { GithubPr } from "@dewo/api/models/GithubPr";
import { Task } from "@dewo/api/models/Task";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GithubPrService } from "./githubPr.service";

@Module({
  imports: [TypeOrmModule.forFeature([GithubPr, Task])],
  providers: [GithubPrService],
  exports: [GithubPrService],
})
export class GithubPrModule {}
