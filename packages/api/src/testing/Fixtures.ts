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

@Injectable()
export class Fixtures {
  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    private readonly projectService: ProjectService,
    private readonly threepidService: ThreepidService
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
  ],
  providers: [Fixtures],
})
export class FixturesModule {}
