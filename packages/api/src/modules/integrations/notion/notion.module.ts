import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { NotionImportService } from "./notion.import.service";

@Module({
  imports: [TypeOrmModule.forFeature([ProjectIntegration])],
  providers: [NotionImportService],
})
export class NotionModule {}
