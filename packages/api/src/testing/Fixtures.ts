import { Injectable, Module } from "@nestjs/common";
import { Threepid, ThreepidSource } from "../models/Threepid";
import { User } from "../models/User";
import { UserModule } from "../modules/user/user.module";
import { UserService } from "../modules/user/user.service";
import faker from "faker";
import { ThreepidService } from "../modules/threepid/threepid.service";
import { ThreepidModule } from "../modules/threepid/threepid.module";
import { Organization } from "../models/Organization";
import { OrganizationModule } from "../modules/organization/organization.module";
import { OrganizationService } from "../modules/organization/organization.service";
import { ProjectModule } from "../modules/project/project.module";
import { TaskModule } from "../modules/task/task.module";
import { Project } from "../models/Project";
import { ProjectService } from "../modules/project/project.service";
import { Task, TaskStatusEnum } from "../models/Task";
import { TaskService } from "../modules/task/task.service";
import { TaskTag } from "../models/TaskTag";
import { TaskStatus } from "../models/TaskStatus";
import { InviteService } from "../modules/invite/invite.service";
import { InviteModule } from "../modules/invite/invite.module";
import { Invite } from "../models/Invite";

@Injectable()
export class Fixtures {
  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
    private readonly threepidService: ThreepidService,
    private readonly inviteService: InviteService
  ) {}

  public async createThreepid(
    partial: Partial<Threepid> = {}
  ): Promise<Threepid> {
    return this.threepidService.create({
      source: ThreepidSource.discord,
      threepid: faker.datatype.uuid(),
      config: { profile: { avatar: faker.internet.avatar() } } as any,
      ...partial,
    });
  }

  public async createUser(partial: Partial<Threepid> = {}): Promise<User> {
    const threepid = await this.createThreepid(partial);
    return this.userService.authWithThreepid(threepid.id);
  }

  public async createOrganization(
    partial: Partial<Organization> = {}
  ): Promise<Organization> {
    return this.organizationService.create({
      name: faker.company.companyName(),
      ...partial,
    });
  }

  public async createProject(partial: Partial<Project> = {}): Promise<Project> {
    return this.projectService.create({
      name: faker.company.companyName(),
      organizationId: await this.createOrganization().then((o) => o.id),
      ...partial,
    });
  }

  public async createTask(partial: Partial<Task> = {}): Promise<Task> {
    const defaultProjectId = await this.createProject().then((p) => p.id);
    return this.taskService.create({
      name: faker.company.companyName(),
      projectId: defaultProjectId,
      status: TaskStatusEnum.TODO,
      sortKey: String(Date.now()),
      // statusId: await this.createTaskStatus({
      //   projectId: defaultProjectId,
      // }).then((s) => s.id),
      ...partial,
    });
  }

  public async createTaskTag(partial: Partial<TaskTag> = {}): Promise<TaskTag> {
    return this.projectService.createTag({
      label: faker.company.companyName(),
      color: "red",
      projectId: await this.createProject().then((p) => p.id),
      ...partial,
    });
  }

  public async createTaskStatus(
    partial: Partial<TaskStatus> = {}
  ): Promise<TaskStatus> {
    return this.projectService.createStatus({
      label: faker.company.companyName(),
      sortKey: String(Date.now()),
      projectId: await this.createProject().then((p) => p.id),
      ...partial,
    });
  }

  public async createInvite(
    partial: Partial<Invite> = {},
    user?: User
  ): Promise<Invite> {
    return this.inviteService.create(
      partial,
      user ?? (await this.createUser())
    );
  }

  public createAuthToken(user: User): string {
    return this.userService.createAuthToken(user);
  }
}

@Module({
  imports: [
    ThreepidModule,
    UserModule,
    OrganizationModule,
    ProjectModule,
    TaskModule,
    InviteModule,
  ],
  providers: [Fixtures],
})
export class FixturesModule {}
