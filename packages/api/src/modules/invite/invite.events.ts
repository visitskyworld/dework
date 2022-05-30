import { Invite } from "@dewo/api/models/Invite";
import { User } from "@dewo/api/models/User";

export class InviteAcceptedEvent {
  constructor(public readonly user: User, public readonly invite: Invite) {}
}
