import { Actions, Permissions } from "nest-casl";
import { SubjectType } from "@casl/ability";
import { Roles } from "../app/app.roles";
import { Organization } from "@dewo/api/models/Organization";

export const OrganizationPermissions: Permissions<Roles, SubjectType, Actions> =
  {
    everyone({ can }) {
      can(Actions.read, Organization);
    },

    organizationAdmin({ can }) {
      can(Actions.update, Organization);
      can(Actions.delete, Organization);
    },
  };
