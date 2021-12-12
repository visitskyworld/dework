import { Actions, Permissions } from "nest-casl";
import { SubjectType } from "@casl/ability";
import { Roles } from "../app/app.roles";
import { Organization } from "@dewo/api/models/Organization";
import { Project } from "@dewo/api/models/Project";
import { Task } from "@dewo/api/models/Task";
import { OrganizationMember } from "@dewo/api/models/OrganizationMember";

export const permissions: Permissions<Roles, SubjectType, Actions> = {
  everyone({ can, user }) {
    can(Actions.read, Organization);
    can(Actions.create, Organization);

    can(Actions.read, Project);
    can(Actions.read, Task);

    can(Actions.update, Task, { assignees: { $elemMatch: { id: user.id } } });
  },

  organizationOwner({ extend }) {
    extend(Roles.organizationAdmin);
  },

  organizationAdmin({ can, user, extend }) {
    extend(Roles.organizationMember);

    can(Actions.create, OrganizationMember);
    can(Actions.update, OrganizationMember, { userId: { $ne: user.id } });
    can(Actions.delete, OrganizationMember);

    can(Actions.update, Organization);
    can(Actions.delete, Organization);
    can(Actions.create, Project);
  },

  organizationMember({ can, user }) {
    can(Actions.update, Task);
  },

  projectAdmin({ can }) {
    can(Actions.update, Project);
    can(Actions.delete, Project);

    can(Actions.create, Task);
    can(Actions.update, Task);
    can(Actions.delete, Task);
  },

  projectMember({ can }) {
    can(Actions.create, Task);
  },
};
