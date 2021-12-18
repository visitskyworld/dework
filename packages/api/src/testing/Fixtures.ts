import { Injectable, Module } from "@nestjs/common";
import { Threepid, ThreepidSource } from "../models/Threepid";
import { User } from "../models/User";
import { UserModule } from "../modules/user/user.module";
import { UserService } from "../modules/user/user.service";
import faker from "faker";
import Bluebird from "bluebird";
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
import { InviteService } from "../modules/invite/invite.service";
import { InviteModule } from "../modules/invite/invite.module";
import { Invite } from "../models/Invite";
import { PaymentModule } from "../modules/payment/payment.module";
import { PaymentService } from "../modules/payment/payment.service";
import { PaymentMethod, PaymentMethodType } from "../models/PaymentMethod";
import { DeepPartial } from "typeorm";
import { OrganizationMember } from "../models/OrganizationMember";
import { DeepAtLeast } from "../types/general";
import { ProjectIntegration } from "../models/ProjectIntegration";

@Injectable()
export class Fixtures {
  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
    private readonly threepidService: ThreepidService,
    private readonly inviteService: InviteService,
    private readonly paymentService: PaymentService
  ) {}

  public async createThreepid(
    partial: Partial<Threepid> = {}
  ): Promise<Threepid> {
    return this.threepidService.create({
      source: ThreepidSource.discord,
      threepid: faker.datatype.uuid(),
      config: {
        profile: {
          avatar: faker.internet.avatar(),
          username: faker.internet.userName(),
        },
      } as any,
      ...partial,
    });
  }

  public async createUser(partial: Partial<Threepid> = {}): Promise<User> {
    const threepid = await this.createThreepid(partial);
    return this.userService.authWithThreepid(threepid.id);
  }

  public async createOrganization(
    partial: DeepPartial<Organization> = {},
    creator?: User,
    members?: Pick<OrganizationMember, "userId" | "role">[]
  ): Promise<Organization> {
    const organization = await this.organizationService.create(
      {
        name: faker.company.companyName(),
        ...partial,
      },
      creator ?? (await this.createUser())
    );

    if (!members) return organization;
    return Bluebird.reduce(
      members,
      (_, member) =>
        this.organizationService.addUser(
          organization.id,
          member.userId,
          member.role
        ),
      organization
    );
  }

  public async createProject(partial: Partial<Project> = {}): Promise<Project> {
    return this.projectService.create({
      name: faker.company.companyName(),
      organizationId: await this.createOrganization().then((o) => o.id),
      ...partial,
    });
  }

  public async createProjectIntegation(
    partial: DeepAtLeast<ProjectIntegration, "projectId" | "source" | "config">
  ): Promise<ProjectIntegration> {
    return this.projectService.createIntegration({
      creatorId: await this.createUser().then((u) => u.id),
      ...partial,
    });
  }

  public async createTask(partial: DeepPartial<Task> = {}): Promise<Task> {
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

  public async createInvite(
    partial: Partial<Invite> = {},
    user?: User
  ): Promise<Invite> {
    return this.inviteService.create(
      partial,
      user ?? (await this.createUser())
    );
  }

  public async createPaymentMethod(
    partial: Partial<PaymentMethod> = {},
    user?: User
  ): Promise<PaymentMethod> {
    return this.paymentService.create(
      {
        type: PaymentMethodType.METAMASK,
        address: "0x0000000000000000000000000000000000000000",
        ...partial,
      },
      user ?? (await this.createUser())
    );
  }

  public createAuthToken(user: User): string {
    return this.userService.createAuthToken(user);
  }

  public async createUserOrgProject(
    partial: {
      user?: Partial<User>;
      organization?: DeepPartial<Organization>;
      project?: Partial<Project>;
    } = {}
  ): Promise<{
    user: User;
    organization: Organization;
    project: Project;
  }> {
    const user = await this.createUser(partial.user);
    const organization = await this.createOrganization(
      partial.organization,
      user
    );
    const project = await this.createProject({
      ...partial.project,
      organizationId: organization.id,
    });
    return { user, organization, project };
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
    PaymentModule,
  ],
  providers: [Fixtures],
})
export class FixturesModule {}
