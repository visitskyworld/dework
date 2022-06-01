import { Injectable, Logger, Module } from "@nestjs/common";
import { AppBootstrapModuleImports } from "../modules/app/app.module";
import { NestFactory } from "@nestjs/core";
import { delay } from "bluebird";
import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../models/User";
import { DiscordIntegrationService } from "../modules/integrations/discord/discord.integration.service";
import { Organization } from "../models/Organization";
import { DiscordIntegrationModule } from "../modules/integrations/discord/discord.integration.module";
import { OrganizationIntegrationType } from "../models/OrganizationIntegration";
import _ from "lodash";

@Injectable()
export class AddUserToDiscordServersService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
    private readonly discordIntegration: DiscordIntegrationService
  ) {}

  public async run() {
    const organizations = await this.organizationRepo
      .createQueryBuilder("organization")
      .innerJoinAndSelect("organization.integrations", "integration")
      .where("integration.type = :discord", {
        discord: OrganizationIntegrationType.DISCORD,
      })
      // .andWhere("organization.slug = 'dework'")
      .getMany();

    const user = await this.userRepo.findOneOrFail(
      "87617018-c328-4ecc-9128-13007726c2fc"
    );

    for (const organization of organizations.slice(92)) {
      const index = organizations.indexOf(organization);
      this.logger.log(
        `Adding user "${user.username}" to "${organization.name}" (${
          index + 1
        }/${organizations.length})`
      );

      try {
        await this.discordIntegration.addUserToDiscordGuild(
          organization.id,
          user.id
        );

        this.logger.log(`Added: ${organization.name}`);
      } catch (error) {
        const errorString = JSON.stringify(
          error,
          Object.getOwnPropertyNames(error)
        );
        this.logger.error(
          `Failed adding user: ${JSON.stringify({
            error: errorString,
            organization: organization.name,
          })}`
        );
      }

      await delay(_.random(4000, 10000));
    }
  }
}

@Module({
  imports: [
    ...AppBootstrapModuleImports!,
    DiscordIntegrationModule,
    TypeOrmModule.forFeature([User, Organization]),
  ],
  providers: [AddUserToDiscordServersService],
})
export class AddUserToDiscordServersModule {}

async function run() {
  const app = await NestFactory.create(AddUserToDiscordServersModule);
  await app.init();
  const service = app.get(AddUserToDiscordServersService);
  await service.run();
  await app.close();
  process.exit(0);
}

run();
