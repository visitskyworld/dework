import { Actions, Permissions } from "nest-casl";
import { SubjectType } from "@casl/ability";
import { Roles } from "../app/app.roles";
import { Project } from "@dewo/api/models/Project";

export const ProjectPermissions: Permissions<Roles, SubjectType, Actions> = {
  everyone({ can }) {
    can(Actions.read, Project);
  },

  organizationAdmin({ can }) {
    can(Actions.create, Project);
  },

  projectAdmin({ can }) {
    can(Actions.update, Project);
    can(Actions.delete, Project);
  },
};
