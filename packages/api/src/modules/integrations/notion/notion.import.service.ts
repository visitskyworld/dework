import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class NotionImportService {
  constructor(
    @InjectRepository(ProjectIntegration)
    private readonly projectIntegrationRepo: Repository<ProjectIntegration>
  ) {}

  public async createTasksFromNotionPage(projectId: string) {
    console.warn("waoers...");
  }
}
