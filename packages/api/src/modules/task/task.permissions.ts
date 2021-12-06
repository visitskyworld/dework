import { Actions, Permissions } from "nest-casl";
import { SubjectType } from "@casl/ability";
import { Roles } from "../app/app.roles";
import { Task } from "@dewo/api/models/Task";

export const TaskPermissions: Permissions<Roles, SubjectType, Actions> = {
  everyone({ can, user }) {
    can(Actions.read, Task);
  },

  projectAdmin({ can }) {
    can(Actions.create, Task);
    can(Actions.update, Task);
    can(Actions.delete, Task);
  },

  projectMember({ can, user }) {
    can(Actions.create, Task);
    can(Actions.update, Task, { assignees: { $elemMatch: { id: user.id } } });
  },
};
