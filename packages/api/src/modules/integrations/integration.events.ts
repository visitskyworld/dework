import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";

export class ProjectIntegrationCreatedEvent {
  constructor(public readonly projectIntegration: ProjectIntegration) {}
}

export class ProjectIntegrationUpdatedEvent {
  constructor(public readonly projectIntegration: ProjectIntegration) {}
}
