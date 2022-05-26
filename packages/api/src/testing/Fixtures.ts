import { Injectable, Module } from "@nestjs/common";
import { Threepid, ThreepidSource } from "../models/Threepid";
import { User } from "../models/User";
import { UserModule } from "../modules/user/user.module";
import { UserService } from "../modules/user/user.service";
import faker from "faker";
import { ethers } from "ethers";
import { ThreepidService } from "../modules/threepid/threepid.service";
import { ThreepidModule } from "../modules/threepid/threepid.module";
import { Organization } from "../models/Organization";
import { OrganizationModule } from "../modules/organization/organization.module";
import { OrganizationService } from "../modules/organization/organization.service";
import { ProjectModule } from "../modules/project/project.module";
import { TaskModule } from "../modules/task/task.module";
import { Project } from "../models/Project";
import { ProjectService } from "../modules/project/project.service";
import { Task, TaskStatus } from "../models/Task";
import { TaskService } from "../modules/task/task.service";
import { TaskTag } from "../models/TaskTag";
import { GithubService } from "../modules/integrations/github/github.service";
import { GithubBranch } from "../models/GithubBranch";
import {
  GithubPullRequest,
  GithubPullRequestStatus,
} from "../models/GithubPullRequest";
import { GithubIntegrationModule } from "../modules/integrations/github/github.module";
import { InviteService } from "../modules/invite/invite.service";
import { InviteModule } from "../modules/invite/invite.module";
import { Invite } from "../models/Invite";
import { PaymentModule } from "../modules/payment/payment.module";
import { PaymentService } from "../modules/payment/payment.service";
import { PaymentMethod, PaymentMethodType } from "../models/PaymentMethod";
import { DeepPartial } from "typeorm";
import { AtLeast, DeepAtLeast } from "../types/general";
import {
  DiscordProjectIntegrationFeature,
  GithubProjectIntegrationFeature,
  ProjectIntegration,
  ProjectIntegrationType,
} from "../models/ProjectIntegration";
import { PaymentNetwork, PaymentNetworkType } from "../models/PaymentNetwork";
import { PaymentToken, PaymentTokenType } from "../models/PaymentToken";
import { Payment, PaymentData } from "../models/Payment";
import { IntegrationService } from "../modules/integrations/integration.service";
import { IntegrationModule } from "../modules/integrations/integration.module";
import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "../models/OrganizationIntegration";
import { GithubIssue } from "../models/GithubIssue";
import { ProjectTokenGate } from "../models/ProjectTokenGate";
import { ProjectTokenGateInput } from "../modules/project/dto/ProjectTokenGateInput";
import { TaskSubmission } from "../models/TaskSubmission";
import { TaskApplication } from "../models/TaskApplication";
import { RbacService } from "../modules/rbac/rbac.service";
import { Role } from "../models/rbac/Role";
import { Rule } from "../models/rbac/Rule";
import { RbacModule } from "../modules/rbac/rbac.module";
import { RulePermission } from "../models/enums/RulePermission";
import { TaskApplicationModule } from "../modules/task/taskApplication/taskApplication.module";
import { TaskApplicationService } from "../modules/task/taskApplication/taskApplication.service";
import { NotificationModule } from "../modules/notification/notification.module";
import { NotificationService } from "../modules/notification/notification.service";
import { Notification } from "../models/Notification";
import { FundingModule } from "../modules/funding/funding.module";
import { FundingService } from "../modules/funding/funding.service";
import { FundingSession } from "../models/funding/FundingSession";
import { WorkspaceService } from "../modules/workspace/workspace.service";
import { Workspace } from "../models/Workspace";
import { SkillService } from "../modules/skill/skill.service";
import { WorkspaceModule } from "../modules/workspace/workspace.module";
import { SkillModule } from "../modules/skill/skill.module";
import { Skill } from "../models/Skill";

@Injectable()
export class Fixtures {
  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    private readonly projectService: ProjectService,
    private readonly integrationService: IntegrationService,
    private readonly taskService: TaskService,
    private readonly taskApplicationService: TaskApplicationService,
    private readonly githubService: GithubService,
    private readonly threepidService: ThreepidService,
    private readonly inviteService: InviteService,
    private readonly paymentService: PaymentService,
    private readonly rbacService: RbacService,
    private readonly notificationService: NotificationService,
    private readonly fundingService: FundingService,
    private readonly workspaceService: WorkspaceService,
    private readonly skillService: SkillService
  ) {}

  public async createThreepid(
    partial: Partial<Threepid> = {}
  ): Promise<Threepid> {
    const existing = await this.threepidService.findOne({
      source: partial.source,
      threepid: partial.threepid,
    });
    return this.threepidService.create({
      ...existing,
      source: ThreepidSource.discord,
      threepid: faker.datatype.uuid(),
      config: {
        profile: {
          avatar: faker.internet.avatar(),
          username: faker.internet.userName(),
        },
      } as any,
      ...partial,
      userId: null as any,
    });
  }

  public async createUser(partial: Partial<Threepid> = {}): Promise<User> {
    const threepid = await this.createThreepid(partial);
    return this.userService.authWithThreepid(threepid.id);
  }

  public async createOrganization(
    partial: Partial<Organization> = {},
    creator?: User
  ): Promise<Organization> {
    const organization = await this.organizationService.create(
      {
        name: faker.company.companyName(),
        ...partial,
      },
      creator ?? (await this.createUser())
    );

    return this.organizationService.findById(
      organization.id
    ) as Promise<Organization>;
  }

  public async createProject(
    partialProject: Partial<Project> = {},
    creator?: User
  ): Promise<Project> {
    const organization = await this.createOrganization({}, creator);
    return this.projectService.create({
      name: faker.company.companyName(),
      organizationId: organization.id,
      ...partialProject,
    });
  }

  public async createWorkspace(
    partial: Partial<Workspace> = {}
  ): Promise<Workspace> {
    const organization = await this.createOrganization();
    return this.workspaceService.create({
      name: faker.company.companyName(),
      organizationId: organization.id,
      ...partial,
    });
  }

  public async createProjectIntegration(
    partial: AtLeast<ProjectIntegration, "projectId" | "type" | "config">
  ): Promise<ProjectIntegration> {
    return this.integrationService.createProjectIntegration({
      creatorId: await this.createUser().then((u) => u.id),
      ...partial,
    });
  }

  public async createOrganizationIntegration<
    T extends OrganizationIntegrationType
  >(
    partial: AtLeast<
      OrganizationIntegration<T>,
      "organizationId" | "type" | "config"
    >
  ): Promise<OrganizationIntegration<T>> {
    const integration =
      await this.integrationService.upsertOrganizationIntegration({
        creatorId: await this.createUser().then((u) => u.id),
        ...partial,
      });
    return integration as OrganizationIntegration<T>;
  }

  public async createTask(partial: DeepPartial<Task> = {}): Promise<Task> {
    const defaultProjectId = await this.createProject().then((p) => p.id);
    return this.taskService.create({
      name: faker.company.companyName(),
      projectId: defaultProjectId,
      status: TaskStatus.TODO,
      sortKey: String(Date.now()),
      ...partial,
      reward: !!partial.reward
        ? {
            amount: faker.datatype
              .number({ min: 1 * 10e18, max: 100 * 10e18 })
              .toString(),
            tokenId: await this.createPaymentToken().then((t) => t.id),
            ...partial.reward,
          }
        : undefined,
    });
  }

  public async getTask(id: string): Promise<Task | undefined> {
    return this.taskService.findById(id);
  }

  public async getUser(id: string): Promise<User | undefined> {
    return this.userService.findById(id);
  }

  public async getOrganization(id: string): Promise<Organization | undefined> {
    return this.organizationService.findById(id);
  }

  public async getOrganizationIntegration(
    id: string
  ): Promise<OrganizationIntegration | undefined> {
    return this.integrationService.findOrganizationIntegrationById(id);
  }

  public async updateTask(
    partial: DeepAtLeast<Task, "id">
  ): Promise<Task | undefined> {
    return this.taskService.update(partial);
  }

  public async updateProject(
    partial: DeepAtLeast<Project, "id">
  ): Promise<Project | undefined> {
    return this.projectService.update(partial);
  }

  public async updateOrganization(partial: DeepAtLeast<Organization, "id">) {
    await this.organizationService.update(partial);
  }

  public async createTaskTag(partial: Partial<TaskTag> = {}): Promise<TaskTag> {
    return this.projectService.createTag({
      label: faker.company.companyName(),
      color: "red",
      projectId: await this.createProject().then((p) => p.id),
      ...partial,
    });
  }

  public async createTaskSubmission(
    partial: Partial<TaskSubmission> = {}
  ): Promise<TaskSubmission> {
    return this.taskService.createSubmission({
      userId: await this.createUser().then((u) => u.id),
      taskId: await this.createTask().then((t) => t.id),
      content: faker.lorem.paragraph(),
      ...partial,
    });
  }

  public async createTaskApplication(
    partial: Partial<TaskApplication> = {}
  ): Promise<TaskApplication> {
    return this.taskApplicationService.create({
      userId: await this.createUser().then((u) => u.id),
      taskId: await this.createTask().then((t) => t.id),
      startDate: faker.datatype.datetime(),
      endDate: faker.datatype.datetime(),
      ...partial,
    });
  }

  public async createProjectTokenGate(
    input: ProjectTokenGateInput
  ): Promise<ProjectTokenGate> {
    return this.projectService.createTokenGate(input);
  }

  public async createGithubBranch(
    partial: DeepAtLeast<GithubBranch, "name">
  ): Promise<GithubBranch> {
    const task = this.createTask();
    return this.githubService.upsertBranch({
      name: partial.name ?? faker.datatype.string(),
      link: faker.datatype.string(),
      repo: faker.internet.userName(),
      organization: faker.internet.userName(),
      task,
      taskId: await task.then((t) => t.id),
    });
  }

  public async getGithubBranchbyName(
    branchName: string
  ): Promise<GithubBranch | undefined> {
    return this.githubService.findBranchByName(branchName);
  }

  public async createGithubPullRequest(
    partial: Partial<GithubPullRequest>
  ): Promise<GithubPullRequest> {
    const task = this.createTask();
    return this.githubService.createPullRequest({
      title: faker.datatype.string(),
      link: faker.datatype.string(),
      branchName: faker.datatype.string(),
      number: faker.datatype.number(),
      status: GithubPullRequestStatus.OPEN,
      task,
      taskId: await task.then((t) => t.id),
      ...partial,
    });
  }

  public async getGithubPullRequestByTaskId(
    taskId: string
  ): Promise<GithubPullRequest | undefined> {
    return this.githubService.findPullRequestByTaskId(taskId);
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

  public createPaymentNetwork(partial: Partial<PaymentNetwork> = {}) {
    return this.paymentService.createPaymentNetwork({
      name: faker.name.firstName(),
      slug: faker.internet.userName(),
      type: PaymentNetworkType.ETHEREUM,
      config: {
        chainId: -1,
        rpcUrl: faker.internet.url(),
        explorerUrl: faker.internet.url(),
      },
      ...partial,
    });
  }

  public async createPaymentToken(partial: Partial<PaymentToken> = {}) {
    return this.paymentService.createPaymentToken({
      networkId: await this.createPaymentNetwork().then((n) => n.id),
      type: PaymentTokenType.NATIVE,
      name: "Ether",
      symbol: "ETH",
      ...partial,
    });
  }

  public async createPaymentMethod(
    partial: Partial<PaymentMethod> = {},
    user?: User
  ): Promise<PaymentMethod> {
    return this.paymentService.createPaymentMethod(
      {
        type: PaymentMethodType.METAMASK,
        address: "0x0000000000000000000000000000000000000000",
        networkId: await this.createPaymentNetwork().then((n) => n.id),
        projectId: await this.createProject().then((p) => p.id),
        ...partial,
      },
      user ?? (await this.createUser())
    );
  }

  public async createPayment(data: {
    data?: PaymentData;
    networkId?: string;
    paymentMethod?: PaymentMethod;
    createdAt?: Date;
  }): Promise<Payment> {
    return this.paymentService.create(
      data.paymentMethod ?? (await this.createPaymentMethod()),
      data.networkId ?? (await this.createPaymentNetwork().then((n) => n.id)),
      data.data ?? { txHash: faker.datatype.uuid() },
      { createdAt: data.createdAt }
    );
  }

  public createAuthToken(user: User): string {
    return this.userService.createAuthToken(user);
  }

  public async createGithubIssue(
    partial: AtLeast<GithubIssue, "taskId">
  ): Promise<GithubIssue> {
    return this.githubService.createIssue({
      externalId: faker.datatype.number(100),
      number: faker.datatype.number(100),
      ...partial,
    });
  }

  public async createNotification(
    partial: AtLeast<Notification, "userId">
  ): Promise<Notification> {
    return this.notificationService.send({
      message: faker.lorem.paragraph(),
      taskId: await this.createTask().then((t) => t.id),
      ...partial,
    });
  }

  public async createUserOrgProject(
    partial: {
      user?: Partial<User>;
      organization?: Partial<Organization>;
      project?: Partial<Project>;
    } = {}
  ): Promise<{
    user: User;
    organization: Organization;
    project: Project;
  }> {
    const user = await this.createUser();
    if (!!partial.user) {
      await this.userService.update({ ...user, ...partial.user });
    }

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

  public async createProjectWithGithubIntegration(
    partialProject: Partial<Project> = {},
    features: GithubProjectIntegrationFeature[] = [],
    github: {
      installationId: number;
      organization: string;
      repo: string;
    } = {
      installationId: Date.now(),
      organization: faker.internet.userName(),
      repo: faker.internet.userName(),
    }
  ): Promise<{
    project: Project;
    integration: ProjectIntegration;
    github: {
      installationId: number;
      organization: string;
      repo: string;
    };
  }> {
    const project = await this.createProject(partialProject);
    const organizationIntegration = (await this.createOrganizationIntegration({
      organizationId: project.organizationId,
      type: OrganizationIntegrationType.GITHUB,
      config: { installationId: github.installationId },
    })) as OrganizationIntegration<OrganizationIntegrationType.GITHUB>;
    const integration = await this.createProjectIntegration({
      projectId: project.id,
      type: ProjectIntegrationType.GITHUB,
      organizationIntegrationId: organizationIntegration.id,
      config: {
        features,
        repo: github.repo,
        organization: github.organization,
      },
    });
    return { project, integration, github };
  }

  async createProjectWithDiscordIntegration(
    guildId: string,
    channelId: string
  ): Promise<{
    project: Project;
    organization: Organization;
  }> {
    const organization = await this.createOrganization();
    const project = await this.createProject({
      organizationId: organization.id,
    });
    const orgInt = await this.createOrganizationIntegration({
      organizationId: organization.id,
      type: OrganizationIntegrationType.DISCORD,
      config: { guildId, permissions: "" },
    });
    await this.createProjectIntegration({
      projectId: project.id,
      type: ProjectIntegrationType.DISCORD,
      config: {
        channelId,
        name: "test",
        features: [
          DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK,
        ],
      },
      organizationIntegrationId: orgInt.id,
    });
    return { project, organization };
  }

  public async createRole(
    partial: Partial<Role> = {},
    rules: AtLeast<Rule, "permission">[] = []
  ): Promise<Role> {
    const role = await this.rbacService.createRole({
      organizationId: await this.createOrganization().then((o) => o.id),
      name: faker.internet.userName(),
      color: "red",
      ...partial,
    });

    for (const rule of rules) {
      await this.rbacService.createRule({ ...rule, roleId: role.id });
    }

    return role;
  }

  public async createRule(partial: Partial<Rule> = {}): Promise<Rule> {
    return this.rbacService.createRule({
      roleId: await this.createRole().then((o) => o.id),
      permission: RulePermission.VIEW_PROJECTS,
      inverted: false,
      ...partial,
    });
  }

  async grantPermissions(
    userId: string,
    organizationId: string,
    rules: AtLeast<Rule, "permission">[],
    override: Partial<Role> = {}
  ) {
    const role = await this.createRole({ organizationId, ...override }, rules);
    await this.rbacService.addRoles(userId, [role.id]);
    return this.rbacService.abilityForUser(userId, organizationId);
  }

  async addRoles(userId: string, roleIds: string[]) {
    await this.rbacService.addRoles(userId, roleIds);
  }

  address(): string {
    return ethers.Wallet.createRandom().address;
  }

  async createFundingSession(
    partial: Partial<FundingSession> = {}
  ): Promise<FundingSession> {
    const organizationId =
      partial.organizationId ?? (await this.createOrganization()).id;
    const project = await this.createProject({ organizationId });
    return this.fundingService.createSession({
      organizationId,
      projectIds: [project.id],
      tokenId: (await this.createPaymentToken()).id,
      startDate: faker.date.past(),
      endDate: faker.date.soon(7),
      amount: faker.datatype.number().toString(),
      ...partial,
    });
  }

  async createSkill(partial: Partial<Skill> = {}): Promise<Skill> {
    return this.skillService.create({
      name: faker.commerce.department(),
      emoji: "🔥",
      ...partial,
    });
  }
}

@Module({
  imports: [
    ThreepidModule,
    UserModule,
    OrganizationModule,
    ProjectModule,
    IntegrationModule,
    TaskModule,
    TaskApplicationModule,
    GithubIntegrationModule,
    InviteModule,
    PaymentModule,
    RbacModule,
    NotificationModule,
    FundingModule,
    WorkspaceModule,
    SkillModule,
  ],
  providers: [Fixtures],
  exports: [Fixtures],
})
export class FixturesModule {}
