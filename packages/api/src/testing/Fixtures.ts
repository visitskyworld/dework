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
import { OrganizationMember } from "../models/OrganizationMember";
import { AtLeast, DeepAtLeast } from "../types/general";
import {
  DiscordProjectIntegrationFeature,
  GithubProjectIntegrationFeature,
  ProjectIntegration,
  ProjectIntegrationType,
} from "../models/ProjectIntegration";
import { TaskRewardTrigger } from "../models/TaskReward";
import { PaymentNetwork, PaymentNetworkType } from "../models/PaymentNetwork";
import { PaymentToken, PaymentTokenType } from "../models/PaymentToken";
import { Payment, PaymentData } from "../models/Payment";
import { IntegrationService } from "../modules/integrations/integration.service";
import { IntegrationModule } from "../modules/integrations/integration.module";
import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "../models/OrganizationIntegration";
import { ProjectMember } from "../models/ProjectMember";
import { GithubIssue } from "../models/GithubIssue";
import { ProjectTokenGate } from "../models/ProjectTokenGate";
import { ProjectTokenGateInput } from "../modules/project/dto/ProjectTokenGateInput";
import { TaskSubmission } from "../models/TaskSubmission";

@Injectable()
export class Fixtures {
  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    private readonly projectService: ProjectService,
    private readonly integrationService: IntegrationService,
    private readonly taskService: TaskService,
    private readonly githubService: GithubService,
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
    await Promise.all(
      members.map((member) =>
        this.organizationService.upsertMember({
          ...member,
          organizationId: organization.id,
        })
      )
    );
    return this.organizationService.findById(
      organization.id
    ) as Promise<Organization>;
  }

  public async createProject(
    partialProject: Partial<Project> = {},
    _creator?: User,
    members?: Pick<ProjectMember, "userId" | "role">[]
  ): Promise<Project> {
    const creator = _creator ?? (await this.createUser());
    const organization = await this.createOrganization({}, creator);
    const project = await this.projectService.create(
      {
        name: faker.company.companyName(),
        organizationId: organization.id,
        ...partialProject,
      },
      creator
    );

    if (!members) return project;
    await Promise.all(
      members.map((member) =>
        this.projectService.upsertMember({ ...member, projectId: project.id })
      )
    );
    return this.projectService.findById(project.id) as Promise<Project>;
  }

  public async createProjectIntegration(
    partial: AtLeast<ProjectIntegration, "projectId" | "type" | "config">
  ): Promise<ProjectIntegration> {
    return this.integrationService.createProjectIntegration({
      creatorId: await this.createUser().then((u) => u.id),
      ...partial,
    });
  }

  public async createOrganizationIntegration(
    partial: AtLeast<
      OrganizationIntegration,
      "organizationId" | "type" | "config"
    >
  ): Promise<OrganizationIntegration> {
    return this.integrationService.createOrganizationIntegration({
      creatorId: await this.createUser().then((u) => u.id),
      ...partial,
    });
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
            trigger: TaskRewardTrigger.CORE_TEAM_APPROVAL,
            ...partial.reward,
          }
        : undefined,
    });
  }

  public async getTask(id: string): Promise<Task | undefined> {
    return this.taskService.findById(id);
  }

  public async updateTask(
    partial: DeepAtLeast<Task, "id">
  ): Promise<Task | undefined> {
    return this.taskService.update(partial);
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

  public async createProjectTokenGate(
    input: ProjectTokenGateInput
  ): Promise<ProjectTokenGate> {
    return this.projectService.createTokenGate(input);
  }

  public async createGithubBranch(
    partial: DeepAtLeast<GithubBranch, "name">
  ): Promise<GithubBranch> {
    const task = this.createTask();
    return this.githubService.createBranch({
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
    partial: Partial<PaymentMethod> & { networkIds?: string[] } = {},
    user?: User
  ): Promise<PaymentMethod> {
    return this.paymentService.createPaymentMethod(
      {
        type: PaymentMethodType.METAMASK,
        address: "0x0000000000000000000000000000000000000000",
        networkIds: await this.createPaymentNetwork().then((n) => [n.id]),
        tokenIds: [],
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
    partialProjectIntegration: Partial<ProjectIntegration> = {},
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
    await this.createProjectIntegration({
      projectId: project.id,
      type: ProjectIntegrationType.GITHUB,
      organizationIntegrationId: organizationIntegration.id,
      config: {
        organization: github.organization,
        repo: github.repo,
        features: [
          GithubProjectIntegrationFeature.CREATE_ISSUES_FROM_TASKS,
          GithubProjectIntegrationFeature.SHOW_BRANCHES,
          GithubProjectIntegrationFeature.SHOW_PULL_REQUESTS,
        ],
      },
      ...partialProjectIntegration,
    });
    return { project, github };
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
}

@Module({
  imports: [
    ThreepidModule,
    UserModule,
    OrganizationModule,
    ProjectModule,
    IntegrationModule,
    TaskModule,
    GithubIntegrationModule,
    InviteModule,
    PaymentModule,
  ],
  providers: [Fixtures],
})
export class FixturesModule {}
