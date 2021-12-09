import { Invite } from "@dewo/api/models/Invite";
import { OrganizationRole } from "@dewo/api/models/OrganizationMember";
import { User } from "@dewo/api/models/User";
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { OrganizationService } from "../organization/organization.service";

@Injectable()
export class InviteService {
  // private readonly logger = new Logger("UserService");

  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepo: Repository<Invite>,
    private readonly organizationService: OrganizationService
  ) {}

  public async create(
    partial: DeepPartial<Invite>,
    user: User
  ): Promise<Invite> {
    if (!!partial.organizationId) {
      const organizations = await user.organizations;
      if (!organizations.some((o) => o.id === partial.organizationId)) {
        throw new ForbiddenException();
      }
    }

    const created = await this.inviteRepo.save({
      ...partial,
      inviterId: user.id,
    });
    return this.findById(created.id) as Promise<Invite>;
  }

  public async accept(inviteId: string, user: User): Promise<Invite> {
    const invite = await this.inviteRepo.findOne(inviteId);
    if (!invite) throw new NotFoundException();

    if (!!invite.organizationId) {
      const organization = await invite.organization;
      const organizations = await user.organizations;
      if (!organizations.some((o) => o.id === invite.organizationId)) {
        await this.organizationService.addUser(
          organization,
          user,
          OrganizationRole.MEMBER
        );
      }
    }

    return invite;
  }

  public async findById(id: string): Promise<Invite | undefined> {
    return this.inviteRepo.findOne(id);
  }
}
